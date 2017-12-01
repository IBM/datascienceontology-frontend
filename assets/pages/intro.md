---
title: Introduction to the Data Science Ontology
---

In this introductory guide, we explain the two basic entities comprising the Data Science Ontology, *concepts* and *annotations*. We also explain the ontology language by which concepts and annotations are specified, including both its textual syntax and graphical syntax. After completing this guide, you should be able to interpret the concept and annotation entries found on this website, as well as the semantic representations of data analyses produced by the Open Discovery project. The intended audience is working data scientists, authors of statistical software, and other practitioners of data-driven science.

### Overview

The Data Science Ontology is comprised of two kinds of entities: concepts and annotations.

1. **Concepts** are the abstract ideas of data science. For instance, the ontology has concepts of a [data table](/concept/table), of a [statistical model](/concept/model), and of [fitting a predictive model](/concept/fit-supervised). Concepts themselves come in two kinds: types and functions. This terminology roughly agrees with that of functional programming. Thus, a **type** concept is a kind or species of entity that exists in the data science domain. A **function** concept is a functional relation or map from an input type to an output type. The concepts of [data table](/concept/table) and [statistical model](/concept/model) are types, while the concept of [fitting a predictive model](/concept/fit-supervised) is a function.

2. As a modeling assumption, we suppose that the programs implemented by statistical software packages, such as [scikit-learn](http://scikit-learn.org/) or [glmnet](https://cran.r-project.org/web/packages/glmnet/), instantiate the universal concepts of the ontology. **Annotations** map the types and functions provided by software packages onto the types and functions of the ontology, respectively. For instance, the [pandas data frame](/annotation/python/pandas/data-frame) annotation maps the [DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html) class in pandas onto the [data table](/concept/table) concept. A unit of source code does not necessarily map onto a single concept. For example, the [fit sklearn clustering model](/annotation/python/sklearn/fit-predict-clustering) annotation maps the [fit_predict](http://scikit-learn.org/stable/modules/generated/sklearn.base.ClusterMixin.html#sklearn.base.ClusterMixin.fit_predict) method of clustering estimators in scikit-learn onto a composition of two concepts, [fitting a model](/concept/fit) and [getting clusters from a clustering model](/concept/clustering-model-clusters). More elaborate compositions are possible.

As the last example suggests, significant modeling flexibility is required to accurately translate the diverse APIs of statistical software into a single set of universal concepts. To meet this challenge, an annotation can map a single library function or method onto an arbitrary composition of concepts. Compositions are expressed in the ontology language **Monocl** (the MONoidal Ontology and Computing Language). We think of the ontology language as a minimalistic, typed, functional programming language. Being designed for knowledge representation, rather than practical computing, it is simpler than any real-world programming language but is still moderately expressive.

The next section develops the ontology language Monocl. Once that is understood, it is easy to understand the concepts and annotations in the Data Science Ontology.

## Ontology language

Concepts constitute the **basic types** and **basic functions** of the ontology. In analogy to the primitive types and functions of a real-world programming language, the basic types and functions are atomic—indecomposable into smaller parts. However, they can be combined to form more complex types and functions. The ontology language defines constructors for combining types and functions. In this section, we explain these constructors at an intuitive level. If you are so inclined, you may also read a [more formal account](/page/math) of the syntax and semantics of the ontology language.

### Types

Monocl's type system is about as minimalistic as they come. It supports product types, a unit type, and a simple form of subtyping.

### Functions
