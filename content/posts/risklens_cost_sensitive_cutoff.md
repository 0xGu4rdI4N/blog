---
title: 'Pricing the mistake: choosing a credit cutoff in rupees, not accuracy'
date: '2026-11-23'
readTime: '14 min'
type: 'project'
tags: ['credit risk', 'lightgbm', 'cost-sensitive learning', 'calibration', 'shap', 'psi']
excerpt: 'A credit-default model whose approve/decline cutoff is chosen by minimising rupee loss instead of defaulting to 0.5: LightGBM vs a scorecard, Platt calibration, an approval lift with an honest error bar, SHAP reason codes and PSI drift. All code runs in about eight seconds.'
---

**TL;DR:** I built a credit-default model that picks its approve/decline cutoff by minimising rupee loss instead of defaulting to 0.5. On 12,000 held-out synthetic applicants, LightGBM at its loss-minimising cutoff loses Rs 11,615,478, against Rs 13,438,410 for a logistic scorecard at the scorecard's own best cutoff. That is 13.6% less. The claim that it can also approve more people at the same risk is weaker than it first looks: +3.91 points, with a 95% bootstrap interval of [-0.77, +6.69]. The whole thing runs on a laptop in about eight seconds.

*Assumes: you know `fit`/`predict` in scikit-learn and what precision and recall mean. Tested with Python 3.12.14, numpy 2.5.4, pandas 3.0.6, lightgbm 4.7.0 and scikit-learn 1.9.1. All code runs on CPU.*

:::note
**All data here is synthetic.** I wrote the generator, so the labels come from a formula I chose. That makes the absolute numbers a statement about my generator, not about real borrowers. What carries over is the method, and the places where it went wrong.
:::

---

## Why accuracy is the wrong question

In the data below, 5.96% of applicants default. A model that approves everybody is 94% accurate and loses the bank a fortune. Accuracy treats every error as equal, and in lending they are not.

There are two ways to be wrong. If you approve someone who then defaults, you lose most of what you lent. If you decline someone who would have repaid, you lose the margin you would have earned. In this project the first costs `EAD x LGD` rupees per account (about Rs 120,794 for the average defaulter in the test set, as cell 6 prints below) and the second costs a flat Rs 3,500. Those two numbers are my assumptions, and the whole analysis depends on them. A flagged application that gets declined also costs Rs 450 of manual review.

A 0.5 cutoff quietly says "both mistakes cost the same". They differ by a factor of about 35, so the cutoff should move. The question is where, and whether the model's probabilities are good enough to trust once you move it.

## The mental model

The system has three stages, and you can swap any of them without touching the others. A model ranks applicants by risk. A calibration step turns that ranking into probabilities that mean what they say. A cutoff turns each probability into a decision by comparing expected costs.

![From applicant to decision: score every applicant with two models, calibrate LightGBM, search for the cheapest cutoff, then decide and explain.](/blog/images/risklens/pipeline.png)

## How it works

Take applicant $i$ with predicted default probability $p_i$. Write $L_i = \text{EAD}_i \times \text{LGD}_i$ for the loss if they default after approval: EAD is the exposure at default (how much they would owe), and LGD is the loss given default (the share of that the bank cannot recover). Let $c_{FP} = 3500$ be the cost of declining a good customer and $c_{rev} = 450$ the review cost.

Approving costs $p_i L_i$ in expectation. Declining costs $(1 - p_i)\,c_{FP} + p_i\,c_{rev}$. Approve exactly when the first is smaller:

:::cent
$$ p_i < \frac{c_{FP}}{L_i - c_{rev} + c_{FP}} $$
:::

That is the whole decision rule, and two things follow from it. The cutoff depends on $L_i$, so a large loan deserves a stricter cutoff than a small one. And the rule multiplies by $p_i$, so it only works if $p_i$ is a real probability. A model whose "0.30" means "somewhere in the riskiest few percent" breaks it, which is why the calibration step exists.

