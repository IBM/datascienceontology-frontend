---
title: FAQ
---

**Why is \[concept\] or \[package\] missing from the ontology?**

The ontology is at an early stage of development and many important data science concepts and software packages are missing. We welcome contributions of all kinds. [Learn how to contribute](/page/contributing)

**How is the DSO different from existing ontologies for data science?**

Existing ontologies and schemas in this space include [STATO](http://stato-ontology.org/), an OWL ontology for basic statistics; [PMML](http://dmg.org/pmml/v4-3/GeneralStructure.html), an XML schema for data mining models; and [ML Schema](https://www.w3.org/community/ml-schema/), a schema for data mining and machine learning workflows under development by a W3C community group. These standards differ from the Data Science Ontology and from each other in various ways. From our perspective, the most important difference is that the DSO is designed to express precise semantic information about data analysis software, while the other ontologies are not. We do not claim it is superior in all respects. The structure and content of any  ontology are determined by its intended applications, and the DSO may not be suitable for your particular application. That said, we hope to support a broad range of data science activities. If you have ideas about how to improve the Data Science Ontology, please let us know.

**Why doesn't the DSO use the Semantic Web standards?**

The DSO is written in a bespoke ontology language instead of the Semantic Web languages ([RDF](https://www.w3.org/TR/rdf11-primer/), [RDFS](https://www.w3.org/TR/rdf-schema/), [OWL](https://www.w3.org/TR/owl-primer/)). Description logics like OWL are designed to express *taxonomic* knowledge, namely hierarchies of concepts and relations between concepts. They are ill-suited to expressing *procedural* or *algorithmic* knowledge. Given our goals, an ontology language related to the lambda calculus is a much better fit than a description logic. For this reason we have eschewed the Semantic Web languages.

**Can I run programs written in the ontology language?**

Not yet. The ontology language is a *modeling* language for computer programs but not itself a *programming* language. However, generating executable source code for functions expressed in the ontology language is a possible direction for future work.
