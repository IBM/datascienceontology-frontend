---
title: Introduction to the Data Science Ontology
math: true
---

In this introductory guide, we explain the two basic entities comprising the Data Science Ontology, concepts and annotations. We also explain the ontology language by which concepts and annotations are specified, including both its textual syntax and graphical syntax. After completing this guide, you should be able to interpret the concept and annotation entries found on this website, as well as the semantic representations of data analyses produced by the Open Discovery project. The intended audience is working data scientists, authors of statistical software, and other practitioners of data-driven science. To make sense of this guide, you should be familiar with at least one programming language. Any language will do.

## Overview

The Data Science Ontology is comprised of two kinds of entities: concepts and annotations.

1. **Concepts** are the abstract ideas of data science. For instance, the ontology has concepts of a [data table](/concept/table), of a [statistical model](/concept/model), and of [fitting a predictive model](/concept/fit-supervised). Concepts themselves come in two kinds: types and functions. This terminology roughly agrees with that of functional programming. Thus, a **type** concept is a kind or species of entity that exists in the data science domain. A **function** concept is a functional relation or map from an input type to an output type. The concepts of [data table](/concept/table) and [statistical model](/concept/model) are types, while the concept of [fitting a predictive model](/concept/fit-supervised) is a function that maps an (unfitted) model and predictor and response data to a (fitted) model.

