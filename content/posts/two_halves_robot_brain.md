---
title: 'Two Halves of a Robot Brain: How VLAs and World Models Combine for Robot Manipulation'
date: '2026-11-24'
readTime: '40 min'
type: 'fundamental'
tags: ['vla', 'world models', 'robot learning', 'flow matching', 'cross-embodiment', 'evaluation']
excerpt: 'A field guide to robot foundation models for ML people new to robotics: how VLA action heads are built and fine-tuned, the three families of world models, how a world model chooses actions, one checkpoint for two robot bodies, data mixtures, honest evaluation, and a staged case for investing in world models.'
---

**TL;DR:** A Vision-Language-Action model (VLA) learns *what to do*; a world model learns *what will happen if you do it*. The most interesting robot foundation models of the last two years train both behaviours into one network with a shared predictive objective over video and actions. This post is a field guide to that stack for ML people new to robotics: how action heads are built, how VLAs are fine-tuned, the three families of world models, how a world model picks actions, how one checkpoint drives two different robots, and what it takes to claim, credibly, that a new checkpoint beats an open-source baseline. It ends with a staged case for where world models are worth investing in today.

*Assumes: transformers, vision-language models, diffusion/flow matching at a high level, LoRA, basic RL vocabulary. No robotics background needed. No code; every claim points to its source.*

**Contents**