In the code the cutoff is found by brute force instead of by this formula. `ThresholdOptimizer` tries 250 cutoffs between 0.005 and 0.70, adds up the actual per-account costs at each, and keeps the cheapest. It uses each person's real $L_i$, which the single-number formula cannot.

## Building it step by step

### Step 1: setup

Cell 1 pins nothing because I run the repo from source, but it prints the versions so you can compare against yours. To reproduce this outside the repo, the install line is in the comment at the top.

```python
# To reproduce outside this repo:
#   pip install "git+https://github.com/0xGu4rdI4N/risk_lens"
import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
import lightgbm, sklearn

SEED = 42
np.random.seed(SEED)
pd.options.display.float_format = "{:,.4f}".format
print(f"numpy {np.__version__} | pandas {pd.__version__} | lightgbm {lightgbm.__version__} | sklearn {sklearn.__version__}")
```
```text
numpy 2.5.4 | pandas 3.0.6 | lightgbm 4.7.0 | sklearn 1.9.1
```
### Step 2: generate the applicants

The generator draws 13 applicant facts from distributions with realistic links between them (income drives credit lines and requested limit, utilisation feeds debt-to-income and inquiries). It then computes a hidden risk score from a hand-written formula, squashes it into a probability called `true_risk_prob`, and flips a weighted coin to produce `is_default`. A second cohort of 20,000 is generated with deliberately worse inputs, to give the drift monitor something to find.

```python
from risklens.data.generator import generate_train_oot_splits

df, df_oot = generate_train_oot_splits(n_train=80_000, n_oot=20_000, random_state=SEED)
print("in-time:", df.shape, "| out-of-time:", df_oot.shape)
print(f"default rate: in-time {df.is_default.mean():.2%} | out-of-time {df_oot.is_default.mean():.2%}")

bands = pd.cut(df.cibil_score, [0, 550, 650, 750, 900], labels=["<=550", "551-650", "651-750", ">750"])
print(df.groupby(bands, observed=True).is_default.agg(applicants="size", default_rate="mean"))
```
```text
in-time: (80000, 19) | out-of-time: (20000, 19)
default rate: in-time 5.96% | out-of-time 11.94%
             applicants  default_rate
cibil_score                          
<=550              4213        0.6729
551-650           18623        0.0830
651-750           34910        0.0094
>750              22254        0.0025
```
The in-time cohort defaults at 5.96% and the shifted one at 11.94%. The band table is the most useful output here. Applicants with a credit score of 550 or below default 67.29% of the time; above 750 it is 0.25%. One feature does most of the work in this data, because I wrote it that way. Keep that in mind when you read the model comparison below, because it limits how much any model can be better than another.

### Step 3: split and preprocess

The split is by row position: the first 56,000 rows train, the next 12,000 calibrate, the last 12,000 test. The preprocessor fills any missing numbers with the median, rescales each number as $(x - \text{median}) / \text{IQR}$ so that income in lakhs and utilisation below one are comparable, and one-hot encodes the two categorical columns. It is fit on the training rows only. If you fit it on everything, the test set leaks into the scaling.

```python
from risklens.data.preprocessor import CreditRiskPreprocessor

train, calib, test = df.iloc[:56_000], df.iloc[56_000:68_000], df.iloc[68_000:]
prep = CreditRiskPreprocessor().fit(train)
X_train, X_calib, X_test = (prep.transform(d) for d in (train, calib, test))
y_train, y_calib, y_test = (d.is_default.values for d in (train, calib, test))

print("model inputs:", X_train.shape[1], "columns:", prep.get_feature_names()[:3], "...")
print(f"test set: {len(y_test):,} applicants, {y_test.sum()} defaults")
row = test.iloc[[0]]
print(f"cibil_score {row.cibil_score.iloc[0]:.0f} -> {prep.transform(row)[0][prep.get_feature_names().index('cibil_score')]:+.3f}")
```
```text
model inputs: 19 columns: ['annual_income', 'cibil_score', 'revolving_utilization'] ...
test set: 12,000 applicants, 706 defaults
cibil_score 646 -> -0.479
```
Thirteen raw features become 19 model inputs: 11 rescaled numbers, five merchant-category columns and three employment columns. The test set has 12,000 applicants and 706 defaults. The last line shows one applicant: a credit score of 646 becomes -0.479, meaning about half an interquartile range below the median.

