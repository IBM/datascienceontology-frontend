---
title: Introduction to the Data Science Ontology
math: true
---

In this introductory guide, we explain the two basic entities comprising the Data Science Ontology, concepts and annotations. We also explain the ontology language by which concepts and annotations are specified, including both its textual syntax and graphical syntax. After completing this guide, you should be able to interpret the concept and annotation entries found on this website, as well as the semantic representations of data analyses produced by the Open Discovery project. The intended audience is working data scientists, authors of statistical software, and other practitioners of data-driven science. To make sense of this guide, you should be familiar with at least one programming language. Any language will do.

### Overview

The Data Science Ontology is comprised of two kinds of entities: concepts and annotations.

1. **Concepts** are the abstract ideas of data science. For instance, the ontology has concepts of a [data table](/concept/table), of a [statistical model](/concept/model), and of [fitting a predictive model](/concept/fit-supervised). Concepts themselves come in two kinds: types and functions. This terminology roughly agrees with that of functional programming. Thus, a **type** concept is a kind or species of entity that exists in the data science domain. A **function** concept is a functional relation or map from an input type to an output type. The concepts of [data table](/concept/table) and [statistical model](/concept/model) are types, while the concept of [fitting a predictive model](/concept/fit-supervised) is a function that maps an (unfitted) model and predictor and response data to a (fitted) model.

2. As a modeling assumption, we suppose that the programs implemented by statistical software packages, such as [scikit-learn](http://scikit-learn.org/) or [glmnet](https://cran.r-project.org/web/packages/glmnet/), instantiate the universal concepts of the ontology. **Annotations** map the types and functions defined in software packages onto the types and functions of the ontology, respectively. For instance, the [pandas data frame](/annotation/python/pandas/data-frame) annotation maps the [DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html) class in pandas onto the [data table](/concept/table) concept. A unit of source code does not necessarily map onto a single concept. For example, the [fit sklearn clustering model](/annotation/python/sklearn/fit-predict-clustering) annotation maps the [fit_predict](http://scikit-learn.org/stable/modules/generated/sklearn.base.ClusterMixin.html#sklearn.base.ClusterMixin.fit_predict) method of clustering estimators in scikit-learn onto a composition of two concepts, [fitting a model](/concept/fit) and [getting clusters from a clustering model](/concept/clustering-model-clusters). More elaborate compositions are possible.

As the last example suggests, significant modeling flexibility is required to accurately translate the diverse APIs of statistical software into a single set of universal concepts. To meet this challenge, an annotation can map a single library function or method onto an arbitrary composition of concepts. Compositions are expressed in the ontology language **Monocl** (the MONoidal Ontology and Computing Language). We think of the ontology language as a minimalistic, typed, functional programming language. Being designed for knowledge representation, rather than practical computing, it is simpler than any real-world programming language but is still moderately expressive.

The next section develops the ontology language Monocl. Once that is understood, it is easy to understand the concepts and annotations in the Data Science Ontology.

## Ontology language

The concepts of the ontology constitute the **basic types** and **basic functions** of the ontology language. In analogy to the primitive types and functions of a real-world programming language, the basic types and functions are atomic—indecomposable into smaller parts. However, they can be combined to form more complex types and functions. The ontology language defines **constructors** for combining types and functions. In this section, we explain these constructors at an intuitive level. If you are so inclined, you may also read a [more formal account](/page/math) of the syntax and semantics of the ontology language.

Syntactic expressions for types and functions are displayed as expression trees. The terminal nodes are concepts and the non-terminal nodes are constructors. Besides the textual syntax, function expressions also admit a more intuitive graphical syntax. We will present both the textual and graphical syntaxes below.

### Types

Monocl's type system is about as minimalistic as they come. It has product types, a unit type, and a simple form of subtyping.

#### Constructors

The **product** of two types $X$ and $Y$ is another type $X \times Y$. The interpretation is that an element of type $X \times Y$ consists of an element of type $X$ *and* an element of type $Y$. Thus, if $x$ has type $X$ and $y$ has type $Y$, then the pair $\langle x, y \rangle$ has type $X \times Y$. Products of three or more types are defined similarly. Product types are often supported as tuples or record types in real-world programming languages, for example as `struct` types in C. As an expression tree, the product type $X \times Y$ appears as:

sexp: Product of types
:::
["otimes", "X", "Y"]
:::

The **unit type** $1$ is a type inhabited by a single element. It is analogous to the `void` type in C and Java, the `NoneType` type in Python (whose sole inhabitant is `None`), and the `NULL` type in R. By itself, the unit type is not of much use. However, once functions are in play, it becomes useful for defining functions with no inputs (i.e., constants) or no outputs. The unit type has the simple expression tree:

sexp: Unit type
:::
["munit"]
:::

Every type in a Monocl is either a basic type, the unit type, or a product of basic types. Therefore, you can think of a general type as a finite (possibly empty) list of basic types. The empty list corresponds to the unit type.

#### Subtypes

A basic type can be declared a **subtype** of one or more other basic types. To a first approximation, subtyping establishes an “is-a” relationship between types. For instance, the [matrix](/concept/matrix) concept is subtype of both [array](/concept/array) (being an array of rank 2) and [data table](/concept/table) (being a table whose columns all have the same data type).

As this example illustrates, subtyping in Monocl is *not* like inheritance in a typical object-oriented programming language. Inheritance is a design pattern that combines—arguably conflates—subtyping with a mechanism for implementation sharing (code reuse). Because Monocl concepts are not implemented at all, implementation sharing is irrelevant and the usual problems related to multiple inheritance do not arise.

Instead, subtyping should be understood in terms of *implicit conversion*, also known as *coercion*. The idea is that if a type $X_0$ is a subtype of $X$, then there is a canonical way of converting elements of type $X_0$ into elements of type $X$.  Elaborating the example above, a matrix simply *is* an array (of rank 2), hence can be trivially converted into an array. Meanwhile, a matrix can be converted into a data table (of homogeneous data type) by assigning numerical names to the columns, as accomplished by the function `as.data.frame` in R. Notice that the set of matrices is *not* a subset of the set of data tables, hence the slogan in programming language theory that [types are not sets](https://doi.org/10.1145/512927.512938).

Besides playing the role of the ubiquitous “is-a” relation in knowledge representation systems, subtyping enables a form of ad hoc polymorphism: a function taking input of type $X$ can, via implicit conversion, automatically take input of any subtype $X_0$ of $X$. What this means should become more clear when we discuss functions below.

### Functions

Every function has an input type (aka *domain*) and an output type (aka *codomain*). These types may be basic or compound. Thus a function may have zero, one, or many basic types as inputs, and likewise for outputs. In contrast to many programming languages, there is a perfect symmetry between inputs and outputs, even at the syntactic level.

A **program** in Monocl is a simply function built from the basic functions using a set of predefined constructors. There are several constructors for making new functions out of existing functions or types. The most important is composition. The language also has a notion of “generic function” that extends the idea of subtyping from types to functions.

You may be surprised to learn that both the textual and graphical syntaxes for functions are *point-free*: they do not identify variables (“points”). In fact, there are no variables at all in Monocl. In this respect, Monocl is similar to [concatenative programming languages](https://concatenative.org/) like Forth and dissimilar to most other programming languages. While it may seem counterintuitive at first, this convention greatly simplifies the algorithmic manipulation of programs by removing all issues related to free and bound variables, variable renaming, variable name clashes, etc. Note that the inputs and outputs of concepts and annotations are sometimes given human-readable names. These names are for documentation purposes only; they are ignored by the ontology language.

#### Constructors

#### Subfunctions
