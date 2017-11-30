---
title: What is the Data Science Ontology?
---

The Data Science Ontology (DSO) is an ontology (knowledge base) about data science with a focus on computer programming for data analysis. The *concepts* of the ontology are drawn from statistics, machine learning, and the practice of software engineering for data science. Besides cataloging and organizing data science concepts, the ontology provides semantic *annotations* of commonly used software libraries for data science, such as [pandas](https://pandas.pydata.org/) and [scikit-learn](http://scikit-learn.org/). Annotations map the libraries' types and functions onto the ontology's universal concepts.

The purpose of the Data Science Ontology is to enable artificial intelligence (AI) capabilities for collaborative, data-driven science, such as:

- automated statistical meta-analysis
- meta-learning for machine learning
- semantic queries on a corpus of data analyses
- similarity measures and personal recommendations for data analyses

Several of these capabilities are currently under development as part of the broader Open Discovery project. The connection between the Data Science Ontology and AI for data science is established by a suite of computer program analysis tools. Using the ontology's annotations, the program analysis tools can automatically create a machine-interpretable semantic representation of a data analysis written in a conventional programming language like Python or R. Such semantic representations serve as the raw material for AI and machine learning algorithms operating on data analyses.

## FAQ

**Why is \[concept\] or \[package\] missing from the ontology?**

The ontology is at an early stage of development and many important data science concepts and software packages are missing. We welcome contributions of all kinds. [Learn how to contribute]

**How is the DSO different from existing ontologies for data science?**

Existing ontologies and schemas in this space include [STATO](http://stato-ontology.org/), an OWL ontology for basic statistics; [PMML](http://dmg.org/pmml/v4-3/GeneralStructure.html), an XML schema for data mining models; and [ML Schema](https://www.w3.org/community/ml-schema/), a schema for data mining and machine learning workflows under development by a W3C community group. These standards differ from the Data Science Ontology and from each other in various ways. From our perspective, the most important difference is that the DSO is designed to express precise semantic information about data analysis software, while the other ontologies are not. We do not claim it is superior in all respects. The structure and content of any  ontology are determined by its intended applications, and the DSO may not be suitable for your particular application. That said, we hope to support a broad range of data science activities. If you have ideas about how to improve the Data Science Ontology, please let us know.

**Can I write programs in the ontology language?**

Not yet. The ontology language is a *modeling* language for computer programs but not itself a *programming* language. However, generating executable source code for functions expressed in the ontology language is a possible direction for future work.