### Step 4: train two models and compare them

The baseline is a logistic regression with `class_weight="balanced"`: a weighted sum of the features, which cannot represent combinations. The challenger is LightGBM with 250 trees of depth at most 6 and `scale_pos_weight=15`, which counts each defaulter 15 times in training. I score both with PR-AUC, the area under the precision-recall curve. With 6% positives, random guessing scores about 0.06, so the scale is more honest than accuracy.

I also score the generator's own `true_risk_prob`. No model can do better than that on this data, so it is the ceiling.

```python
from sklearn.metrics import average_precision_score
from risklens.models.baseline import LogisticScorecardBaseline
from risklens.models.tree_models import LightGBMRiskClassifier

scorecard = LogisticScorecardBaseline().fit(X_train, y_train)
gbm = LightGBMRiskClassifier().fit(X_train, y_train)

p_score, p_gbm = scorecard.predict_proba(X_test), gbm.predict_proba(X_test)
pr = lambda p: average_precision_score(y_test, p)
print(f"scorecard PR-AUC {pr(p_score):.4f}")
print(f"LightGBM  PR-AUC {pr(p_gbm):.4f}")
print(f"oracle    PR-AUC {pr(test.true_risk_prob.values):.4f}  (the generator's own probabilities)")
```
```text
scorecard PR-AUC 0.7248
LightGBM  PR-AUC 0.7485
oracle    PR-AUC 0.7611  (the generator's own probabilities)
```
LightGBM scores 0.7485 against 0.7248 for the scorecard. The oracle scores 0.7611. So LightGBM sits only 0.0126 below the ceiling. Synthetic data makes this look better than it is: the generator has interaction terms (a bonus when utilisation, inquiries and debt are all high), so a tree model beats a linear one by construction. On real data there is no oracle to compare against, and I would not expect to land this close.

### Step 5: calibrate

Because training counted defaulters 15 times, LightGBM's raw scores are inflated. The ranking is fine; the numbers are not probabilities. Platt scaling fits a small logistic regression, on the 12,000 calibration rows the model has not seen, that maps raw scores to honest ones. Since the mapping is monotone, it cannot change who ranks above whom.

```python
from scipy.stats import spearmanr
from risklens.models.calibrator import ProbabilityCalibrator

calibrator = ProbabilityCalibrator(method="sigmoid").fit(gbm.model, X_calib, y_calib)
p_cal = calibrator.predict_proba(X_test)

raw_eval = calibrator.evaluate_calibration(y_test, p_gbm)
cal_eval = calibrator.evaluate_calibration(y_test, p_cal)
print(f"Brier  raw {raw_eval['brier_score']:.4f} -> calibrated {cal_eval['brier_score']:.4f}")
print(f"ECE    raw {raw_eval['ece']:.4f} -> calibrated {cal_eval['ece']:.4f}")
print(f"mean predicted risk {p_gbm.mean():.3f} -> {p_cal.mean():.3f} (actual default rate {y_test.mean():.3f})")
print(f"rank correlation raw vs calibrated: {spearmanr(p_gbm, p_cal)[0]:.4f}")
```
```text
Brier  raw 0.0586 -> calibrated 0.0262
ECE    raw 0.1075 -> calibrated 0.0023
mean predicted risk 0.166 -> 0.060 (actual default rate 0.059)
rank correlation raw vs calibrated: 1.0000
```
The mean predicted risk drops from 0.166 to 0.060, against an actual default rate of 0.059. Brier score, the mean squared error of the probabilities, falls from 0.0586 to 0.0262, and expected calibration error from 0.1075 to 0.0023. The rank correlation of 1.0000 confirms that ordering is untouched, so PR-AUC is identical before and after.