2. As a modeling assumption, we suppose that the programs implemented by statistical software packages, such as [scikit-learn](http://scikit-learn.org/) or [glmnet](https://cran.r-project.org/web/packages/glmnet/), instantiate the universal concepts of the ontology. **Annotations** map the types and functions defined in software packages onto the types and functions of the ontology, respectively. For instance, the [pandas data frame](/annotation/python/pandas/data-frame) annotation maps the [DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html) class in pandas onto the [data table](/concept/table) concept. A unit of source code does not necessarily map onto a single concept. For example, the [fit sklearn clustering model](/annotation/python/sklearn/fit-predict-clustering) annotation maps the [fit_predict](http://scikit-learn.org/stable/modules/generated/sklearn.base.ClusterMixin.html#sklearn.base.ClusterMixin.fit_predict) method of clustering estimators in scikit-learn onto a composition of two concepts, [fitting a model](/concept/fit) and [getting clusters from a clustering model](/concept/clustering-model-clusters). More elaborate compositions are possible.

As the last example suggests, significant modeling flexibility is required to accurately translate the diverse APIs of statistical software into a single set of universal concepts. To meet this challenge, an annotation can map a single library function or method onto an arbitrary composition of concepts. Compositions are expressed in the ontology language **Monocl** (the MONoidal Ontology and Computing Language). We think of the ontology language as a minimalistic, typed, functional programming language. Being designed for knowledge representation, rather than practical computing, it is simpler than any real-world programming language but is still moderately expressive.

The next section develops the ontology language Monocl. Once that is understood, it is easy to understand the concepts and annotations in the Data Science Ontology.

## Ontology language

The concepts of the ontology constitute the **basic types** and **basic functions** of the ontology language. In analogy to the primitive types and functions of a real-world programming language, the basic types and functions are atomic—indecomposable into smaller parts. However, they can be combined to form more complex types and functions. The ontology language defines a set of **constructors** for combining types and functions. In this section, we explain these constructors at an intuitive level. If you are so inclined, you may also read a [more formal account](/page/math) of the syntax and semantics of the ontology language.

Syntactic expressions for types and functions are displayed as expression trees. The terminal nodes are concepts and the non-terminal nodes are constructors. Besides the textual syntax, function expressions also admit a more intuitive graphical syntax. We will develop the textual and graphical syntaxes in parallel.

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

A **program** in Monocl is a function built from the basic functions using a set of predefined constructors. There are several constructors for making new functions out of existing functions or types. The most important are composition and products. The ontology language also has a notion of “generic function” that extends the idea of subtyping from types to functions.

Because a program is a simply a function, in the mathematical sense, you can think of Monocl as a [purely functional programming language](https://en.wikipedia.org/wiki/Purely_functional_programming). There are no mutations and no side effects. Some implications of this restriction are discussed later in this guide and in the [FAQ](/page/faq).

You may be surprised to learn that both the textual and graphical syntaxes for functions are “point-free”: they do not identify variables (“points”). In fact, there are no variables at all in Monocl. In this respect, Monocl is similar to [concatenative programming languages](https://concatenative.org/) like Forth and dissimilar to most other programming languages. While it may seem counterintuitive at first, this convention greatly simplifies the algorithmic manipulation of programs by removing all issues related to free and bound variables, variable renaming, etc. Note that the inputs and outputs of concepts and annotations are sometimes given human-readable names. These names are for documentation purposes only; they are ignored by the ontology language.

#### Graphical syntax

As an alternative to the textual syntax based on expression trees, programs in Monocl can be displayed in a graphical syntax. The textual and graphical syntaxes are equally expressive. The textual syntax is the “native” format of the ontology, being more convenient for computer entry, but most people find the graphical syntax more easily interpretable. The graphical syntax is derived from the [string diagrams](https://ncatlab.org/nlab/show/string+diagram) of monoidal category theory, but in this guide we assume no knowledge of that subject. We will refer to programs in the graphical syntax as “wiring diagrams.”

In a wiring diagram, functions are represented by **boxes** (aka nodes). A box has an **input port** for every input of the corresponding function and an **output port** for every output of the function. For example, a function $f$ with input type $X \times Y$ and output type $W \times Z$, declared by the expression tree

sexp: Function definition
:::
["Hom", "f", ["otimes", "X", "Y"], ["otimes", "W", "Z"]]
:::

is represented as the box:

**DIAGRAM**

As we have said, the unit type is useful for defining functions with no inputs or no outputs. For example, a function $c$ with input type $1$ and output type $X$, is declared by the expression tree

sexp: Constant definition
:::
["Hom", "c", ["munit"], "X"]
:::

and is represented as a box with no input ports:

**DIAGRAM**

We think of the function $c$ as a “constant” of type $X$.

A **wiring diagram** consists of a collection of boxes whose ports are connected by **wires** (aka edges or strings), plus an **outer box** that defines the inputs and outputs of the whole diagram. The configuration of the boxes and wires in the diagram determines the meaning of the program. Let us now see how this works.

#### Constructors

##### Composition

The most fundamental function constructor is **composition**: it composes two or more functions *in sequence*, so that the outputs of the first function become the inputs of the second function, the outputs of the second become the inputs of the third, and so on. The input type of the composition is the input type of the first function and the output type is the output type of the last function. In “point-full” mathematical notation, the composition of a function $f$ with another function $g$ is the function $x \mapsto g(f(x))$. That is, the function $f$ is applied, followed by $g$. The expression tree for this composition is

sexp: Composition of functions
:::
["compose", "f", "g"]
:::

In the graphical syntax, composition is represented by wires:

**DIAGRAM**

In order for a composition to be well-defined, the input and output types must be compatible. There must be the same number of output types of $f$ as input types of $g$ and, moreover, each output type of $f$ must be a subtype of the corresponding input type of $g$. The interpretation is that outputs of $f$ are *implicitly converted* to the input types of $g$ before being passed as inputs to $g$. Diagrammatically, this means that the source port type of any wire must be a subtype of the target port type of the wire.

##### Products

Another fundamental function constructor is the **product**: it composes two or more functions *in parallel*, concatenating both the inputs and the outputs. It extends the product constructor from types to function. Thus, if $f$ is a function with input type $X$ and output type $W$, and if $g$ is a function with input type $Y$ and output type $Z$, then product of $f$ and $g$ is a function $f \times g$ whose input type is $X \times Y$ and output type is $W \times Z$. In “point-full” mathematical notation, $f \times g$ is the function $\langle x,y \rangle \mapsto \langle f(x),g(y) \rangle$. Products of three or more functions are defined similarly.

*Warning*: Do not confuse the notation $f \times g$ with pointwise multiplication! For most types, the operation of multiplication does not even make sense.

The product $f \times g$ is represented textually by the expression tree

sexp: Product of functions
:::
["otimes", "f", "g"]
:::

and diagrammatically by juxtaposition:

**DIAGRAM**

Already with composition and products, we have enough structure to define some interesting programs. Suppose we have functions $f$, $g$, $h$, and $k$ such that it makes sense to compose $f$ with $g$ and compose $h$ with $k$ (the input and output types are compatible). There are two ways we can combine all four functions into a single program. We can take a product of compositions:

sexp: Product of compositions
:::
[
    "otimes",
    ["compose", "f", "g"],
    ["compose", "h", "k"]
]
:::

Or we can take a composition of products:

sexp: Composition of products
:::
[
    "compose",
    ["otimes", "f", "h"],
    ["otimes", "g", "k"]
]
:::

You should convince yourself that both expressions actually define the same function. In graphical syntax, that function is:

**DIAGRAM**

This situation illustrates an important point: the graphical syntax is “coarser” than the textual syntax. In general, there may be many different expression trees corresponding to a given wiring diagram. We consider this feature to be another advantage of the graphical syntax over the textual syntax. It is why most of our program analysis tools operate on wiring diagrams, not expressions. Now there may, in turn, be many different wiring diagrams corresponding to the same function. That should not be surprising. In any programming language (graphical or textual), there will be syntactically distinct programs that are semantically equivalent. To summarize: an expression trees uniquely determines a wiring diagram, and a wiring diagram uniquely determines a function, but not conversely.

##### Other constructors

TODO
- identity
- braid
- copy
- delete
- construct

#### Subfunctions

## Concepts

## Annotations
