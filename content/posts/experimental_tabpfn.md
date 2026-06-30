---
title: 'A brief study of TabPFN under multi-label setting'
date: '2026-06-06'
type: 'experimental, tabpfn'
---
## Introduction
Inspired by my inability  to debug the output of the TabPFN model under multi-label settings with unlabeled examples (PU-learning) as well, I designed small toy experiments to understand the performance limitations of this tabular model. 

## Experiment Design 
My original research was on a multi-class multi-label dataset with some class having extreme imbalance of positive and negative examples, but since the model was like a blackbox I couldnt specify why it was underperforming, whether it was due to scarcity of positive examples, or if the feature vector was the issue.

Now respecting the sad limitation of the inhabitants of the spaceland, I constrained all the settings to the 2D space. We will be having 4 classes such that each point will belong to 3 classes. Refer to the diagram below for reference. 

:::cent
![True Topology with 4 classes](/blog/images/tabpfn/true_topology.png)
*Figure 1: True Topology setup with 4 overlapping classes in a 2D space. Each training and test point will be sampled from this 2D feature space. As obvious, each point will belong to exactly 3 classes.*
:::

We will test under 3 different settings:

1. **PU-Learning Simulation:** Dropping some positive examples from a single class to simulate the unlabeled settings.
2. **Feature Noise Injection:** Adding feature noise by increasing the feature dimension but keeping it random for the dimensions other than the 2 true dimensions.
3. **Class Imbalance:** Simulating class imbalance by varying the degree of the imbalance.

## Experiment 1: PU-Learning Simulation
To simulate this constraint within our 2D toy space, we take the true positive points for a all classes and artificially drop the labels for a varying percentage of them. Our goal here is to observe how rapidly TabPFN's decision boundaries change as confirmed positive labels become less, and to see if the model collapses into predicting the majority negative class.


:::cent
![PU-learning simulation](/blog/images/tabpfn/pu_sim.png)
*Figure 2: PU-learning simulation results. As the percentage of removed positive labels increases, the model's ability to correctly classify positive examples decreases.*
:::

:::pink
Ideally the performace across the classes should have been same due to their symmetric nature, but the most possible reason for the difference could be the different support near boundaries for each class as the sampling and dropping would differ. 
:::


:::footer
I can look farther because I stand on the shoulder of giants who came before me. This is a gratitude to all those whom I couldnt explicitly cite but who made this transfer and expansion of knowedge possible.
:::