Calibration fixes the numbers. Whether it improves *decisions* is a separate question, and the next step answers it.

### Step 6: price the mistakes and sweep the cutoff

Now the cost model. For each model, the optimiser tries 250 cutoffs, totals the rupee loss on the 12,000 test applicants at each, and keeps the cheapest. I run it for three score sets: the scorecard, raw LightGBM, and calibrated LightGBM. The first two printed lines show the average cost of each mistake and the cutoff a simple formula would give. The next three give each score set's best cutoff and its loss. The figure shows the loss curves for the scorecard and the calibrated model.

```python
import matplotlib.pyplot as plt
from risklens.cost.optimizer import ThresholdOptimizer

ead, lgd = test.exposure_at_default.values, test.loss_given_default.values
L = (ead * lgd)[y_test == 1].mean()                        # average loss when we approve a defaulter
print(f"approve a defaulter: Rs {L:,.0f} | decline a good customer: Rs 3,500 | review a flagged one: Rs 450")
print(f"break-even risk 3500 / (L - 450 + 3500) = {3500 / (L - 450 + 3500):.3f}")

opt = ThresholdOptimizer()
res = {name: opt.optimize_threshold(y_test, p, ead=ead, lgd=lgd) for name, p in
       [("scorecard", p_score), ("LightGBM raw", p_gbm), ("LightGBM + calibration", p_cal)]}

for name, r in res.items():
    print(f"{name:24s} cutoff {r['optimal_threshold']:.3f} | approves {r['optimal_approval_rate']:.1%} | "
          f"loss at 0.5: Rs {r['naive_loss_rupees']:,.0f} | at best cutoff: Rs {r['min_expected_loss_rupees']:,.0f}")

fig, ax = plt.subplots(figsize=(7, 3.6))
for name, r in res.items():
    if name == "LightGBM raw":
        continue
    c = r["curve_dataframe"]
    ax.plot(c.threshold, c.total_loss_rupees / 1e5, label=name)
    ax.scatter([r["optimal_threshold"]], [r["min_expected_loss_rupees"] / 1e5], zorder=3)
ax.set_xlabel("decline if predicted risk is above this cutoff"); ax.set_ylabel("total loss (Rs lakh)")
ax.set_ylim(0, 400); ax.legend(); plt.tight_layout(); plt.show()
```
```text
approve a defaulter: Rs 120,794 | decline a good customer: Rs 3,500 | review a flagged one: Rs 450
break-even risk 3500 / (L - 450 + 3500) = 0.028
scorecard                cutoff 0.491 | approves 82.8% | loss at 0.5: Rs 13,488,613 | at best cutoff: Rs 13,438,410
LightGBM raw             cutoff 0.304 | approves 82.9% | loss at 0.5: Rs 15,726,440 | at best cutoff: Rs 11,532,068
LightGBM + calibration   cutoff 0.044 | approves 83.0% | loss at 0.5: Rs 36,899,988 | at best cutoff: Rs 11,615,478
```
![Total loss against cutoff for the scorecard and calibrated LightGBM, with the minimum of each marked.](/blog/images/risklens/cell-06-out-1.png)
The break-even formula, using the average loss of Rs 120,794, gives a cutoff of 0.028. The search finds 0.044. They are the same order of magnitude but not equal, because the formula uses one average loss for everyone and the search uses each person's real loss.

The table is more interesting than the headline:

| Scores | Best cutoff | Approves | Loss at best cutoff | Loss at 0.5 |
| :--- | :---: | :---: | :---: | :---: |
| Scorecard | 0.491 | 82.8% | Rs 13,438,410 | Rs 13,488,613 |
| LightGBM, raw | 0.304 | 82.9% | Rs 11,532,068 | Rs 15,726,440 |
| LightGBM, calibrated | 0.044 | 83.0% | Rs 11,615,478 | Rs 36,899,988 |

