---
title: 'AINA (Part 2): Agentic Flows, Inductive Biases, and Dual-Tier Memory'
date: '2026-10-31'
readTime: '18 min'
tags: ['analog design', 'eda', 'agents', 'dual-tier-memory', 'benchmarks', 'ngspice', 'skywater130']
excerpt: 'Exploring agentic flows for analog circuit sizing: why ReAct architectures suffer from episodic overfitting and coupling blindness, how Dual-Tier Memory with an Inductive Distillation Filter hits 50% feasible yield and 53% less silicon area, and the empirical road to RLFT.'
prevPost:
  slug: 'aina_part_1'
  title: 'AINA (Part 1): Grounding Agents in Analog Physics'
nextPost:
  title: 'AINA (Part 3): Sizing Action Spaces & Post-Layout Closed Loops'
  comingSoon: true
---

:::{note}
This is **Part 2** of the **AINA** series. If you are joining us for the first time, catch up on [Part 0: Why are we still sizing analog circuits by hand?](/blog/writings/aina_part_0) and [Part 1: Grounding Agents in Analog Physics](/blog/writings/aina_part_1).
:::

This part is focused on discussing various agentic flows and our architectural choices. 

The initial version of our agentic flow is intentionally simple: a **ReAct (Reason + Act)** architecture. 

$$\text{Observe} \longrightarrow \text{Reason (Re)} \longrightarrow \text{Act} \longrightarrow \text{Observe}$$

The model observes the circuit simulation metrics, reasons about the physical trade-offs, acts by mutating transistor dimensions, observes the simulator's response, and repeats the loop. This establishes a tight, closed feedback loop for sizing optimization, inspired by AutoSizing. All baseline results in the preceding parts were gathered within this single-agent loop.

---

## The Physical Hallucination Dilemma & The Episodic Overfitting Trap

A general LLM—especially compact, locally hostable models like **Qwen 2.5 (7B)** that I run locally—can easily mess up the underlying semiconductor physics (such as omitting terms from the channel current saturation equations or hallucinating the relationship between overdrive voltage and transconductance). 

To overcome this, we introduce **prior inductive bias** by maintaining an analog design knowledge base that our language model can query at every step.

Continual learning is compelling: as the agent makes successful sizing decisions, we dynamically store those decisions in the knowledge base for reference in subsequent runs. 

**However, there is a severe caveat.** This is one of the most pervasive pitfalls in modern agent literature: **episodic overfitting**. 

For example, suppose an agent memorizes:
$$\text{"Rule: Keep } W_8 \le 50\,\mu\text{m} \text{ to avoid power violation."}$$

That memory is not only useless, but actively harmful if:
1. The next user requires a high-speed op-amp with a generous $2\,\text{mW}$ power budget.
2. The load capacitance changes from $1\,\text{pF}$ to $10\,\text{pF}$.
3. You modify the supply rail ($V_{DD}$) or swap to a folded-cascode topology.

Such brittle, hyper-specific numerical memories are detrimental for smaller models because they lack the context window and cognitive bandwidth to reconcile conflicting numbers across different circuit regimes.

---

## Design is Not Dead: The Three Abstraction Layers

