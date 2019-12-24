---
title: FAQ
---

**Why are “obvious” concepts and packages missing from the ontology?**

The ontology is at an early stage of development and many important data science concepts and software packages are missing. We welcome contributions of all kinds. [Learn how to contribute](/help/contribute)

**How is the DSO different from existing ontologies for data science?**

Existing ontologies and schemas in this space include [STATO](http://stato-ontology.org/), an OWL ontology for basic statistics; [PMML](http://dmg.org/pmml/v4-3/GeneralStructure.html), an XML schema for data mining models; and [ML Schema](https://www.w3.org/community/ml-schema/), a schema for data mining and machine learning workflows under development by a W3C community group. These standards differ from the Data Science Ontology and from each other in many ways. From our perspective, the most important difference is that the DSO is designed to express precise semantic information about data analysis software, while the other ontologies are not. We do not claim it is superior in all respects. The structure and content of any ontology are determined by its intended applications, and the DSO may not be suitable for your particular application. That said, we hope to support a broad range of data science activities. If you have ideas about how to improve the Data Science Ontology, please let us know.

**Why doesn't the DSO use the Semantic Web standards?**

The DSO is written in a bespoke ontology language, the MONoidal Ontology and Computing Language (Monocl), instead of the Semantic Web languages (RDF, RDFS, OWL). Description logics, including the [Web Ontology Language (OWL)](https://www.w3.org/TR/owl-primer/), are designed to express _taxonomic_ knowledge, namely hierarchies of concepts and relations between concepts. They are ill-suited to expressing _procedural_ or _algorithmic_ knowledge. An ontology language based on the lambda calculus is therefore a better fit for this project than a description logic like OWL. Nevertheless, to support interoperation with other knowledge-based systems, we regularly export the ontology to the [Resource Description Framework (RDF)](https://www.w3.org/TR/rdf11-primer/) format.

**Can I run programs written in the ontology language?**

Not yet. The ontology language is a _modeling_ language for computer programs but not itself a _programming_ language. However, generating executable source code for functions expressed in the ontology language is a possible direction for future work.

**The ontology language is functional, so how can it model imperative programming languages like Python and R?**

The ontology language is [purely functional](https://en.wikipedia.org/wiki/Purely_functional_programming): there are no mutations or side-effects and all “functions” are truly functions in the mathematical sense. The most popular languages for data science, such as Python and R, are _not_ purely functional. Practically speaking, the annotation format and program analysis tools bridge this gap, albeit imperfectly, by translating mutations into copy-on-modify operations. Taking the more philosophical view, one might wonder why the ontology language does not simply support mutation in the first place. In fact, this is a deliberate modeling choice, not fundamentally different from the modeling choices made by data scientists when constructing statistical models. We argue that the simplicity of the functional programming model, and the relative ease of reasoning about functional programs compared to imperative programs, outweighs the loss of fidelity when modeling real-world data analysis code.

**Why doesn't the ontology language have variables?**

Function definitions in the ontology language are “point-free”: they do not identify variables (“points”). In fact, the ontology language has no variables at all, in either its textual or graphical syntax. In this respect, it is similar to [concatenative programming languages](https://en.wikipedia.org/wiki/Concatenative_programming_language) like Forth and [function-level programming languages](https://en.wikipedia.org/wiki/Function-level_programming) like FP and dissimilar to most other programming languages. While it may seem counterintuitive at first, this convention greatly simplifies the algorithmic manipulation of programs by removing all issues related to free and bound variables, variable renaming, etc. Note that the inputs and outputs of concepts and annotations are sometimes given human-readable names. These names are for documentation purposes only; they are ignored by the ontology language.
