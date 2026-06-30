---
title: 'Deep Evidential Regression: A Review'
date: '2026-06-30'
type: 'fundamental, uq, regression'
---

This is a follow-up article from [Amitesh's post on Evidential Learning](https://amiteshbadkul.github.io/blog/2026/evidential-learning/), which covers uncertainty quantification (UQ) for discrete classification tasks. It's a great pre-read. 

Citing from the same, imagine an image classification model trained on car vs. truck tasks, but which is being inferred for, let's say, a horse image. The model's softmax would still output something like `[0.6, 0.4]` and is incapable of saying that it *doesn't know* because this example doesn't match anything it was trained on. This is the main motivator behind UQ: to give the model the capability of expressing its uncertainty.

In this article, we will review the [Deep Evidential Regression paper](https://arxiv.org/pdf/1910.02600) by A. Amini :cite[amini2020]. It's a workaround of the original [Evidential Deep Learning paper by Sensoy](https://arxiv.org/pdf/1806.01768) :cite[sensoy2018], to enable UQ on regression tasks.

**Epistemic uncertainty is:** "How much does the model not know about the true function at this point?" It can be both high in the In-Distribution (ID) region and low in the Out-Of-Distribution (OOD) region. ID/OOD is a statement about the **data distribution**. Epistemic uncertainty is a statement about **model knowledge**.

Precise and calibrated uncertainty estimates are useful for interpreting confidence, capturing domain shift of out-of-distribution (OOD) test samples, and recognizing when the model is likely to fail.

There are two axes of NN uncertainty that can be modeled: 
1. Uncertainty in the data, called **aleatoric uncertainty**.
2. Uncertainty in the prediction, called **epistemic uncertainty**.

There exist several approaches for estimating epistemic uncertainty, such as Bayesian NNs, which place probabilistic priors over network weights and use sampling to approximate output variance :cite[blundell2015]. However, Bayesian NNs face several limitations, including the intractability of directly inferring the posterior distribution of the weights given data, the requirement and computational expense of sampling during inference (this refers to multiple inference runs on the same input but with different weights based on the approximate posterior), and the question of how to choose a weight prior.

Instead of placing priors on network weights, as is done in Bayesian NNs, evidential approaches place priors directly over the **likelihood function**. By training a neural network to output the hyperparameters of the higher-order evidential distribution, a grounded representation of both epistemic and aleatoric uncertainty can then be learned without the need for sampling.

---

## The Evidential Regression Framework

We consider the problem where the observed targets, $y_i$, are drawn i.i.d. from a Gaussian distribution, as in standard MLE, but now with unknown mean and variance $(\mu, \sigma^2)$, which we seek to also probabilistically estimate. Here the paper actually proposed a vague definition as given below:

$$ p(y_1, \dots, y_N | \mu, \sigma^2) = \prod_{i=1}^N \frac{1}{\sqrt{2\pi\sigma^2}} \exp \left( -\frac{(y_i - \mu)^2}{2\sigma^2} \right) $$

Here it's saying that all targets are sampled from a common normal distribution, but this is vague, because each task output is dependent on the corresponding $x_i$. So the paper is being slightly loose. It really means:

- **Independent** — yes, strictly
- **Identically distributed** — only in the sense that the same network generates all $(\mu_i, \sigma_i^2)$, not that every sample comes from the literal same Gaussian.

> A better setting would have been:
> $$y_i | x_i \sim \mathcal{N}(\mu_i, \sigma_i^2)$$
> where $\mu_i = f_\mu(x_i; w)$ and $\sigma_i^2 = f_\sigma(x_i; w)$

In standard MLE, $\mu$ and $\sigma^2$ are **fixed but unknown constants**. The network learns single fixed values for them.

Now the paper says: what if $\mu$ and $\sigma^2$ are **not fixed**? What if we are also uncertain about what the true $\mu$ and $\sigma^2$ are?

In a crux, instead of saying:
- *"yᵢ comes from a Gaussian with fixed μᵢ, σᵢ²"*

We say:
- *"yᵢ comes from a Gaussian, but we don't even know μᵢ and σᵢ² exactly, they are themselves random variables."*

This embeds the learning of epistemic uncertainty into the learning of the model. 

*NOTE: In the normal MLE settings, the model would have learnt $(\mu_i, \sigma_i^2) = f(x_i; w)$ which only covers the aleatoric uncertainty, i.e., $\sigma_i^2$.*

$$ \underbrace{p(\mu, \sigma^2 | y_1, \dots, y_N)}_{\text{Posterior}} = \frac{\underbrace{p(y_1, \dots, y_N | \mu, \sigma^2)}_{\text{Likelihood}} \underbrace{p(\mu, \sigma^2)}_{\text{Prior}}}{p(y_1, \dots, y_N)} $$

Again, the paper does its sloppy act and talks of computing a posterior over $\mu$ and $\sigma^2$ given the examples. This didn't make sense to me, so I reasoned a lot with Claude over this and we came to a common decision.

<details>
<summary><strong>CLAUDE's response on Posterior Framing</strong></summary>
<div className="mt-4">

**The notation $p(\mu, \sigma^2 | y_1...y_n)$ is problematic for two reasons:**

**Reason 1: Which $\mu, \sigma^2$?**
As you correctly identified — in heteroscedastic regression each input has its own $(\mu_i, \sigma_i^2)$. So asking for a posterior over a single $(\mu, \sigma^2)$ given all $N$ observations makes no sense. It would need to be a **per-input** posterior conditioned on that specific observation and input, not a global posterior over all $N$ points.

**Reason 2: $\mu, \sigma^2$ are outputs, not parameters**
A posterior is meaningful when you are being uncertain about **parameters** — like weights $w$ in a Bayesian NN. But here $(\mu_i, \sigma_i^2)$ are deterministic outputs of the network given $x_i$. There is nothing to put a posterior over in the traditional sense.

What the paper is really doing is placing a **prior** over $(\mu_i, \sigma_i^2)$ for each input and then maximizing the marginal likelihood — not computing any posterior at all.

**Bottom line:**
The posterior framing in Section 3.1 is largely cosmetic. The paper never computes a posterior, never uses the posterior, and the notation $p(\mu, \sigma^2 | y_1...y_n)$ is technically incoherent given the heteroscedastic setup. It is misleading framing dressed up to sound Bayesian.

</div>
</details>

So for now, you can settle on the fact that we have designed the prior over $\mu_i$ and $\sigma_i^2$ as a **Normal Inverse-Gamma (NIG)** distribution.

The NIG prior factorizes as:
$$p(\mu, \sigma^2) = p(\mu | \sigma^2) \cdot p(\sigma^2)$$

where:
- $\mu | \sigma^2 \sim \mathcal{N}(\gamma, \sigma^2\nu^{-1})$
- $\sigma^2 \sim \Gamma^{-1}(\alpha, \beta)$

Multiplying these two densities gives the NIG distribution:
$$p(\mu, \sigma^2 | \gamma, \nu, \alpha, \beta) = \frac{\beta^\alpha \sqrt{\nu}}{\Gamma(\alpha)\sqrt{2\pi\sigma^2}} \cdot \left(\frac{1}{\sigma^2}\right)^{\alpha+1} \cdot \exp\left\{-\frac{2\beta + \nu(\gamma-\mu)^2}{2\sigma^2}\right\}$$

From the paper:
> A popular interpretation of the parameters of this conjugate prior distribution is in terms of "virtual observations" in support of a given property. For example, the mean of a NIG distribution can be intuitively interpreted as being estimated from $\nu$ virtual-observations with sample mean $\gamma$, while its variance is estimated from $\alpha$ virtual-observations with sample mean $\gamma$ and sum of squared deviations $2\nu$. Following from this interpretation, we define the total evidence, $\Phi$, of our evidential distributions as the sum of all inferred virtual-observations counts: $\Phi = 2\nu + \alpha$.

*"In this work, we use neural networks to infer, given an input, the hyperparameters, $m$, of this higher-order, evidential distribution."* (Amini et al., p. 4)

*"Third, we can effectively estimate the epistemic or model uncertainty associated with the network's prediction by simply evaluating the variance of our inferred evidential distribution."* (Amini et al., p. 4)

$$ \text{Var}[\mu] = \frac{\beta}{\nu (\alpha - 1)} $$

**Remember:**
The virtual observation interpretation says: higher $\nu, \alpha$ means more evidence, meaning the model has "seen more support" for its prediction. The implicit promise is that evidence should grow as the model sees more of a particular input region.

---

## 3.3 Learning the evidential distribution

*"For clarity, we structure the learning process as a multi-task learning problem, with two distinct parts: (1) acquiring or maximizing model evidence in support of our observations and (2) minimizing evidence or inflating uncertainty when the prediction is wrong."* (Amini et al., p. 4) 

The regularizer specifically targets this — it says: **if you are wrong, you must be uncertain.**

### (1) Maximizing the model fit using Maximum Marginal Likelihood Estimate

$$ p(y_i | m) = \iint p(y_i | \mu, \sigma^2) p(\mu, \sigma^2 | m) d\mu d\sigma^2 $$

Ignore the middle part, then it's simply a weighted average over the probability distribution. In Maximum Likelihood Estimate, we use the point estimate:

$$ \mathcal{L}_i(w) = -\log p(y_i | \hat{\mu}, \hat{\sigma}^2) $$

But since now we have a distribution over $\mu$ and $\sigma^2$ as well, we use a weighted average. We know $p(y | \mu, \sigma^2)$ is Gaussian and we chose $p(\mu, \sigma^2 | m)$ as NIG, and so this intractable solution becomes tractable as:

$$ p(y_i | m) = \text{St}\left(y_i; \gamma, \frac{\beta(1+\nu)}{\nu \alpha}, 2\alpha\right) $$

where $\text{St}(y; \mu_{St}, \sigma^2_{St}, \nu_{St})$ is the Student-t distribution evaluated at $y$ with location $\mu_{St}$, scale $\sigma^2_{St}$, and $\nu_{St}$ degrees of freedom.

Applying NLL on this gives:

$$ \mathcal{L}_i^{NLL}(w) = \frac{1}{2} \log \left( \frac{\pi}{\nu} \right) - \alpha \log\left( 2\beta(1+\nu) \right) + \left( \alpha + \frac{1}{2} \right) \log \left( 2\beta(1+\nu) + \nu (y_i - \gamma)^2 \right) + \log \left( \frac{\Gamma(\alpha)}{\Gamma(\alpha+1/2)} \right) $$

### (2) Minimizing evidence on errors

Next, we describe how to regularize training by applying an incorrect evidence penalty (i.e., high uncertainty prior) to try to minimize evidence on incorrect predictions.

This has been demonstrated with success in the classification setting where non-misleading evidence is removed from the posterior, and the uncertain prior is set to a uniform Dirichlet :cite[sensoy2018]. The analogous minimization in the regression setting involves $\text{KL}[p(\theta|m) || p(\theta|\tilde{m})]$, where $\tilde{m}$ are the parameters of the uncertain NIG prior with zero evidence (i.e., $\alpha, \nu = 0$). Unfortunately, the KL between any NIG and the zero evidence NIG prior is undefined.

To address these challenges in the regression setting, the authors formulate a novel evidence regularizer:

$$ \mathcal{L}_i^R(w) = |y_i - \gamma| \cdot (2\nu + \alpha) $$

This loss imposes a penalty whenever there is an error in the prediction and scales with the total evidence of our inferred posterior.

The total loss, $\mathcal{L}_i(w)$, consists of the two loss terms for maximizing and regularizing evidence, scaled by a regularization coefficient, $\lambda$:

$$\mathcal{L}_i(w) = \mathcal{L}_i^{NLL}(w) + \lambda \mathcal{L}_i^{R}(w)$$

:::pink
**Loophole:** 
The regularizer conflates two fundamentally different failure modes: prediction error due to in-distribution data noise, and prediction error due to out-of-distribution inputs. For in-distribution training points where the model errs, the NLL loss and the regularizer send contradictory signals simultaneously: the former pushes the predicted mean toward the target while the latter penalizes evidence, effectively teaching the model to be uncertain in a region it should instead be learning. A principled regularizer would need to distinguish between these two cases rather than treating prediction error as a uniform proxy for epistemic uncertainty.
:::

:::references
- amini2020: Amini, A., Schwarting, W., Soleimany, A., & Rus, D. "Deep Evidential Regression." *Advances in Neural Information Processing Systems*, 2020. [Link](https://arxiv.org/pdf/1910.02600)
- sensoy2018: Sensoy, M., Kaplan, L., & Kandemir, M. "Evidential Deep Learning to Quantify Classification Uncertainty." *Advances in Neural Information Processing Systems*, 2018. [Link](https://arxiv.org/pdf/1806.01768)
- blundell2015: Blundell, C., Cornebise, J., Kavukcuoglu, K., & Wierstra, D. "Weight Uncertainty in Neural Networks." *ICML*, 2015.
:::
