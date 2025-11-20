---
title: "The Geometry of Biology"
date: "2024-03-21"
readTime: "5 min"
tags: ["Math", "Biology"]
excerpt: "How geometric deep learning is changing how we see cells."
---

# Introduction

Biological data is rarely Euclidean. Proteins fold in 3D space, and gene regulatory networks form complex graphs.

# The Math

We calculate the energy state using the Hamiltonian:

$$H = \sum_{i} \frac{p_i^2}{2m_i} + \sum_{i<j} V(r_{ij})$$

# The Code

Here is a python snippet to visualize it:

```python
import networkx as nx
G = nx.erdos_renyi_graph(100, 0.1)
print(nx.info(G))
```