To overcome this, we need a principled knowledge representation. As highlighted in [Design is not dead](https://x.com/_darshi/status/2112068761176121674?lang=ar), human analog designers never think in raw numbers like: *"Last Tuesday I sized M6 to $24.5\,\mu\text{m}$."*

Instead, expert designers store knowledge across **three distinct, reusable abstraction layers**:

:::pink
### Tier 1: Device & Technology Knowledge Base (Foundry / PDK Invariant)
- $g_m / I_D$ curves, transit frequency $f_T$ vs. $V_{OV}$, and minimum saturation headroom ($V_{DS} \ge V_{OV}$).
- Completely invariant to circuit topology and target performance specifications.

### Tier 2: Causal Trade-off Graph (Topology-Specific, Target-Agnostic)
- Qualitative Jacobian / Sensitivity Matrix: $\text{Sign}\left(\frac{\partial \text{Metric}}{\partial \text{Param}}\right)$.
- Intrinsic couplings: *"Increasing $C_c$ creates a zero-sum trade-off between Slew Rate and Phase Margin."*
- Usable for **any** performance target on that specific topology.

### Tier 3: Procedural Sizing Recipe (Design Methodology)
- Order of operations: 
  $$\text{1. Fix } I_{\text{tail}} \text{ for SR} \longrightarrow \text{2. Fix } C_c \text{ for PM} \longrightarrow \text{3. Scale } W/L \text{ for } A_v \longrightarrow \text{4. Audit Power}$$
- Heuristic search strategy, not rigid numerical coordinates.
:::

By structuring our architecture around this principle, we retain both run-specific tactical agility and cross-run transferable wisdom. Foundational physics is seeded as initial inductive bias, while an automated filter distills validated procedural design moves into a persistent knowledge base valid across the entire PDK.

---

## Dual-Tier Memory Architecture with an Inductive Distillation Filter

In AINA, we separate memory into two coordinated tiers:

1. **Transient Episodic Memory**: Single-run scratchpad tracking local parameter mutations and immediate SPICE feedback.
2. **Persistent Semantic Knowledge Base**: Foundry-wide physics invariants and cross-circuit sizing heuristics.

Between them sits our **Inductive Distillation Filter**:

![Dual-Tier Memory Architecture with Inductive Distillation Filter](/blog/images/aina/dual_tier_memory_filter.png)

### Tier 1: Episodic Working Memory (Tactical)
- **Scope**: Single run only.
- **Role**: Prevents the agent from repeating the exact same parameter candidate twice, tracks the current gradient direction, and logs raw simulator telemetry.
- **Fate**: Serialized to structured JSONL logs for auditing, then flushed from active prompt context when switching tasks.

### Tier 2: Persistent Semantic Knowledge Base (Strategic)
- **Scope**: Universal across all circuits on that PDK node (SkyWater 130nm).
- **Role**: Acts as the cumulative "senior designer intuition" that compounds in competence over time.
- **Sub-components**:
  - **Core Invariants (Prior Knowledge)**: Small-signal formulas, Middlebrook stability testbench setups, and PDK device models.
  - **Learned Procedures (Distilled Heuristics)**: High-level procedural rules synthesized empirically through live simulation.

---

### How the "Distillation Filter" Works

The distillation filter operates under three foundational principles:

1. **Quality Gate (Learn Exclusively from Feasible Solutions)**:
   The filter completely discards unsuccessful or unphysical trajectories, selectively analyzing only runs that attain 100% specification compliance with an improved Figure-of-Merit (FoM).
2. **De-parameterization (Abstraction from Absolute Values)**:
   Instead of storing raw micrometer coordinates (e.g. $W_8 = 35\,\mu\text{m}$, $C_c = 1.8\,\text{pF}$), the filter abstracts parameter modifications into non-dimensional ratios and operational regimes:
   $$\text{Absolute: } W_8 = 35\,\mu\text{m} \implies \text{Abstract: } \frac{I_{\text{tail}}}{C_c} \ge 8\times 10^6\,\text{V/s}$$
3. **Procedural Rule Synthesis (Heuristic Extraction)**:
   The filter extracts high-level operational sequences into reusable playbook heuristics:
   > *"Empirical Heuristic: When encountering simultaneous deficiencies in Gain and Slew Rate, increasing the channel length ($L$) of the differential pair stabilizes gain without incurring a power penalty, after which tail current adjustment satisfies the slew rate constraint."*

---

## Empirical Benchmark: Phase 1 vs. Phase 2 (Bottleneck Test)

To evaluate this architecture, we ran both the Stateless Baseline and the Dual-Tier Memory Agent on the `SimpleTwoStageOpAmp_BottleneckTest` using live Ngspice on the SkyWater 130nm process node.

| Metric | Phase 1: Stateless Baseline | Phase 2: Dual-Tier Memory Agent |
| :--- | :---: | :---: |
| **Circuit** | `SimpleTwoStageOpAmp_BottleneckTest` | `SimpleTwoStageOpAmp_BottleneckTest` |
| **Physics / Model** | Live Ngspice (SkyWater 130nm) | Live Ngspice (SkyWater 130nm) |
| **Reasoning Engine** | Active Local Ollama LLM | Active Local Ollama LLM |
| **Total SPICE Evaluations** | 30 | 30 |
| **Feasibility Rate (% compliant)** | **0.0%** (0/30 feasible points) | **100.0%** (struck at eval 14) |
| **Feasible Points Yield** | **0 / 30 (0.0%)** | **15 / 30 (50.0%)** |
| **Best Penalty Loss** | 0.2773 (stagnated) | **0.0000** (100% compliant) |
| **First Feasible Hit** | Never reached | **Evaluation 14** |
| **Distilled Rules Produced** | 0 | **1 rule (`RULE-DISTILLED-05`)** |
| **Persistent Playbook Size** | 0 rules | **5 rules** (expanded +1) |

> **Key Observation**: From evaluation 14 onward, the Dual-Tier Memory Agent shifted from raw feasibility exploration to **margin optimization**, producing 15 fully compliant circuit designs in a row.

---

## 3-Way Head-to-Head Architecture Performance

Next, we pitted the Dual-Tier Memory Agent against both standard **Bayesian Optimization (GP-EI)** and the **Stateless Agent Baseline**:

| Category | Key Metric | Bayesian Optimization (GP-EI) | Baseline Stateless Agent | Dual-Tier Memory Agent (Ours) | Winner / Advantage |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Optimization Efficiency** | Feasibility Yield (% budget compliant) | 16.7% (5 / 30) | 0.0% (0 / 30) | **50.0% (15 / 30)** | **Dual-Tier Memory** ($3\times$ higher yield than BO) |
| **Optimization Efficiency** | First Feasible Eval (speed to first hit) | **Eval 10** | Never (stagnated) | Eval 14 | **BO** (found first point earlier) |
| **Optimization Efficiency** | Best Objective Loss (0.0 = 100% specs met) | **0.0000** | 0.2773 | **0.0000** | **Tie** (BO & Dual-Tier) |
| **Reliability & Stability** | Circuit Breakdown Rate ($\text{SR} = 0\,\text{V}/\mu\text{s}$) | 26.7% (8 / 30 collapsed) | 0.0% (0 / 30) | **0.0% (0 / 30)** | **Dual-Tier Memory** (Zero unphysical explorations) |
| **Circuit Performance** | DC Gain ($A_v$) [Target $\ge 50\,\text{dB}$] | $54.10\,\text{dB}$ | $51.80\,\text{dB}$ | **$55.40\,\text{dB}$** | **Dual-Tier Memory** (+1.3 dB over BO) |
| **Circuit Performance** | Slew Rate ($\text{SR}$) [Target $\ge 15\,\text{V}/\mu\text{s}$] | $52.51\,\text{V}/\mu\text{s}$ | $10.84\,\text{V}/\mu\text{s}$ (Violated) | $24.87\,\text{V}/\mu\text{s}$ | **Both feasible** (BO overshoots; Dual-Tier balanced) |
| **Circuit Performance** | Quiescent Power ($P$) [Target $\le 0.8\,\text{mW}$] | **$0.188\,\text{mW}$** | $0.236\,\text{mW}$ | $0.198\,\text{mW}$ | **Comparable** ($\Delta = 10\,\mu\text{W}$) |
| **Physical Design Economy**| Active Transistor Width ($W_3 + W_5$) | $80.15\,\mu\text{m}$ (Oversized) | $60.00\,\mu\text{m}$ | **$38.00\,\mu\text{m}$** | **Dual-Tier Memory** (53% less silicon area than BO) |
| **Knowledge Transfer** | Cross-Run Distilled Rules | 0 (Static Black-Box) | 0 (No Playbook) | **1 (`RULE-DISTILLED-05`)** | **Dual-Tier Memory** (Accumulates PDK heuristics) |

---

### Core Takeaways

:::pink
#### 1. Yield & Robustness over BO
Bayesian Optimization hits a feasible design at step 10, but suffers from classic black-box erraticism: **8 of its 30 evaluations caused catastrophic circuit collapse ($\text{SR} = 0\,\text{V}/\mu\text{s}$)** because the acquisition function proposed unphysical coordinate pairings. In contrast, our Dual-Tier Agent reached feasibility at step 14 and never left it, producing a **50.0% compliant yield**.

#### 2. Superior Layout Economy over BO
BO brute-forced the slew rate constraint by ballooning active transistor widths to $80.15\,\mu\text{m}$. Our agent achieved higher DC gain ($55.40\,\text{dB}$) at **53% lower silicon area ($38.00\,\mu\text{m}$)**. In silicon layout, smaller area directly minimizes parasitic capacitances and prevents post-layout performance collapse.

#### 3. Escaping Local Stagnation over Stateless Agent
The Stateless Agent pushed differential pair width $W_3$ straight into the $50\,\mu\text{m}$ parameter ceiling while leaving compensation capacitor $C_c$ oversized, remaining trapped at 0% feasibility. The Dual-Tier Agent utilized its Procedural Playbook to coordinate trimming $C_c$ and scaling $W_3$ concurrently.
:::

---

## Fundamental Limitations of Prompt-Based Agentic Systems

Telling a compact 7B or 14B model:
> *"At step 2, fixing Slew Rate broke Phase Margin."*

exposes three fundamental failure modes in pure prompt engineering:

1. **Coupling Blindness (Ping-Pong Oscillations)**:
   The model reasons: *"Oh, Phase Margin degraded? Let me increase $C_c$ back to $3\,\text{pF}$."* Then at step 3: *"Now Slew Rate is broken again! Let me decrease $C_c$ to $1.5\,\text{pF}$."* It enters an infinite oscillatory loop because it cannot independently resolve that $C_c$ couples both metrics in opposing directions.
2. **Credit Assignment Failure**:
   If the agent modified two transistor widths and one capacitor simultaneously in step 2, it lacks the causal model to deduce which specific component caused phase margin to collapse.
3. **Missing Compensatory Physics**:
   To a human analog engineer, *"fixing SR broke PM via $C_c$"* triggers an immediate, reflexive circuit law:
   $$\text{PM} \approx 90^\circ - \arctan\left(\frac{\text{GBW}}{p_2}\right) \quad \text{where } p_2 \approx \frac{g_{m2}}{C_L}$$
   A human knows: *"If I decrease $C_c$, the non-dominant pole $p_2$ bites into my phase. Therefore, I must simultaneously increase $g_{m2}$ (second-stage driver width) to push $p_2$ outward and preserve Phase Margin."*
   A base 7B LLM trained on internet text simply does not have this circuit reflex burned into its weights.

---

### How We Handle This in Architecture

Before touching model weights, we resolve this by never forcing the LLM to guess the causal interpretation:

- ❌ **Vague Raw Symptom**:
  > *"Step 2: Slew rate improved, but PM regressed."*
- ✅ **Causal Compensatory Directive**:
  > *"Coupling Collision Detected: You decreased $C_c$ to accelerate Slew Rate, which split the poles less and reduced Phase Margin ($63^\circ \to 52^\circ$).  
  **Compensatory Action Required**: Do not decrease $C_c$ further. Instead, execute one of the following:  
  1. Increase tail width $W_{\text{tail}}$ to boost charging current $I_{\text{tail}}$, OR  
  2. Increase second-stage driver width $W_{\text{driver}}$ to increase $g_{m2}$ and restore Phase Margin."*

By handing down the exact compensatory pair, even a 7B model executes the correct coordinated adjustment without needing to derive high-order analog transfer functions from scratch.

This generation is deterministic and straightforward for standardized operational amplifier topologies, but manual rule hand-crafting breaks down as circuit complexity scales to multistage, bandgap, and PLL architectures (where Teacher Distillation can be leveraged to generate domain data).

---

## Do We Need RL-Based LLM Optimization (RLFT)?

**Yes. Absolutely.**

While architecture-level ledgers and playbooks provide immediate stability, frontier EDA AI must transition from prompt engineering to **Reinforcement Learning from Physical Feedback (RLFT / GRPO)** directly on the model weights. When the policy internalizes the qualitative Jacobian directly into its attention weights, the agent sizing loop approaches human-level intuitive sizing speed.
