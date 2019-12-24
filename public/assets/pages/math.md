---
title: Mathematics of the Data Science Ontology
math: true
#number-headings: true
---

_**Warning**: This document is under construction._

In this guide, we explain the mathematical underpinnings of the Data Science Ontology. To make sense of it, you should first read the beginning of the [introductory guide](/help/intro), to learn informally what we mean by “concepts” and “annotations”. You should also have a working knowledge of [monoidal categories](https://ncatlab.org/nlab/show/monoidal+category) and their [graphical languages](https://ncatlab.org/nlab/show/string+diagram). There are now several excellent introductions to these ideas, pitched at nonspecialists and focusing on applications outside pure math [[BS10], [CP10], [Sel10]]. The math described here belongs to a small but growing line of work on categorical knowledge representation [[SK12], [Pat17]].

Throughout this website and the ontology data format, we use terminology of programming language theory. Category theory has its own distinctive terminology. The following dictionary may be helpful for translating back and forth.

| Programming | Category theory            | Notation                      |
| ----------- | -------------------------- | ----------------------------- |
| type        | object                     | $X$                           |
| function    | morphism                   | $f: X \to Y$                  |
| inputs      | domain                     | $\text{dom}(f)$               |
| outputs     | codomain                   | $\text{codom}(f)$             |
| composition | composition                | $f \cdot g$ or $fg$           |
| product     | cartesian monoidal product | $X \times Y$ and $f \times g$ |
| unit type   | monoidal unit              | $1$                           |
| copy        | internal comultiplication  | $\Delta_X: X \to X \times X$  |
| delete      | internal counit            | $\lozenge_X: X \to 1$         |

## References

[bs10]: #

\[[BS10]]: John C. Baez and Mike Stay, 2010.
Physics, topology, logic and computation: A Rosetta Stone.
[DOI](https://doi.org/10.1007/978-3-642-12821-9_2),
[arXiv](https://arxiv.org/abs/0903.0340)

[cp10]: #

\[[CP10]]: Bob Coecke and Eric Oliver Paquette, 2010.
Categories for the practising physicist.
[DOI](https://doi.org/10.1007/978-3-642-12821-9_3),
[arXiv](https://arxiv.org/abs/0905.3010)

[pat17]: #

\[[Pat17]]: Evan Patterson, 2017.
Knowledge representation in bicategories of relations.
[arXiv](https://arxiv.org/abs/1706.00526)

[sel10]: #

\[[Sel10]]: Peter Selinger, 2010.
A survey of graphical languages for monoidal categories.
[DOI](https://doi.org/10.1007/978-3-642-12821-9_4),
[arXiv](https://arxiv.org/abs/0908.3347)

[sk12]: #

\[[SK12]]: David I. Spivak and Robert E. Kent, 2012.
Ologs: a categorical framework for knowledge representation.
[DOI](https://doi.org/10.1371/journal.pone.0024274),
[arXiv](https://arxiv.org/abs/1102.1889)
