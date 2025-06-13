# Advanced Algorithms: A Comprehensive Overview

## **1. Introduction**

This document provides an overview of key concepts in advanced algorithms using a range of Markdown features, including **bold text**, _italic text_, inline $\LaTeX$ expressions such as $O(n \log n)$, block equations, tables, and code snippets.

---

## **2. Algorithmic Complexity**

Understanding the growth of functions is crucial in analysing algorithmic efficiency.

### **Asymptotic Notation**

- **Big-O**: Upper bound, e.g., $O(n^2)$
- **Omega**: Lower bound, e.g., $\Omega(n)$
- **Theta**: Tight bound, e.g., $\Theta(n \log n)$

### **Example: Merge Sort Complexity**

$$
T(n) = 2T\left(\frac{n}{2}\right) + \Theta(n) \Rightarrow T(n) = \Theta(n \log n)
$$

---

## **3. Key Algorithm Classes**

### **Greedy Algorithms**

Greedy methods make the locally optimal `choice` at each stage.

```python
function Dijkstra(Graph, source):
    dist[source] ← 0
    for each vertex v in Graph:
        if v ≠ source:
            dist[v] ← ∞
        add v to Q
    while Q is not empty:
        u ← vertex in Q with min dist[u]
        for each neighbor v of u:
            alt ← dist[u] + length(u, v)
            if alt < dist[v]:
                dist[v] ← alt
```

**Example:** Activity Selection

```plaintext
1. Sort activities by finish time
2. Select the first activity
3. Select next activity starting after the last selected finishes
```