1. [Why robots need two kinds of prediction](#why-robots-need-two-kinds-of-prediction)
2. [Robotics for ML people](#robotics-for-ml-people)
3. [Anatomy of a VLA](#anatomy-of-a-vla)
4. [Building an action head from scratch](#building-an-action-head-from-scratch)
5. [Fine-tuning a VLA: full, LoRA, and what to freeze](#fine-tuning-a-vla-full-lora-and-what-to-freeze)
6. [World models: three families](#world-models-three-families)
7. [World Action Models: predicting video and actions together](#world-action-models-predicting-video-and-actions-together)
8. [Choosing actions with a world model](#choosing-actions-with-a-world-model)
9. [One model, two bodies: cross-embodiment action spaces](#one-model-two-bodies-cross-embodiment-action-spaces)
10. [Data: public datasets, internal episodes and the mixture](#data-public-datasets-internal-episodes-and-the-mixture)
11. [Evaluation: what "beating a baseline" actually means](#evaluation-what-beating-a-baseline-actually-means)
12. [Research discipline: ablations and reproducibility](#research-discipline-ablations-and-reproducibility)
13. [Verdict: world models as a staged bet](#verdict-world-models-as-a-staged-bet)
14. [Further reading](#further-reading)

<a id="why-robots-need-two-kinds-of-prediction"></a>

## Why robots need two kinds of prediction

Ask a robot to "put the red cup in the sink". Two different questions sit inside that instruction.

The first is *what should I do next?* Given the current camera image $o_t$ and the instruction $\ell$, produce the next motor command $a_t$. A model that answers this is a **policy**:

$$
\pi_\theta(a_t \mid o_t, \ell)
$$

The second is *what will happen if I do it?* Given the current observation and a candidate action, predict the next observation. A model that answers this is a **world model** (also called a dynamics model or a forward model):

$$
p_\phi(o_{t+1} \mid o_{\le t}, a_t)
$$

A Vision-Language-Action model is a policy. It takes a vision-language model pretrained on internet data and teaches it to emit actions instead of (or alongside) text. That recipe has carried the field a long way: [RT-2](https://arxiv.org/abs/2307.15818), [OpenVLA](https://arxiv.org/abs/2406.09246) and [π0](https://arxiv.org/abs/2410.24164) follow free-form instructions on objects they never saw during robot training, because the backbone already knows what a "red cup" and a "sink" look like.

What a pure policy does not have is any explicit notion of consequence. It maps the present to an action. If the cup is about to tip, the policy only "knows" that if similar situations in its training data happened to be followed by a corrective action. It cannot imagine two candidate grasps, roll each one forward, and pick the one that doesn't knock the cup over.

A world model has the opposite problem. It can imagine consequences. On its own, it never decides anything. You need a mechanism on top (a planner, an inverse-dynamics model, or a policy trained inside the model's imagination) to turn predictions into actions, and that mechanism is where many world-model projects stall: planning is slow, and a planner will happily exploit any error in the model.

The thesis of this post is that the two halves are converging. A growing family of models, which I'll call **World Action Models**, trains one network to predict future frames *and* actions from the same sequence of video and actions. Video prediction gives the network dense supervision and lets it learn from footage that has no action labels; the action half keeps it useful for control. Once you see robot foundation models this way, the VLM backbone stops being the interesting part. The hard problems are around it:

- The action head: how continuous, high-frequency motor commands come out of a model built for discrete tokens.
- The embodiment interface: how one model serves robots with different bodies and different numbers of joints.
- The data mixture: which public datasets and which internal episodes, in what proportions.
- The evaluation protocol: how you know a change helped, when every real-robot trial is slow, noisy and expensive.

I take them in roughly the order you'd hit them while building one of these systems.

![A policy predicts what to do and a world model predicts what will happen; World Action Models fuse both, and the hard parts sit around the backbone](/blog/images/two_halves_robot_brain/two-halves.png)

<a id="robotics-for-ml-people"></a>

## Robotics for ML people

If you come from language or vision, most of the vocabulary in robot-learning papers is about three things: what the robot sees, what it can command, and how fast it has to command it.

### What the robot sees

A manipulation robot's **observation** at time $t$ usually has two parts:

- **Images** from one or more cameras: a fixed "third-person" camera looking at the table, and often a **wrist camera** mounted on the gripper. Wrist cameras matter more than you'd expect; they see the object up close at the moment of contact, which is exactly when precision is needed.
- **Proprioception**: the robot's own state, read from its sensors. Joint angles, the pose of the gripper in 3D, and how open the gripper is. This is a small vector (often 7 to 20 numbers) and it is cheap, accurate and always available.

Many VLAs condition on images and language only and leave proprioception out, or add it late. There's a reason. Proprioception makes the training data easier to fit, and it also makes it easier to overfit to the exact robot the data came from, which hurts once you train on more than one body.

### What the robot can command

The **action space** is the format of the command the model outputs. The common choices for an arm:

- End-effector (EE) deltas: "move the gripper 1 cm forward, rotate it 5° about its axis". Typically 6 numbers (3 for translation, 3 for rotation) plus 1 for the gripper, so a 7-dimensional action. Most public datasets use this.
- Absolute EE poses: "put the gripper at this position and orientation."
- Joint positions or velocities: one number per joint. A 7-joint arm with a gripper gives an 8-dimensional action.
- Gripper command: usually a single continuous or binary value for open/close.

The number of independently controllable joints is the robot's **degrees of freedom (DoF)**. A 7-DoF arm can reach the same gripper pose with different elbow positions. A 6-DoF arm can't. Small differences like this are why "same task, different robot" is harder than it sounds, and they come back in the cross-embodiment section.

### How fast it has to command it

Robots run on a clock. A policy outputs actions at some **control frequency**: a few Hz for a large VLA that generates actions one token at a time, 50 Hz or more for systems designed for dexterous work. Underneath the policy, the robot's own controllers run much faster, typically hundreds to a thousand Hz.

Two terms from the training side:

- An **episode** (or trajectory) is one attempt at a task, from reset to success or failure: a sequence of observations and actions.
- A **demonstration** is an episode recorded while a human controls the robot (by teleoperation: a joystick, a VR controller, or a "leader" arm the human moves while the "follower" arm copies it). Most VLAs are trained by **imitation learning**, also called behaviour cloning: supervised learning on demonstrations.

The **embodiment** is everything about the robot's body that shapes its data: kinematics and DoF, gripper type, camera placement, control frequency and action format. Two "Franka arms" in two labs with different cameras and controllers are, as far as a model is concerned, two embodiments.

### The control stack underneath a learned policy

A learned policy almost never drives motors directly. It sits on top of a classical control stack:

1. The **policy** outputs a target (an EE delta, or joint positions) at its control frequency.
2. If the target is an EE pose, **inverse kinematics (IK)** converts it into joint angles. IK answers "which joint angles put the gripper here?", using the robot's known geometry.
3. A **low-level controller** (typically a PD or impedance controller) turns the joint targets into motor torques at a high rate, correcting for gravity, friction and disturbances between policy steps.

This split is why VLAs output deltas or joint targets and leave torques alone. Torque control at 1 kHz would need a model hundreds of times faster than any VLA, and it would have to re-learn physics that a twenty-line PD controller handles reliably. It also explains a common failure mode: the learned layer can be "right" and the robot still fails, because the target it chose was unreachable, or the impedance was too stiff for contact. When you read about a VLA's success rate, you are reading about the whole stack.

![The control stack under a learned policy: the VLA emits action chunks at 3-50 Hz, inverse kinematics and a low-level controller turn them into torques at 500-1000 Hz](/blog/images/two_halves_robot_brain/control-stack.png)

> **Glossary.** **DoF**: number of independently controllable joints. **End-effector (EE)**: the gripper or tool at the end of the arm. **Proprioception**: the robot's own state (joint angles, gripper pose and width). **Action chunk**: a short sequence of future actions predicted at once. **Rollout**: a sequence of predicted (or executed) steps. **MPC** (model predictive control): plan a short sequence of actions with a model, execute the first, observe, re-plan.

<a id="anatomy-of-a-vla"></a>

## Anatomy of a VLA

A VLA is a vision-language model with a new output modality. End to end, it looks like this:

1. Vision encoder. Each camera image is split into patches and encoded by a pretrained vision transformer (SigLIP, DINOv2, or both concatenated). A 224×224 image becomes a few hundred patch embeddings.
2. Projector. A small MLP maps the patch embeddings into the language model's token-embedding space, so images become "visual tokens".
3. Language tokens. The instruction is tokenised as usual.
4. Backbone. A pretrained decoder-only language model (a few billion parameters is typical) processes visual and language tokens together.
5. Action head. Something reads the backbone's representations and produces an action, or a chunk of actions.

Steps 1-4 are an off-the-shelf VLM. Everything robot-specific lives in step 5 and in the training data.

Why start from a VLM at all, instead of training a policy from scratch? Because robot data is tiny next to internet data. The largest open robot datasets have on the order of a million episodes; a VLM has seen billions of image-text pairs. The VLM brings **semantics** (what objects are, what "left of" and "the one that's not red" mean) and **instruction following**. [RT-2](https://arxiv.org/abs/2307.15818) showed this transfer directly: co-training a VLM on web data and robot data produced a policy that could act on concepts that appear only in the web data.

What the VLM does *not* bring is motor competence. It has never had to output a number with millimetre precision fifty times a second, and its architecture is not built for it: autoregressive decoding of discrete tokens is slow, and a cross-entropy loss over bins is a coarse way to express a continuous quantity. That gap is the action-head problem, and two designs dominate:

- Actions as tokens ([RT-2](https://arxiv.org/abs/2307.15818), [OpenVLA](https://arxiv.org/abs/2406.09246)): discretise each action dimension into bins, map bins to tokens in the language model's vocabulary, and train with the same next-token loss used for text. Nothing in the architecture changes; the action head *is* the language-model head.
- VLM plus action expert ([π0](https://arxiv.org/abs/2410.24164)): keep the VLM for perception and language, and attach a separate, smaller set of transformer weights (the "action expert") that attends to the VLM's representations and generates continuous action chunks with flow matching.

![Anatomy of a VLA: vision and language tokens feed a pretrained VLM backbone, followed by either a token-based action head (RT-2, OpenVLA) or a flow-matching action expert (π0)](/blog/images/two_halves_robot_brain/vla-anatomy.png)

<a id="building-an-action-head-from-scratch"></a>

## Building an action head from scratch

This is the design choice in a VLA that matters most, and it's entirely yours. The backbone is borrowed; the action head is built and trained from scratch on robot data. Four ideas are worth knowing, and most current systems combine two or three of them.

### Option 1: discrete bins and next-token prediction

Normalise each action dimension $d$ to a fixed range (usually using the 1st and 99th percentiles of the training data, so outliers don't waste resolution), split the range into $K$ uniform bins (RT-2 and OpenVLA use $K = 256$), and map each bin to a token. OpenVLA reuses the 256 least-used tokens of the Llama tokenizer for this. A 7-dimensional action becomes 7 tokens, and training is ordinary cross-entropy:

$$
\mathcal{L}_{\text{tok}} = -\sum_{d=1}^{D} \log p_\theta\!\left(b_{t,d} \mid o_t, \ell, b_{t,<d}\right)
$$

where $b_{t,d}$ is the bin index of dimension $d$ of action $a_t$, and $D$ is the action dimension.

The appeal is that you need nothing new: the loss, the decoding and the infrastructure are all the VLM's. The costs are real, though:

- Precision. 256 bins over the range of a dimension gives a resolution of about 0.4% of that range. For coarse pick-and-place this is fine; for insertion or fine dexterity it isn't.
- Speed. One forward pass per token. Seven tokens per action, one action per step, a 7B model: this lands at single-digit Hz, too slow for dynamic tasks.
- Temporal correlation. At high control frequencies, consecutive actions are almost identical, so the "next token" is nearly a copy of the previous one. The loss becomes easy to minimise without learning much, and the model tends to produce jerky, stuck behaviour.

### Option 2: compress the action chunk before tokenising it

[FAST](https://arxiv.org/abs/2501.09747) attacks the third problem directly. Instead of tokenising each action independently, it takes a chunk of $H$ future actions, applies a discrete cosine transform (DCT) along the time axis of each dimension, quantises the coefficients, and compresses the result with byte-pair encoding. Smooth trajectories have most of their energy in a few low-frequency coefficients, so a 50-step chunk compresses to a short sequence of informative tokens.

You keep the autoregressive recipe, with its stable and well-understood training, and high-frequency control becomes learnable. The FAST paper reports that autoregressive VLAs trained this way match diffusion-based VLAs on dexterous tasks while training substantially faster. The inference cost of decoding tokens one at a time is still there.

### Option 3: a diffusion or flow-matching action expert

The other route treats the action chunk as a continuous object and generates it with a generative model, the same way image diffusion models generate pixels. [Diffusion Policy](https://arxiv.org/abs/2303.04137) showed that denoising an action sequence conditioned on observations handles **multimodality** well: if demonstrators sometimes went around an obstacle on the left and sometimes on the right, a regression head averages the two and drives into the obstacle, while a generative head picks one mode.

[π0](https://arxiv.org/abs/2410.24164) brought this into a VLA with [flow matching](https://arxiv.org/abs/2210.02747). Let $\mathbf{A}_t = [a_t, \dots, a_{t+H-1}]$ be a chunk of $H$ actions, $\epsilon \sim \mathcal{N}(0, I)$ noise of the same shape, and $\tau \in [0, 1]$ a "time" along the path from noise to data. Build the interpolated chunk

$$
\mathbf{A}_t^\tau = \tau\,\mathbf{A}_t + (1 - \tau)\,\epsilon
$$

and train a network $v_\theta$ to predict the velocity that moves along this straight path:

$$
\mathcal{L}_{\text{FM}} = \mathbb{E}_{\tau, \epsilon}\left[\,\big\| v_\theta(\mathbf{A}_t^\tau, \tau, o_t, \ell) - (\mathbf{A}_t - \epsilon) \big\|^2\,\right]
$$

At inference, start from pure noise at $\tau = 0$ and integrate $d\mathbf{A}/d\tau = v_\theta$ to $\tau = 1$ in a handful of Euler steps (π0 uses 10). The conditioning $o_t, \ell$ enters through attention to the VLM's representations; π0 also feeds proprioception to the action expert. (Papers differ on which end of $\tau$ is noise; the convention above is self-consistent, so check the sign convention before porting code between implementations.)

![Flow matching for actions: 16 waypoints of an action chunk move along straight paths from Gaussian noise at τ = 0 to a smooth reach towards the cup at τ = 1](/blog/images/two_halves_robot_brain/flow-matching-actions.gif)

You pay for it with a separate set of weights trained from scratch, a few integration steps per chunk, and a training signal that flows less cleanly into the VLM backbone (more on that in the fine-tuning section). In return you get continuous outputs and native multimodality, and the whole chunk is generated in parallel. That parallelism is how π0 reaches control rates of up to 50 Hz.

### Option 4: action chunking and temporal ensembling

The last idea works with any of the first three: predict several future actions at once, then decide how to execute them. [ACT](https://arxiv.org/abs/2304.13705) (Action Chunking with Transformers) introduced it for fine bimanual tasks and found that chunking, more than any architecture detail, was what made imitation learning work on them. Two reasons:

- Fewer decisions, so less compounding error. A policy that decides every step drifts from the demonstration distribution a little each step; a policy that commits to $H$ steps at once makes $H$ times fewer decisions.
- Pauses and non-Markovian behaviour. Human demonstrations contain pauses and hesitations that a single-step policy can't model from one frame.

Executing a whole chunk open-loop makes the robot unresponsive, so ACT predicts a new chunk *every* step and averages all chunks that cover the current time step. Index the predictions for time $t$ from oldest ($i = 0$) to newest:

$$
\hat{a}_t = \frac{\sum_{i} w_i\, a_t^{(i)}}{\sum_i w_i}, \qquad w_i = \exp(-m\, i)
$$

With $m > 0$, older predictions get more weight, and $m$ controls how quickly new observations are folded in. You get smooth motion that still reacts to what the cameras see.

![Temporal ensembling: a new six-step chunk is predicted every step, and the overlapping predictions for the current step are averaged with weights exp(−m i) into one smooth executed trajectory](/blog/images/two_halves_robot_brain/action-chunking.gif)

### Which one to build

| | Discrete bins | FAST tokens | Flow-matching expert | Chunking (any head) |
|---|---|---|---|---|
| Precision | Coarse (bin width) | Good | Continuous | (inherits from head) |
| Multimodal actions | Yes (categorical per token) | Yes | Yes | n/a |
| Inference speed | Slow (1 pass per token) | Medium (fewer tokens) | Fast (parallel chunk, ~10 steps) | Fewer model calls per second |
| New weights to train | None | None (new tokenizer) | Action expert from scratch | None |
| Training stability | High | High | Medium | High |
| Best for | Coarse tasks, fast prototyping | High-frequency tasks on a token-only stack | Dexterous, high-rate control | Almost always worth using |

My default when building from scratch: chunked actions, a flow-matching action expert for inference, and a token-based objective (FAST) on the backbone during training. Training on one head and running the other sounds odd. The next section explains it.

<a id="fine-tuning-a-vla-full-lora-and-what-to-freeze"></a>

## Fine-tuning a VLA: full, LoRA, and what to freeze

Fine-tuning a VLA usually means one of two jobs: adapting a pretrained VLA to a new robot or task suite, or turning a VLM into a VLA for the first time by bolting on a fresh action head. The choices are the same in both.

### Full fine-tuning vs. LoRA

[LoRA](https://arxiv.org/abs/2106.09685) freezes the pretrained weights $W$ and learns a low-rank update $W + BA$, with $B \in \mathbb{R}^{d \times r}$, $A \in \mathbb{R}^{r \times k}$ and rank $r$ much smaller than $d$ and $k$. For VLAs it's the cheap default, and it works better than you might expect: the OpenVLA authors compared fine-tuning strategies on new robot setups and found LoRA matched full fine-tuning while training only a small fraction of the parameters, on a single GPU.

Full fine-tuning earns its cost when the new data is large and far from the pretraining distribution, as with a new embodiment and action space, a new camera configuration, or many hours of internal data. It also updates the vision encoder. That matters when the robot's images (wrist cameras, odd lighting, close-up contact) look nothing like internet photos. The OpenVLA authors found it helped to fine-tune the vision encoder during robot training rather than freeze it, presumably because fine spatial detail matters more for control than for captioning.

A rough decision rule:

| Situation | Start with |
|---|---|
| Same robot, new tasks, < a few thousand episodes | LoRA on the backbone, full training of the action head |
| New robot, same action format | LoRA + unfrozen action head and proprio projector; full FT if it plateaus |
| New action space or new cameras, lots of data | Full fine-tuning, vision encoder included |
| First time turning a VLM into a VLA | Full fine-tuning with gradient protection (below) |

### The problem with a fresh action head

When you attach a randomly initialised action expert to a pretrained VLM and train end to end, the expert's early gradients are large and uninformative, and they flow straight back into the backbone. The VLM's representations get rewritten to suit a head that doesn't yet know what it's doing. You see it as lost language following and weaker semantic generalisation (the reason you used a VLM in the first place), and as training that is slower than it should be.

Physical Intelligence's work on [knowledge insulation](https://arxiv.org/abs/2505.23705) addresses this by (1) stopping the gradient from the action expert into the VLM backbone, and (2) training the backbone on a discrete objective (FAST tokens) at the same time, so it still learns action-relevant representations, plus continuing to co-train on general vision-language data. At inference you run the fast continuous action expert. Hence the default in the previous section.

### A practical recipe

- Normalise actions per dimension and per embodiment using statistics from the training data (quantiles are more robust than mean/std), and store the statistics with the checkpoint. A surprising number of "the fine-tuned model is broken" bugs are de-normalisation with the wrong statistics.
- Use separate learning rates: higher for the new action head and projectors, lower for the backbone.
- Freeze progressively. Start with the backbone frozen (or LoRA) and the head trained; unfreeze only if the head plateaus.
- Keep a vision-language co-training stream if you care about instruction following and the robot data is narrow.
- Watch more than the loss. Action-prediction loss correlates only weakly with task success; plan to evaluate checkpoints on the robot or in simulation (see the evaluation section).

<a id="world-models-three-families"></a>

## World models: three families

A **world model** is an action-conditioned predictor of the future. Given what the robot has seen and a sequence of actions it might take, it predicts what it will see next, or a compressed representation of it. Every world model has to decide *what exactly to predict*, and the three families below give three different answers.

![Three families of world models: pixel/video generative, latent predictive, and unified video-action models converging with VLAs](/blog/images/two_halves_robot_brain/wm-taxonomy.png)

### Family 1: pixel and video generative models

Predict the future frames themselves. These are video generation models conditioned on actions (or on text describing actions). [UniSim](https://arxiv.org/abs/2310.06114) trained an interactive simulator on a mix of robot, human-activity and internet data, and showed that policies trained purely inside it could transfer to real robots. [Genie](https://arxiv.org/abs/2402.15391) learned a playable world model from unlabelled internet gameplay video, and did it without any action labels by also learning a small discrete *latent action* vocabulary from the frame-to-frame changes. NVIDIA's [Cosmos](https://arxiv.org/abs/2501.03575) packages pretrained video world models and tokenisers meant to be post-trained for robots and driving.

You can read their predictions: watch a rollout and you see where the model is wrong. They can also learn from any video. The catch is cost: most of the capacity goes into getting textures, lighting and backgrounds right, none of which matters for whether the cup ends up in the sink, and generating a few seconds of video takes far longer than a robot can wait for a decision.

#### Inside a video world model (compact)

Most modern video world models share three parts:

1. A video tokeniser. A causal 3D autoencoder compresses a clip in space and time, for example 8× in each spatial dimension and 4× in time, into a grid of continuous latents (for diffusion) or discrete codes (for autoregressive models). Without this compression, attention over raw video frames is unaffordable.
2. A spatio-temporal backbone. Either a diffusion transformer (DiT) that denoises the whole latent clip, or an autoregressive transformer that predicts tokens frame by frame (Genie uses a masked, MaskGIT-style variant). Attention is usually factorised into spatial attention within a frame and temporal attention across frames, to keep cost manageable.
3. Conditioning. Actions, text or latent actions enter through cross-attention, adaptive normalisation, or as extra tokens.

The cost comes from the sequence length: even after tokenisation, a few seconds of multi-camera video is tens of thousands of tokens, and diffusion needs many denoising passes over all of them. Mostly for this reason, pixel-space models get used as data generators and evaluators far more than as real-time planners.

### Family 2: latent predictive models

Predict an *embedding* of the next observation instead of the observation itself. An encoder $E$ maps each observation to a latent $z_t = E(o_t)$, and a predictor $P_\phi$ learns the dynamics in that space. In its simplest form, with teacher forcing over a context window:

$$
\mathcal{L}_{\text{latent}} = \mathbb{E}\left[\,\big\| P_\phi(z_{\le t}, a_{\le t}) - \operatorname{sg}(z_{t+1}) \big\|\,\right]
$$

where $\operatorname{sg}$ is stop-gradient: the target embedding is treated as a constant, so the predictor can't "cheat" by collapsing everything to the same latent. The norm is L2 or L1 depending on the paper.

Members of this family differ in where the encoder comes from:

- [DreamerV3](https://arxiv.org/abs/2301.04104) learns its encoder jointly with a recurrent state-space model, keeping a reconstruction loss to anchor the latent, and predicts rewards and episode ends as well. It is built for learning behaviour inside the model with RL (next section).
- [TD-MPC2](https://arxiv.org/abs/2310.16828) drops the decoder entirely and trains its latent to be predictive of future latents, rewards and values, then plans in that latent space. It is reward-driven, so it needs reward signals for each task.
- [DINO-WM](https://arxiv.org/abs/2411.04983) freezes a pretrained [DINOv2](https://arxiv.org/abs/2304.07193) encoder and trains only the predictor, on offline trajectories with no rewards. At test time you give it a goal image, and it plans actions that bring the predicted latent close to the goal's latent.
- [V-JEPA 2](https://arxiv.org/abs/2506.09985) scales the same idea up: a video encoder pretrained with self-supervised latent prediction on a very large corpus of internet video, then an action-conditioned predictor (V-JEPA 2-AC) post-trained on a comparatively small amount of unlabelled robot video from the DROID dataset. The paper reports zero-shot pick-and-place on robot arms in labs that contributed no training data, planning towards goal images.

For a team without a huge robot dataset, the DINO-WM / V-JEPA 2-AC style is attractive. The expensive part, the encoder, is pretrained on someone else's data. The part you train, the predictor, needs no rewards, no action-labelled internet data, and comparatively little robot data.

### Family 3: unified video-action models

Predict future frames *and* actions with one network. This family is the subject of the next section.

### Why errors compound, and why latents help

Any world model used for planning is rolled out autoregressively: its prediction for step $t+1$ becomes the input for step $t+2$. A small error at each step pushes the inputs off the training distribution, which makes the next error larger. Over a horizon of $H$ steps, per-step error does not add up linearly; it compounds.

Two things make latent models degrade more gracefully. First, they don't have to predict irrelevant detail, so per-step error on the task-relevant state is smaller. Second, a good pretrained encoder maps slightly wrong inputs to nearby, still-meaningful latents, while a pixel model fed a slightly blurry frame generates a blurrier one. In practice: keep horizons short, re-plan often (the MPC loop), and train with multi-step rollout losses as well as one-step teacher forcing. V-JEPA 2-AC does the last of these.

![Rollout error compounding: open loop, the pixel-space model's error grows geometrically while the latent-space model drifts slowly; re-planning every five steps resets both](/blog/images/two_halves_robot_brain/rollout-drift.gif)

<a id="world-action-models-predicting-video-and-actions-together"></a>

## World Action Models: predicting video and actions together

A **World Action Model** (WAM) is my umbrella term for models trained with one predictive objective over interleaved video and action sequences, so that the same network acts as a policy and as a world model. Not every paper uses the name, but they share the pattern.

The generic objective is a weighted sum:

$$
\mathcal{L}_{\text{WAM}} = \underbrace{\mathcal{L}_{\text{video}}\big(o_{t+1:t+H} \mid o_{\le t}, \ell\big)}_{\text{predict the future}} \;+\; \lambda\,\underbrace{\mathcal{L}_{\text{action}}\big(a_{t:t+H-1} \mid o_{\le t}, \ell\big)}_{\text{predict what to do}}
$$

where each term can be a token cross-entropy, a diffusion/flow-matching loss, or a latent prediction loss, and $\lambda$ balances them. Depending on which inputs are masked during training, the same model can answer different questions:

| Given | Predict | Acts as |
|---|---|---|
| observations, instruction | actions (+ future frames) | policy |
| observations, actions | future frames | forward dynamics / simulator |
| observations, future frames | actions | inverse dynamics |
| observations, instruction | future frames only | video planner |

Representative members:

- [GR-1](https://arxiv.org/abs/2312.13139) and [GR-2](https://arxiv.org/abs/2410.06158) pretrain a GPT-style transformer on large-scale video prediction (GR-2 on tens of millions of clips), then fine-tune on robot trajectories to predict both future images and actions. So before it sees a single robot action, the model already has a prior on how scenes change.
- [UVA](https://arxiv.org/abs/2503.00200) (Unified Video Action model) learns one joint latent for video and action with separate, lightweight diffusion heads for each. Because the action head doesn't depend on decoding video, it can skip video generation at inference and stay fast enough for control; with masked training, the same model works as a policy, forward model or inverse model.
- [UniPi](https://arxiv.org/abs/2302.00111) is the "video first" version: generate a video of the task being done from the instruction, then recover the actions with an inverse-dynamics model.
- [V-JEPA 2-AC](https://arxiv.org/abs/2506.09985) sits at the latent end: it predicts future embeddings given actions, and produces actions only through planning.
- [WorldVLA](https://arxiv.org/abs/2506.21539) puts a VLA and a world model into one autoregressive model and reports that each half improves the other. NVIDIA's [Cosmos Policy](https://arxiv.org/abs/2601.16163) goes the other way, post-training a video diffusion model so that actions are generated as extra latent frames inside the video.
- [Genie Envisioner](https://arxiv.org/abs/2508.05635) packages the whole pattern as one platform: a video-diffusion world model, a flow-matching action decoder on top of it, and an action-conditioned simulator for evaluation.
- Latent-action models such as [LAPA](https://arxiv.org/abs/2410.11758) borrow Genie's trick: infer discrete "latent actions" from unlabelled video, pretrain a VLA to predict them, then map latent actions to real ones with a little labelled robot data.

### What predicting video buys you

1. Dense supervision. An action is a handful of numbers per step; a future frame is thousands of numbers. Predicting the future forces the representation to model object positions, contact and occlusion, which the action loss alone does not.
2. Action-free data. Human videos, internet videos and robot logs with missing or unreliable action labels all become training data for the video half.
3. A built-in simulator. The same checkpoint can roll out candidate plans, evaluate policies offline, and generate synthetic training data: [DreamGen](https://arxiv.org/abs/2505.12705) fine-tunes video world models on a robot, generates videos of new behaviours, and labels them with pseudo-actions from an inverse-dynamics or latent-action model.

### What it costs

- Compute. Video tokens dominate sequence length and training FLOPs.
- Objective balancing. If $\lambda$ is too small, the action head is under-trained; too large, and the video prior is lost. Ablate it; don't guess.
- Inference latency, if actions depend on generated frames (UniPi-style). Architectures like UVA that decouple the action head avoid this.

### Reproducing a published WAM on internal data

For a team new to world models, I can't think of a more informative first project than reproducing one of these results on your own robot data. The steps are mostly bookkeeping:

1. Match the input contract: frame rate, resolution, number and placement of cameras, action format and normalisation, and chunk length. Write down every place your data differs from the paper's.
2. Reproduce on public data first (the paper's own benchmark or released checkpoint) to make sure the pipeline is right before changing the data.
3. Swap in internal data one variable at a time: same task distribution first, then your embodiment, then your tasks.
4. Report the gap between the published number and yours, and attribute it to specific differences with ablations. "We matched it" and "we got 15 points less, and here is why" are both useful outcomes; an unexplained gap is not.

<a id="choosing-actions-with-a-world-model"></a>

## Choosing actions with a world model

A world model predicts, and something else has to choose. The three mechanisms below trade inference cost against what you have to train.

### Mechanism 1: plan in imagination (CEM / MPPI inside MPC)

Treat action selection as optimisation: search for the action sequence whose imagined outcome is best. Without gradients through the world model, the standard tool is the **cross-entropy method (CEM)**:

1. Sample $N$ candidate action sequences $\mathbf{a}^{(i)} = a^{(i)}_{t:t+H-1} \sim \mathcal{N}(\mu, \operatorname{diag}(\sigma^2))$.
2. Roll each one out in the world model and score it with a cost $J$. For goal-image planning in a latent model, $J(\mathbf{a}^{(i)}) = \big\| \hat{z}_{t+H}^{(i)} - z_{\text{goal}} \big\|$.
3. Keep the $K$ lowest-cost sequences (the elites) and refit:

$$
\mu \leftarrow \frac{1}{K}\sum_{i \in \text{elites}} \mathbf{a}^{(i)}, \qquad \sigma^2 \leftarrow \frac{1}{K}\sum_{i \in \text{elites}} \big(\mathbf{a}^{(i)} - \mu\big)^2
$$

4. Repeat for a few iterations, then execute only the first action (or first few), observe, and plan again. That outer loop is **model predictive control (MPC)**.

**MPPI** (model predictive path integral) is a close relative that weights all samples by $\exp(-J/\beta)$ instead of keeping hard elites; TD-MPC2 uses it.

![The cross-entropy method in a 2D action space: 40 samples are scored, the 8 cheapest are kept, and the Gaussian is refit to them, converging on the goal-reaching action over four iterations](/blog/images/two_halves_robot_brain/cem-imagination.gif)

For goal-image tasks you need no reward and no policy training, and a new goal at test time costs nothing to "learn". The weaknesses are serious, though:

- Latency. $N$ samples × $H$ steps × iterations forward passes per decision. With a large model this is seconds per action, and it is why planning-based results tend to come from smaller, latent models.
- Model exploitation. The optimiser will find action sequences the world model gets wrong in its favour: an imagined gripper passing through the table to reach the goal. Short horizons, conservative action bounds and ensembles of models help.
- Goal specification. Goal images are easy for a demo and awkward for a product: someone has to provide a picture of the finished state. Language goals need a learned cost model.
- Short horizons. Compounding error limits $H$, so long tasks need subgoals or a value function.

![Model predictive control with a world model: encode the observation, run CEM in imagination against a goal latent, execute the first action, re-plan](/blog/images/two_halves_robot_brain/planning-loop.png)

### Mechanism 2: imagine the outcome, then infer the action

Generate the future observations directly (a video of the task succeeding) and recover the actions that connect consecutive frames with an **inverse-dynamics model** $g(a_t \mid o_t, o_{t+1})$. This is [UniPi](https://arxiv.org/abs/2302.00111)'s recipe. Inverse dynamics is easy to learn from a small amount of robot data (it is local and nearly deterministic), while the video model learns from huge amounts of action-free footage, which is the attraction. The failure mode is physically impossible videos: if the generated video shows the cup teleporting, the inverse model has no valid action to recover.

### Mechanism 3: learn a policy inside the model

Use the world model as a simulator and train a policy in it, so that at deployment no planning is needed: one forward pass per action.

#### Actor-critic in imagination (compact)

[Dreamer](https://arxiv.org/abs/1912.01603) and [DreamerV3](https://arxiv.org/abs/2301.04104) do this with reinforcement learning. Starting from latent states encoded from real data, the actor proposes actions, the world model imagines trajectories of length $H$, and a critic learns the expected return of each imagined state. The actor is trained to maximise imagined returns, with the critic's value at the end of the horizon standing in for everything beyond it. Real data is only needed to keep the world model accurate; the policy learns entirely from imagination.

[TD-MPC2](https://arxiv.org/abs/2310.16828) combines mechanisms 1 and 3: it learns a policy and a value function in latent space, uses the policy to seed MPPI's samples, and uses the value to score beyond the planning horizon. The combination is cheaper than pure planning and fails less often than a pure policy.

For manipulation from demonstrations, the catch is that both need a reward signal for each task, which demonstration datasets don't have. Learned reward models, goal-conditioned rewards ("how close is the latent to the goal latent") and success classifiers are the usual workarounds, and each one adds a new thing the policy can exploit.

### The three mechanisms side by side

| | Plan (CEM/MPC) | Video + inverse dynamics | Policy in imagination |
|---|---|---|---|
| Inference cost | High | High (video generation) | Low |
| Needs rewards | No (goal images) | No | Yes |
| New goal at test time | Free | Free (via instruction) | Needs training or goal conditioning |
| Main failure mode | Model exploitation, latency | Physically impossible videos | Reward hacking, model bias |

<a id="one-model-two-bodies-cross-embodiment-action-spaces"></a>

## One model, two bodies: cross-embodiment action spaces

Suppose you have two robots: a 7-DoF arm with a parallel gripper whose actions are 7-D EE deltas + 1 gripper value (8-D), and a smaller arm whose actions are 5 joint positions + 1 gripper value (6-D). You want one checkpoint that controls both and, ideally, is better on each than a model trained on that robot alone. The backbone copes fine. All the trouble is at the input and output interfaces.

### Strategy 1: pad and mask

Define one action vector of size $D_{\max} = \max_e D_e$ over all embodiments $e$, zero-pad shorter actions, and mask the padded dimensions out of the loss. With $m_{e,d} \in \{0, 1\}$ marking which dimensions embodiment $e$ actually uses:

$$
\mathcal{L}_{\text{masked}} = \frac{\sum_{d=1}^{D_{\max}} m_{e,d}\;\ell\big(\hat{a}_{d}, a_{d}\big)}{\sum_{d=1}^{D_{\max}} m_{e,d}}
$$

where $\ell$ is the per-dimension loss (squared error, a flow-matching residual, or a token cross-entropy). Normalising by the number of active dimensions keeps a 6-D robot's loss on the same scale as an 8-D robot's. [π0](https://arxiv.org/abs/2410.24164) takes this approach, padding every robot's action to the largest action dimension in its training mixture.

It's the simplest strategy, and every parameter is shared. Its weakness is **semantic aliasing**: dimension 3 means "EE z-translation" on one robot and "elbow joint angle" on the other, and the model must infer from the images which one applies. Mitigations: order dimensions consistently by meaning where possible (put the gripper in the same slot for every robot), and tell the model which robot it is controlling.

### Strategy 2: embodiment tokens

Add a learned embedding per embodiment (and optionally per action-space type) as an extra token or as adaptive-normalisation conditioning. It is cheap and combines naturally with padding: the token resolves the aliasing, and the model can route its computation per robot. It also gives you a free ablation: with the token shuffled, how much worse does each robot get? That number tells you how embodiment-specific the learned behaviour is.

### Strategy 3: per-embodiment heads (and stems)

Keep a shared trunk and give each embodiment its own input and output modules:

- [Octo](https://arxiv.org/abs/2405.12213) uses readout tokens and a diffusion action head, and adapts to a new action space by attaching and fine-tuning a new head.
- [CrossFormer](https://arxiv.org/abs/2408.11812) uses separate action readout tokens and heads per action type, and trains one policy across very different robots, from single arms to bimanual systems, mobile manipulators, quadrupeds and drones.
- [HPT](https://arxiv.org/abs/2409.20537) (Heterogeneous Pre-trained Transformers) makes the split explicit: embodiment-specific "stems" tokenise each robot's proprioception and vision into a fixed number of tokens, a shared trunk processes them, and task-specific heads decode actions.

Separate heads remove aliasing entirely, and each head can use the right output format. You give up sharing at the output: each head learns only from its own robot's data.

![Three ways to serve two embodiments with one model: pad and mask the action vector, add an embodiment token, or use per-embodiment stems and heads](/blog/images/two_halves_robot_brain/cross-embodiment.png)

### The observation side

Embodiments also differ in what they see, and that is often the bigger source of negative transfer:

- Cameras. Different numbers, placements and fields of view. Use a fixed set of camera "slots" with a learned "missing" token or attention mask for absent views, and train with random camera dropout so the model doesn't over-rely on one view.
- Proprioception. Different sizes and meanings; treat it like the action vector (pad and mask, or per-embodiment stems), and consider proprio dropout to reduce overfitting.
- Control frequency. One robot at 10 Hz and another at 50 Hz means a 10-step chunk covers very different amounts of time. Define chunks in seconds, resample to a common rate, or condition on the frequency.

### Recommendation for two embodiments

With exactly two robots, I'd start with pad-and-mask plus an embodiment token, sharing one flow-matching action head, with dimensions ordered by meaning and actions normalised per embodiment. Then run a three-arm ablation against (a) per-embodiment heads and (b) two single-embodiment specialists trained on the same data. Report success on each robot separately. The specialists are the baseline that matters. If the unified model loses to both of them, you've traded performance for the convenience of one checkpoint. Positive transfer (the unified model beating at least one specialist, usually the robot with less data) is the result you want to see before scaling to more robots.

<a id="data-public-datasets-internal-episodes-and-the-mixture"></a>

## Data: public datasets, internal episodes and the mixture

Every model in this post is a function of its training mixture. Two public datasets dominate open VLA work.

- [Open X-Embodiment](https://arxiv.org/abs/2310.08864) (OXE) pools dozens of existing robot datasets from many labs into one format: over a million trajectories across 22 robot types. It made cross-embodiment pretraining possible, and models like Octo and OpenVLA are trained on curated subsets of it.
- [DROID](https://arxiv.org/abs/2403.12945) is a single, consistently collected dataset: tens of thousands of teleoperated trajectories on one robot platform (a Franka arm) across hundreds of real scenes in many buildings. It is smaller than OXE but far more diverse in environments and far more uniform in format.

Both are worth using, and both need cleaning first. Pooled robot data keeps having the same problems:

- Inconsistent conventions: coordinate frames, rotation representations (Euler angles vs. quaternions vs. axis-angle), gripper open = 0 in one dataset and 1 in another, absolute vs. delta actions.
- Different control frequencies across sub-datasets.
- Idle and failed segments: long pauses at the start of episodes, failed attempts recorded as successes.
- Thin language: many episodes have one templated instruction, or none.

A large share of practical VLA work is writing the conversion and filtering code that fixes these, and checking that it's right by replaying converted actions and watching what the robot does.

### Setting mixture weights

During training, each batch samples sub-datasets with probabilities $w_i$. Three ways to set them:

1. Proportional to size, with a temperature. $w_i \propto N_i^{\alpha}$, where $N_i$ is the number of transitions in dataset $i$. $\alpha = 1$ is plain proportional sampling (large datasets dominate); $\alpha < 1$ up-weights small datasets; $\alpha = 0$ is uniform.
2. By hand, from judgement about quality and relevance. Octo and OpenVLA both published hand-tuned weights over OXE subsets, down-weighting low-quality or off-domain data.
3. Learned re-weighting. Methods such as [Re-Mix](https://arxiv.org/abs/2408.14037) optimise the weights directly, using a robust optimisation objective to up-weight the domains a reference model finds hardest.

### Blending internal episodes with public data

Internal episodes on your own robots are the most valuable data you have, and usually the smallest set. These questions need experiments, because intuition gets them wrong:

- Pretrain then fine-tune, or co-train? Pretraining on public data then fine-tuning on internal data is simple; co-training (mixing internal data into the public mixture, with a high weight) tends to forget less. Test both at matched compute.
- What weight for internal data? Sweep it, for example 10%, 25%, 50% of each batch. Plot success on internal tasks *and* on a held-out generalisation set; over-weighting internal data often wins the first and loses the second.
- Which public subsets help? Leave-one-group-out ablations (drop all data from one embodiment family, or all low-quality datasets) are expensive but are the only direct evidence that a subset helps.
- How much internal data is enough? Train with 25%, 50% and 100% of internal episodes and fit a trend. The curve tells the data team whether another thousand episodes are worth collecting. I'd value that more than any single checkpoint.

### Simulation data and sim-to-real (compact)

Simulation is the third data source. It's cheap and infinitely resettable, it comes with ground-truth state and rewards, and it can produce the rare situations (drops, collisions, near-misses) that teleoperators avoid. The gap to reality comes from rendering (sim images look wrong), physics (contact, friction and deformable objects are approximated) and from differences in actuators and latency.

[Domain randomization](https://arxiv.org/abs/1703.06907) is the classic mitigation: randomise textures, lighting, camera poses, masses and frictions so widely that the real world looks like one more variation. For VLAs, simulation earns its keep in evaluation (next section) and in targeted augmentation of skills that are geometric rather than contact-rich. It helps least when the task depends on contact physics: insertion, deformable objects, anything soft.

<a id="evaluation-what-beating-a-baseline-actually-means"></a>

## Evaluation: what "beating a baseline" actually means

"Our checkpoint outperforms the open-source baseline" is the claim that justifies all the work above, and in robotics it is unusually easy to make sloppily.

### Why real-robot evaluation is hard

- Small samples. Each trial takes minutes of robot and operator time, so evaluations are often 10-50 trials per task.
- High variance. Object placement, lighting, the operator's reset, and wear on the robot all change outcomes.
- Drift. The same checkpoint can score differently on Monday and Friday.

The statistics are unforgiving. A success rate $\hat{p}$ from $n$ trials has standard error $\sqrt{\hat{p}(1-\hat{p})/n}$. At $n = 20$ and $\hat{p} = 0.5$, that's about 0.11, so the 95% interval is roughly ±22 percentage points. Comparing two policies at 50 trials each, 60% versus 70%: the standard error of the difference is $\sqrt{0.6 \cdot 0.4/50 + 0.7 \cdot 0.3/50} \approx 0.095$, so the 95% interval on a 10-point gap is about ±19 points. A 10-point gap at that sample size tells you nothing.

### What a credible comparison needs

1. The baseline gets the same treatment. Fine-tune the open-source model (OpenVLA, Octo, π0) on the same data, with its authors' recommended recipe and the same compute budget. Comparing your fine-tuned model to someone's zero-shot checkpoint isn't a fair test.
2. A fixed evaluation suite: a written list of tasks, object sets and initial conditions (photographed or marked on the table), used unchanged for every checkpoint.
3. Paired, interleaved trials. For each initial condition, run both policies back to back, in randomised order, so drift and resets affect both equally. Ideally the operator doesn't know which policy is running.
4. Enough trials, and intervals. Report success with confidence intervals (Wilson intervals behave better than the normal approximation at small $n$) and use a paired test across conditions.
5. Per-task and per-embodiment results as well as the average. An average across two robots can hide a large regression on one of them.
6. Partial credit where it helps: report sub-stage success (grasped / lifted / placed) as well, which reduces variance and shows *where* a policy fails.

### Simulation proxies

Simulation evaluates hundreds of episodes per checkpoint for the cost of a few real ones. [LIBERO](https://arxiv.org/abs/2306.03310) is a standard simulated suite of language-conditioned manipulation tasks, grouped to test spatial, object, goal and long-horizon generalisation. [SIMPLER](https://arxiv.org/abs/2405.05941) goes further: it builds simulated versions of common real setups (the Google robot and the WidowX/Bridge setup) and shows that its simulated success rates track real-world rankings of policies.

Validate any proxy before trusting it. Evaluate a set of checkpoints both in the proxy and on the real robot, and check that the proxy ranks them the same way (a rank correlation across a dozen checkpoints is a good first test). A proxy that ranks well can be used for ablations and checkpoint selection; the final claim still needs real trials.

### World models as evaluators

A good world model is also a simulator for evaluation: roll out a policy inside it and score the imagined episodes with a success classifier or a vision-language judge. It's cheap, needs no real robot and works on your own scenes. It's also risky, since a policy can "succeed" by exploiting the model's errors. The idea has moved quickly into practice. [WorldGym](https://arxiv.org/abs/2506.00613) and [Ctrl-World](https://arxiv.org/abs/2510.10125) roll policies out in action-conditioned video models and report that the imagined success rates preserve real-world policy rankings, and the Gemini Robotics team [evaluates its policies in a Veo-based world simulator](https://arxiv.org/abs/2512.10675), checked against more than 1,600 real-world trials and extended to out-of-distribution scenes and safety red-teaming. Validate your own the same way any simulation proxy is validated: does its ranking of checkpoints agree with the real robot? If it does, it makes ablations cheap, and few tools are worth more to a robot learning team.

<a id="research-discipline-ablations-and-reproducibility"></a>

## Research discipline: ablations and reproducibility

Most sections above end with some version of "decide this with an experiment", which is only useful if the experiments can be trusted.

### Designing a structured ablation

- Start from a strong, frozen reference configuration and change one factor at a time. Ablations against a weak base exaggerate every gain.
- Choose factors by expected impact × uncertainty. From this post, the usual high-value ones are: action head type, chunk length, conditioning strategy for embodiments, data mixture weights, LoRA vs. full fine-tuning, video-prediction weight $\lambda$, and whether proprioception is used.
- Use small factorial designs when factors may interact (chunk length × action head is a common one). A 2×2 design costs four runs and tells you about the interaction, which one-at-a-time ablations cannot.
- Seeds per arm. Train at least 2-3 seeds for any claim, and remember that evaluation variance (above) is often larger than training-seed variance; budget trials accordingly.
- Pre-register the decision. Before running, write down what result would make you adopt the change. Otherwise you will find a story in the noise afterwards.
- Prune early. Run cheap proxies (simulation, offline action-prediction error on held-out episodes) first, and send only the promising arms to the real robot.

### Experiment management

Six months from now someone will ask how checkpoint `v0.7` was trained. The answer should take one command, not one week:

- Configs as files. Every run is fully described by a config file (YAML or similar, managed by a tool like Hydra). No settings that live only in a command line or in someone's memory.
- Seed everything (Python, NumPy, framework, data loader workers) and log the seeds. Accept that GPU non-determinism remains, and measure it with repeated seeds rather than assuming it away.
- Version the code (git commit hash, refuse to launch with uncommitted changes), the data (a dataset version or manifest hash covering conversion code and filtering), and the checkpoint (with its config, normalisation statistics and data version stored alongside).
- Log everything to one tracker: config, metrics, evaluation results and videos of evaluation episodes, linked to the checkpoint.
- Re-run old experiments regularly. Rebuilding a historical result from its config is the only real test that the system works.

### Reproducing a published result

A checklist for reproducing a paper (the WAM workflow in the earlier section is one instance):

1. Read the paper, appendix and released code; list every hyperparameter and data-processing step, and where they differ.
2. Reproduce the paper's own evaluation with its released checkpoint before training anything.
3. Retrain on the paper's data and match its number within the paper's reported variance.
4. Only then change one thing: your data, your robot, your tasks.
5. Write up the gaps and their causes, including the negative results.

> **One-screen checklist.** Config file per run · seeds logged · git hash pinned · data manifest hashed · normalisation stats saved with checkpoint · fixed evaluation suite · paired, randomised trials · confidence intervals · per-task and per-embodiment results · baseline fine-tuned with the same budget · proxy validated against real ranking · decision rule written before the run.

<a id="verdict-world-models-as-a-staged-bet"></a>

## Verdict: world models as a staged bet

Back to the thesis: VLAs and world models are two halves of the same system, and the field is converging on models that do both. Not every part of world-model research is ready to build on, though. This is how I'd stage the investment for a team building manipulation foundation models.

### Invest now: world models as training signal and as evaluator

- Video prediction as an auxiliary or pretraining objective. Adding $\mathcal{L}_{\text{video}}$ to a VLA (the WAM objective) is cheap to try, builds on the existing VLA pipeline, and has supporting evidence from GR-1/GR-2 and UVA. It also opens the door to training on action-free video.
- World models as evaluators. Even an imperfect action-conditioned video model that ranks checkpoints correctly makes every ablation in the previous section cheaper. The payoff is measured in experiment throughput.
- Reproduce one latent world model (DINO-WM or V-JEPA 2-AC style) on internal data, as a capability-building project with a clear success criterion: matching the published goal-reaching results on your own robot.

### Research bet, 12-24 months: world models as the controller

Planning with a world model as the main way to select actions, beyond short goal-image tasks, is not yet competitive with a well-trained VLA on general instruction-following manipulation. The obstacles are the four covered above: latency, model exploitation, goal specification and short horizons. Each is an active research area and progress has been fast. I'd fund a small dedicated effort and keep it off the product roadmap.

### Later: large in-house pixel world models

Training a large video world model from scratch takes compute and data budgets that only a few organisations have. Post-train an open one (Cosmos-style) instead.

### What would justify scaling up

Concrete go/no-go evidence, in the order it should arrive:

1. The video objective helps at a fixed action-data budget. A VLA trained with $\mathcal{L}_{\text{WAM}}$ beats the same VLA without it on held-out tasks, across seeds, with confidence intervals that don't overlap.
2. The world-model evaluator ranks correctly. Its ranking of a dozen checkpoints agrees with real-robot ranking (high rank correlation).
3. Planning beats a matched VLA on held-out goal-conditioned tasks within the robot's latency budget.

Signals 1 and 2 are achievable now and pay for themselves. Signal 3 would change the architecture of the whole system, which is why I'd watch it most closely.

On scalability: the world-model half scales with *video*, which is plentiful; the policy half scales with *robot actions*, which are scarce. That asymmetry is the strongest long-run argument for World Action Models. The more of the learning you can push onto the video side, the less each new robot and each new task depends on expensive teleoperation.

![A staged bet on world models: invest now in video prediction loss, evaluation and reproduction; gate the move to world-model planning and large in-house models on evidence](/blog/images/two_halves_robot_brain/staged-bet.png)

<a id="further-reading"></a>

## Further reading

**VLAs and action heads**

- [RT-2](https://arxiv.org/abs/2307.15818): the paper that framed VLAs as "actions as tokens" and showed web knowledge transferring to robot control.
- [OpenVLA](https://arxiv.org/abs/2406.09246): the open 7B VLA; the best place to read about tokenised actions, the training mixture and LoRA fine-tuning in detail.
- [π0](https://arxiv.org/abs/2410.24164): VLM plus a flow-matching action expert; the reference design for continuous, high-frequency action heads.
- [FAST](https://arxiv.org/abs/2501.09747): DCT + BPE action tokenisation, and why naive per-step tokens fail at high frequency.
- [ACT](https://arxiv.org/abs/2304.13705) and [Diffusion Policy](https://arxiv.org/abs/2303.04137): action chunking and generative action heads, from before VLAs.
- [Knowledge insulation](https://arxiv.org/abs/2505.23705): how to attach a new action expert without damaging the backbone.

**World models**

- [DreamerV3](https://arxiv.org/abs/2301.04104) and [TD-MPC2](https://arxiv.org/abs/2310.16828): the two reference designs for learning behaviour with latent world models.
- [DINO-WM](https://arxiv.org/abs/2411.04983) and [V-JEPA 2](https://arxiv.org/abs/2506.09985): planning in the latent space of pretrained visual encoders.
- [Genie](https://arxiv.org/abs/2402.15391) and [UniSim](https://arxiv.org/abs/2310.06114): interactive video world models and learned latent actions.

**World Action Models**

- [GR-2](https://arxiv.org/abs/2410.06158), [WorldVLA](https://arxiv.org/abs/2506.21539), [UVA](https://arxiv.org/abs/2503.00200), [UniPi](https://arxiv.org/abs/2302.00111) and [LAPA](https://arxiv.org/abs/2410.11758): video pretraining, one autoregressive model for both halves, joint video-action latents, video-then-inverse-dynamics, and latent actions from unlabelled video.

**World models as evaluators**

- [WorldGym](https://arxiv.org/abs/2506.00613), [Ctrl-World](https://arxiv.org/abs/2510.10125) and [Veo-based policy evaluation](https://arxiv.org/abs/2512.10675): the current evidence that video world models can rank robot policies.

**Cross-embodiment, data and evaluation**

- [Open X-Embodiment](https://arxiv.org/abs/2310.08864) and [DROID](https://arxiv.org/abs/2403.12945): the two public datasets most open VLAs are built on.
- [Octo](https://arxiv.org/abs/2405.12213), [CrossFormer](https://arxiv.org/abs/2408.11812) and [HPT](https://arxiv.org/abs/2409.20537): three answers to "one model, many bodies".
- [SIMPLER](https://arxiv.org/abs/2405.05941) and [LIBERO](https://arxiv.org/abs/2306.03310): simulated evaluation, and how to check that it tracks the real world.
