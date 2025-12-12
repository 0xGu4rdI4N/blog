---
title: 'certainity is all we need?'
date: '2025-12-12'
type: 'fundamental'
---
In the present paradigm of machine learning, what we all are quite familiar with is that these models are probabilistic in nature and it tries to model a distribution of the data.

But why aren't we deterministic, isn't that what hyper-intelligent models be like?

In quite some long time of history, things have been deterministic right? the laws of motion, the kepler laws of planetary motion, the law of thermodynamics*.

Well, so it seems, for many of the observable behavior of the universe, things have been deterministic because despite nature being wildly complex, at an aggregate level( *observable behaviour* ), many variables cancel out. for eg.

1. Countless forces on a falling object → but motion is a parabola
2. A pendulum

   Microscopically:
   - trillions of atoms vibrating
   - internal stresses
   - microscopic friction
   - air drag
   - molecular turbulence
   - electromagnetic interactions

   But the observed behavior collapses to:

   :::cent
   $$ \theta''(t) + \frac{g}{L} \sin \theta = 0 $$
   :::

The many latent varibles which we still aren't aware of are still there, but at this macroscopic level they supressed each other.

The root of all this, Nature, which generates the data, the process which we oftenly refer to as **Data Generating Process**, is so much complex that it is for now not possible to deteministically model it.

:::pink
this uncertainity stems out of our ignorance of the world and the underlying processes
:::

Laplace famously articulated this vision in 1814, proposing a hypothetical intellect, often referred to as "Laplace's Demon," which, if it knew the precise position and momentum of every particle in the universe at a single instant, could calculate the entire future of the cosmos with absolute certainty. For Laplace, "nothing would be uncertain and the future, as the past, would be present to its eyes".
Imagine a controlled environment where a its completely vacuum but a ball is moving at a constant velocity *v*, now we can deterministically say that after *t* seconds, the ball will be moving with *v* velocity. The environment was so simple, that we easily intuitively knew the latent variable which here was nothing.

Due to our incomplete knowledge of the world and the emergence of stochasticity out of this ignorance, the field of Machine Learning has been forced to abandon the deterministic dream of $Y = f(X)$ in favor of the probabilistic reality of $P(Y|X)$.
In this stochastic sense, a deterministic model is much less intelligent since its throwing away the information which is there in the disribution.

:::pink
The raw material of ML is not "truth," but "observation."
:::

A valid doubt would be, but all models look so deterministic, for eg. a linear regression model, given a the input, will *deterministically predict* the output. The model inherently is probabilitic, its just we report the MAP/Mean and not the distribution.

:::cent
*Noise  = Uncertainity = (Epistemic + Aleatoric) noise*
:::
Epistemic uncertainty arises due to our incomplete knowledge of the world and the underlying processes. The latent variables that affect the process are unknown to us. With more data, we reduce this certainity.
Aleatoric uncertainty is the so called inherent randomness in the data generation process. It captures the noise that is intrinsic to the phenomenon being observed. Crucially, aleatoric uncertainty cannot be reduced by collecting more data. It is a property of the data distribution itself. This is the variables which can't be resolved at macroscopic level.

But I believe its also just our ignorance of the true latent variables for this cause-effect relationship. Every event has a cause, so if outcomes look random, it’s because we haven’t identified the true complete state. 

:::footer
I can see farther because I stand on the shoulder of giants who came before me. This is a gratitude to all those whom I couldnt explicitly cite but who made this transfer and expansion of knowedge possible.
:::