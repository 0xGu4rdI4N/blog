---
title: 'AINA (Part 1): Grounding Agents in Analog Physics'
date: '2026-10-29'
readTime: '12 min'
tags: ['analog design', 'eda', 'agents', 'bsim4', 'ngspice', 'benchmarks']
excerpt: 'The meaning of AINA, the custom Razavi domain reasoning benchmark, Qwen 7B vs 14B quantization findings, and building a zero-cost local agent stack with Ngspice and SkyWater 130nm PDK.'
---

:::pink
In Eastern languages (आईना / آئینہ), **aina** translates to **'mirror'**—an intentional homage to the foundational building block of analog circuit design, the **current mirror**.
:::

*Physics is verifiable. This is the main foundational support for this work.*

---

## The Big Picture (Why AINA Exists)

Analog circuit sizing is notoriously difficult because transistor equations have high-dimensional, coupled, non-linear trade-offs across power, silicon area, DC gain, bandwidth, noise, and phase margin.

Traditional methods (like pure Bayesian Optimization or Genetic Algorithms) treat circuit simulation as a black box. They require dozens or hundreds of simulations to find feasible designs and operate with **zero domain knowledge of circuit physics**. But in real-world engineering, domain knowledge is everything.

Our goal in **AINA** is to build autonomous sizing agents that combine:
1. **Physics-grounded circuit reasoning** (via LLMs)
2. **Sample-efficient search** (via BO / RL)
3. **Live SPICE simulation** (SkyWater 130nm PDK via Ngspice)