Three things stand out.

First, the scorecard's best cutoff is 0.491, almost exactly the naive 0.5. I did not test why, but the likely cause is that `class_weight="balanced"` inflates its scores the way `scale_pos_weight` inflates LightGBM's, so its 0.5 already behaves like a stricter cutoff. The calibrated model at 0.5, by contrast, loses Rs 36,899,988, about 3.2 times its own best. "A 0.5 cutoff is disastrous" is only true if your probabilities are honest. The cutoff means nothing apart from the scale of the scores it is applied to.

Second, all three approve nearly the same share of applicants, between 82.8% and 83.0%. The Rs 1,822,932 gap between the scorecard and calibrated LightGBM (13.6% of the scorecard's loss) comes from *which* people get approved, not how many.

Third, calibration did not help the decision. Raw LightGBM at its best cutoff loses Rs 11,532,068, slightly less than the calibrated model's Rs 11,615,478. Calibration moved the best cutoff from 0.304 to 0.044 and made the probabilities trustworthy for per-account expected loss, which is what the API reports, but it bought nothing in total loss here. Every cutoff in this table was also tuned on the test set it is scored on, so all of these losses are slightly optimistic. A cleaner protocol would pick the cutoff on the calibration split.

![Animation: as the cutoff slides from 0.69 down to 0.005, the cost of approved defaulters falls, the cost of declined good customers rises, and the total loss bottoms out near a cutoff of 0.044 at 116.15 lakh.](/blog/images/risklens/cutoff-sweep.gif)

### Step 7: how many more people can we approve at the same risk?

A lower loss is one claim. A commercial claim is "approve more people without taking more risk". To test it, I fix the scorecard's operating point at 78% approval, record the default rate among the people it approves, then ask how many applicants LightGBM could approve while keeping its approved-default rate at or below that. I resample the test set 500 times to put an error bar on the result.

```python
from risklens.cost.frontier import ApprovalFrontierEngine

lift = ApprovalFrontierEngine().compute_approval_expansion(
    y_test, p_score, p_cal, ead=ead, lgd=lgd, baseline_approval_rate=0.78, n_bootstrap=500, seed=0)
m, b = lift["lift_metrics"], lift["bootstrap"]
print(f"scorecard approves {lift['baseline']['approval_rate_pct']:.2f}% | LightGBM approves {lift['risklens_expansion']['approval_rate_pct']:.2f}%")
print(f"lift {m['approval_lift_pct_points']:+.2f} pts = {m['additional_approved_accounts']} accounts")
lo, hi = b["lift_pct_points_ci95"]
print(f"bootstrap 95% CI [{lo:+.2f}, {hi:+.2f}] | positive in {b['share_of_resamples_with_positive_lift']:.1%} of resamples")

# second matching rule: hold the loss from approved defaulters constant instead
lift2 = ApprovalFrontierEngine().compute_approval_expansion(
    y_test, p_score, p_cal, ead=ead, lgd=lgd, baseline_approval_rate=0.78, match="fn_loss", n_bootstrap=500, seed=0)
lo2, hi2 = lift2["bootstrap"]["lift_pct_points_ci95"]
print(f"matched on default loss instead: {lift2['lift_metrics']['approval_lift_pct_points']:+.2f} pts, 95% CI [{lo2:+.2f}, {hi2:+.2f}]")
```
```text
scorecard approves 78.00% | LightGBM approves 81.91%
lift +3.91 pts = 469 accounts
bootstrap 95% CI [-0.77, +6.69] | positive in 95.2% of resamples
matched on default loss instead: +5.18 pts, 95% CI [+0.07, +6.97]
```
At matched risk the scorecard approves 78.00% and LightGBM 81.91%, a lift of 3.91 percentage points, or 469 accounts out of 12,000. The 95% bootstrap interval is [-0.77, +6.69] and the lift is positive in 95.2% of resamples.

So the point estimate is a gain of a few points, and the data cannot rule out zero. I would say "probably better, not proven" and leave it there. The last line of output matches on a different rule: hold the *loss* from approved defaulters constant instead of their default rate. That gives +5.18 points with an interval of [+0.07, +6.97], which only just clears zero. The two rules disagree about how convincing the lift is, and I would rather show both than pick the flattering one. 

### Step 8: explain a decline

A declined applicant is owed a reason. TreeSHAP gives each feature an exact contribution to this applicant's score, measured in log-odds on LightGBM's raw margin. `AdverseActionGenerator` keeps only the features that pushed risk *up* and maps each to a reason code. Those codes are illustrative; nothing here has been reviewed against any lending regulation.

I take the first declined applicant who actually defaulted.

```python
from risklens.explainability.explainer import RiskLensExplainer
from risklens.explainability.adverse_action import AdverseActionGenerator

tau = res["LightGBM + calibration"]["optimal_threshold"]
explainer = RiskLensExplainer(gbm.model, prep.get_feature_names())
i = int(np.argmax((p_cal > tau) & (y_test == 1)))          # first declined applicant who really defaults
top = explainer.explain_instance(X_test[i], top_k=4)
print(f"applicant {i}: risk {p_cal[i]:.1%} vs cutoff {tau:.1%} -> DECLINED")
for t in top:
    print(f"  {t['feature']:26s} shap {t['shap_value']:+.2f}  {t['direction']}")
for reason in AdverseActionGenerator.generate_reasons(top, max_reasons=3):
    print(" ", reason)
```
```text
applicant 1: risk 76.0% vs cutoff 4.4% -> DECLINED
  cibil_score                shap +6.54  RISK_INCREASING
  debt_to_income             shap +0.32  RISK_INCREASING
  device_risk_score          shap -0.26  RISK_DECREASING
  inquiries_last_6m          shap -0.22  RISK_DECREASING
  [AAR-01] Credit bureau score does not meet minimum underwriting criteria
  [AAR-03] Total monthly debt obligations too high relative to verified gross monthly income
```
Applicant 1 has a predicted risk of 76.0% against a cutoff of 4.4%. The `cibil_score` contribution is +6.54, an order of magnitude larger than anything else; `debt_to_income` adds +0.32. Two features, `device_risk_score` (-0.26) and `inquiries_last_6m` (-0.22), pushed the score *down*, so they are correctly left out of the reasons. The output is two codes: AAR-01 for the bureau score and AAR-03 for debt-to-income.

One feature dominates because the generator makes one feature dominate. A real model would give a more mixed explanation, and the reason codes would be harder to write.

### Step 9: watch for drift

A model trained on last year's applicants is scored on this year's. The Population Stability Index compares the share of applicants falling in each of 10 bins between a reference and a new population:

:::cent
$$ \text{PSI} = \sum_{b} (A_b - E_b)\,\ln\frac{A_b}{E_b} $$
:::

where $E_b$ and $A_b$ are the expected (reference) and actual (new) shares in bin $b$. The usual rule of thumb is below 0.10 stable, 0.10 to 0.20 worth watching, above 0.20 act. The reference here is the test set and the new population is the shifted out-of-time cohort. Of the features I checked, I shifted credit score and utilisation on purpose and left income alone.

```python
from risklens.monitoring.psi import PSICalculator

psi = PSICalculator()
X_oot = prep.transform(df_oot)
checks = {
    "model score": (p_cal, calibrator.predict_proba(X_oot)),
    "revolving_utilization": (test.revolving_utilization.values, df_oot.revolving_utilization.values),
    "cibil_score": (test.cibil_score.values, df_oot.cibil_score.values),
    "annual_income": (test.annual_income.values, df_oot.annual_income.values),
}
for name, (a, b_) in checks.items():
    r = psi.calculate_continuous_psi(a, b_)
    print(f"{name:24s} PSI {r['psi']:.3f}  {r['status']}")
```
```text
model score              PSI 0.188  WARNING
revolving_utilization    PSI 1.103  SEVERE_DRIFT
cibil_score              PSI 0.142  WARNING
annual_income            PSI 0.002  STABLE
```
Income reads 0.002, stable, which is the control. Credit score reads 0.142 and the model score 0.188, both in the warning band, just below the action line. Revolving utilisation reads 1.103, far past it.

The score's PSI is far lower than its worst input's. Watch only the model's output and you see a warning; watch the inputs and you see a fire. Monitor the features as well as the score.

## What the results show

| Question | Result |
| :--- | :--- |
| Does LightGBM rank better than the scorecard? | PR-AUC 0.7485 vs 0.7248, with the oracle at 0.7611 |
| Are its probabilities trustworthy after Platt scaling? | Brier 0.0586 to 0.0262, ECE 0.0023 |
| Does it lose less money at each model's best cutoff? | Rs 11,615,478 vs Rs 13,438,410, 13.6% less |
| Does it approve more at matched risk? | +3.91 points, 95% CI [-0.77, +6.69] |
| Does calibration lower the loss? | No: raw LightGBM is slightly lower at its best cutoff |
| Does drift show up? | Yes, strongly in utilisation (1.103), mildly in the score (0.188) |

## Trade-offs and limits

- **The data is synthetic.** The generator contains interaction terms that favour trees, and one feature carries most of the signal. The gap to the oracle being 0.0126 says more about my generator than about LightGBM.
- **One dataset, one seed, one split.** I did not repeat this across seeds. The bootstrap resamples the test set but not the training.
- **The cutoff was tuned on the test set.** Every loss above is optimistic by some unknown amount.
- **The costs are assumptions.** Rs 3,500 for a declined good customer, Rs 450 for a review, and the EAD and LGD distributions are mine. Change them and the cutoff moves.
- **Default and fraud share one label.** This is a default model with a few fraud-style features, not a fraud detector.
- **Calibration did not improve decisions here.** It is still needed if you want per-account expected loss to mean something, which is how the API uses it.
- **Nothing is validated for regulatory use.** The reason codes illustrate the mechanism and nothing more.

## Where the field is now

TreeSHAP is the standard way to explain a gradient-boosted model exactly rather than approximately ([Lundberg et al., 2019](https://arxiv.org/abs/1905.04610)). Post-hoc calibration, including Platt scaling and its variants, is surveyed in [Guo et al., 2017](https://arxiv.org/abs/1706.04599). On the modelling side, tabular foundation models are the obvious thing to try against LightGBM; the latest report in that line is [TabPFN-3.5](https://arxiv.org/abs/2609.17895). I have not benchmarked it on this data, so I make no claim about it.

## Conclusion

The model cannot choose the cutoff for you, because it is a business decision. Put prices on the two mistakes, check that your probabilities are real, and search for the cutoff that minimises total cost. Here that made LightGBM 13.6% cheaper than a scorecard, and it showed that the scorecard looking fine at 0.5 was probably an accident of how it was trained. The approval lift, the most commercially attractive claim, did not clearly survive an error bar: one matching rule puts zero inside the interval and the other barely clears it. I would rather report that than the version that looks better.

The code, including a PySpark port of the scoring, loss search and PSI steps (which is slower than pandas at this size, as the README says), is at [github.com/0xGu4rdI4N/risk_lens](https://github.com/0xGu4rdI4N/risk_lens).

## Further reading

- [Lundberg and Lee, 2017](https://arxiv.org/abs/1705.07874): the SHAP framework, which unifies several explanation methods.
- [Lundberg et al., 2019](https://arxiv.org/abs/1905.04610): the exact tree algorithm used in step 8.
- [Guo et al., 2017](https://arxiv.org/abs/1706.04599): why raw scores are not probabilities and how post-hoc calibration works.
- [TabPFN-3.5 technical report](https://arxiv.org/abs/2609.17895): a candidate replacement for the LightGBM step.