To properly evaluate our progress, two primary benchmark suites have been chosen:
1. **[LOADBench](http://arxiv.org/abs/2610.21591)**
2. **[Razavi-Bench](https://razavi-bench.tokenzhang.com/)**

LOADBench contains 6 distinct tasks. For our initial version, we specifically target **Task 1: Inverse Sizing** (finding transistor parameters and bias currents given a target topology and performance specifications). While LOADBench was designed for specific specialized models, our goal is to see if we can make LM-based agents perform and excel here.

---

## Causal Intuition Before Sizing: The Razavi Domain Reasoning Benchmark

Before an engineer or an autonomous agent sizes a circuit, they must demonstrate **qualitative causal intuition**. 

If an agent does not understand *why* changing a physical dimension affects the circuit behavior, its sizing is not engineering—it is just random hill-climbing.

Inspired by Prof. Behzad Razavi’s classic textbook *"Design of Analog CMOS Integrated Circuits"*, I initially created a custom **Razavi Domain Reasoning Benchmark** to test whether general models grasp basic analog relationships.

The base LLM (`qwen2.5:7b`) failed immediately because of severe physical hallucinations in basic analog electronics.

### Critical Empirical Finding: Q8 vs Q4

When testing different quantization levels, the 8-bit model made the exact same fundamental physical error as the 4-bit model:

:::cent
$$ I_D = \frac{1}{2} \mu_n C_{ox} \left(\frac{W}{L}\right) (V_{GS} - V_{TH})^2 $$
:::

> *"I_D = 1/2 * Kn * (Vgs - Vth)^2... Since $V_{OV}$ remains constant (0.3 V) when $W$ is increased, $g_m$ remains constant. Therefore, increasing $W$ does not change $g_m$ or $I_D$."*

Notice what happened: the model literally dropped $\frac{W}{L}$ out of its internal physical reasoning!

This proves two critical realities:
1. **Quantization was NOT to blame**: Even at 8-bit full precision, the general 7B instruct weights have an intrinsic gap in analog physics.
2. **General-purpose LLMs have strong blindspots in analog circuit physics** that cannot be solved by simply increasing quantization precision to Q8.

Domain-specific fine-tuning (RLSF / DPO) or math/physics specialization is strictly required. 

Interestingly, moving to the **14B model performed much better**—proving once again: *(SCALING WINS AGAIN!)*

*(After developing my custom evaluation, I found out that a broader benchmark is already publicly available at [https://razavi-bench.tokenzhang.com/](https://razavi-bench.tokenzhang.com/).)*

---

## When to Use General LLM Reasoning vs. Specific ML Frameworks?

The key question is not whether an LLM or Bayesian optimization is better. It is: **which component has the right inductive bias for each subproblem?**

We decompose inverse sizing into a clean closed-loop division of labor:

![Closed-Loop Division of Labor](/blog/images/aina/closed_loop_division_of_labor.png)

1. **LLM — Interpret and Plan**: Converts high-level user specifications into mathematical objectives, constraints, and a valid design workflow. Selects models, tools, and optimization strategies.
2. **Optimizer — Propose Transistor Sizes**: Bayesian optimization, evolutionary algorithms, gradient-based methods, or circuit-specific analytical methods search the continuous design space.
3. **EDA Tools — Evaluate Candidates**: SPICE simulation (operating-point analysis, AC frequency response, transient analysis, and corner or Monte Carlo simulations) returns actual circuit metrics grounded in silicon physics.
4. **Optimizer / LLM — Respond to Results**: The optimizer updates its surrogate model. The LLM intervenes when the search stalls, constraints need relaxation/clarification, or a topological change is justified.

This creates a true closed-loop design system. The LLM does not need to reason from scratch about every decimal point of every transistor dimension at every micro-iteration.

:::dropdown[Circuit Knowledge Infused into the Agent (For Future Reference)]
*Note: This structured circuit knowledge taxonomy is documented here for future reference and will be explored in later iterations of the agent; it won't be actively used in our initial baseline.*

To make an advanced agent effective in this loop, four layers of structured circuit knowledge can be formulated:

- **Performance–Performance Trade-offs**: How improving one specification impacts another across the circuit (e.g., boosting open-loop DC gain or gain-bandwidth product often increases DC bias current and power dissipation).
- **Functional Role–Performance Relationships**: Which sub-circuits directly govern specific metrics (e.g., how the input differential pair controls thermal noise and input transconductance $g_m$, versus how the active current mirror load determines output impedance $r_o$).
- **Substructure–Parameter–Performance Rules**: Detailed, local component sensitivities (e.g., increasing the aspect ratio $\frac{W}{L}$ of active load transistors alters output swing and pole locations).
- **Design Heuristics**: General, transferable analog guidelines and rules of thumb that abstract away specific transistor IDs, allowing insights learned on a simple differential pair to be applied to a folded cascode or two-stage Miller OTA.
:::

---

## The Zero-Cost Local Hardware & Software Stack

To build AINA, I insisted on an **open-source, reproducible, zero-cost local setup**: no proprietary CAD licenses, no expensive cloud API subscriptions, and no opaque black boxes.

### 1. The Physics Verifier: Ngspice + SkyWater 130nm PDK

- **Ngspice-47**: The industry-standard open-source SPICE engine. Ngspice acts like a virtual testing laboratory for electronic circuits. You supply a text description of your circuit (called a **netlist**), and Ngspice calculates how the circuit behaves using fundamental physical equations.
- **Real Silicon vs. Textbook Formulas**: Transistors in textbooks are taught using simple quadratic equations where everything behaves predictably. In real physical silicon, nanoscale transistors misbehave due to short-channel effects, velocity saturation, and leakage.
- **BSIM4 Models**: Advanced, industry-standard mathematical models capturing all messy real-world physical phenomena.

:::dropdown[Deep Dive: What is BSIM4 and why do we need PDK parameters?]
BSIM4 is a massive set of physics equations with around **200 variable coefficients** (parameters like `VTH0`, `U0`, `TOXE`, `K1`, etc.). TSMC, GlobalFoundries, Intel, and SkyWater all use the exact same BSIM4 mathematical equation standard.

However, **every foundry and process has its own unique parameter set**:
- A TSMC 180nm BSIM4 model has completely different parameter coefficients compared to a SkyWater 130nm model.
- For this project, I use the **SkyWater 130nm open-source PDK** (sponsored by Google and SkyWater). It provides the exact parameters of SkyWater’s commercial 130nm fabrication process. Anyone can design and verify real silicon circuits without signing non-disclosure agreements (NDAs) or paying six-figure software licensing fees.

Without the PDK, Ngspice only knows generic, idealized mathematical rules. With the PDK, Ngspice simulates the authentic physical behavior of real silicon.
:::

### 2. The AI Brain: Ollama + Qwen 2.5

- **Ollama (Local LLM Inference)**: Because circuit sizing loops run dozens of design iterations per trial, relying on cloud API calls gets expensive and slow quickly. Ollama gives us private, low-latency, zero-cost local inference directly on our workstation.
- **Qwen 2.5 (7B / 14B)**: Open-weights models that punch well above their weight in mathematical derivations, code generation, and structured tool outputs. And crucially—they run locally on my machine with 16 GB RAM 🙁.

:::dropdown[Further Stack Details: Observability & Developer Secret Weapon]
#### The Observability Layer: Arize Phoenix & OpenTelemetry (OTel)
Debugging multi-turn AI agents without visibility is like debugging a high-frequency circuit without an oscilloscope:
- We integrated **Arize Phoenix** with OpenTelemetry (OTel) standards.
- It records every simulation step, latency, token count, parameter mutation, and raw chain-of-thought derivation into a local dashboard. If the agent makes an illogical parameter tweak, we can immediately trace the exact prompt and simulation state that triggered it.
- Every run automatically serializes to structured `JSONL` files for reproducible audit trails.

#### The Developer Secret Weapon: Zero-Dependency Analytic Mock
Running live Ngspice simulations on every small code change or unit test slows development to a crawl:
- We engineered a fast, closed-form analytic simulator based on idealized transistor physics.
- This allows our entire 48-test test suite and CI validation pipeline to execute in **under 2 seconds completely offline**, without needing Ngspice installed or Ollama running in the background.
:::

---

In **Part 2**, we will dive straight into the code: building the live Ngspice automation harness, defining our sizing MDP action space, and running our first closed-loop experiments on Task 1 of LOADBench.
