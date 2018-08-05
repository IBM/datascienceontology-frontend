---
title: Introduction to the Data Science Ontology
math: true
---

In this introductory guide, we explain the two basic entities comprising the Data Science Ontology, concepts and annotations. We also explain the ontology language by which concepts and annotations are specified, including both its textual syntax and graphical syntax. After reading this guide, you should be able to interpret the concept and annotation entries found on this website, as well as the semantic representations of data analyses produced by the Open Discovery project. The intended audience is working data scientists, authors of statistical software, and other practitioners of data-driven science. To make sense of this guide, you should be familiar with at least one programming language. Any language will do.

## Overview

The Data Science Ontology is comprised of two kinds of entities: concepts and annotations.

1. **Concepts** formalize the abstract ideas of data science. For instance, the ontology has concepts of a [data table](/concept/table), of a [statistical model](/concept/model), and of [fitting a predictive model](/concept/fit-supervised). Concepts themselves come in two kinds: types and functions. This terminology roughly agrees with that of functional programming. Thus, a **type** concept is a kind or species of entity that exists in the data science domain. A **function** concept is a functional relation or map from an input type to an output type. The concepts of [data table](/concept/table) and [statistical model](/concept/model) are types, while the concept of [fitting a predictive model](/concept/fit-supervised) is a function that maps an (unfitted) model and predictor and response data to a (fitted) model.

2. As a modeling assumption, we suppose that the programs implemented by statistical software packages, such as [scikit-learn](http://scikit-learn.org/) or [glmnet](https://cran.r-project.org/web/packages/glmnet/), instantiate the universal concepts of the ontology. **Annotations** map the types and functions defined in software packages onto the types and functions of the ontology, respectively. For instance, the [pandas data frame](/annotation/python/pandas/data-frame) annotation maps the [DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html) class in pandas onto the [data table](/concept/table) concept. A unit of source code does not necessarily map onto a single concept. For example, the [fit sklearn clustering model](/annotation/python/sklearn/fit-predict-clustering) annotation maps the [fit_predict](http://scikit-learn.org/stable/modules/generated/sklearn.base.ClusterMixin.html#sklearn.base.ClusterMixin.fit_predict) method of clustering estimators in scikit-learn onto a composition of two concepts, [fitting a model](/concept/fit) and [getting clusters from a clustering model](/concept/clustering-model-clusters). More elaborate compositions are possible.

In summary, the entities comprising the ontology are classified by the two-by-two table:

|                                | !glyph_schema(concept) Concept | !glyph_schema(annotation) Annotation |
|--------------------------------|--------------------------------|--------------------------------------|
| !glyph_kind(object) Type       | Type concept                   | Type annotation                      |
| !glyph_kind(morphism) Function | Function concept               | Function annotation                  |

We explicate all four notions at length in this guide. The pictograms in the table are used throughout the Data Science Ontology website as a visual shorthand.

Significant modeling flexibility is required to accurately translate the diverse APIs of statistical software into a single set of universal concepts. To meet this challenge, an annotation can map a single library function or method onto an arbitrary composition of concepts. Compositions are expressed in **Monocl** (the MONoidal Ontology and Computing Language), a new ontology language created specifically for this project. We think of the ontology language as a minimalistic, typed, functional programming language. Being designed for knowledge representation, rather than practical computing, it is simpler than any real-world programming language but is still moderately expressive.

The next section develops the ontology language Monocl. Once that is understood, it is easy to understand the concepts and annotations in the Data Science Ontology.

## Ontology language

The concepts of the ontology constitute the **basic types** and **basic functions** of the ontology language. In analogy to the primitive types and functions of a real-world programming language, the basic types and functions are atomic—indecomposable into smaller parts. However, they can be combined to form more complex types and functions. The ontology language defines a set of **constructors** for combining types and functions. In this section, we explain these constructors at an intuitive level. If you are so inclined, you may also read a [more formal account](/help/math) of the syntax and semantics of the ontology language.

Syntactic expressions for types and functions are displayed as expression trees. The terminal nodes are concepts and the non-terminal nodes are constructors. Besides the textual syntax, function expressions also admit a more intuitive graphical syntax. We will develop the textual and graphical syntaxes in parallel.

### Types

Monocl's type system is about as minimalistic as they come. It has product types, a unit type, and a simple form of subtyping.

#### Type constructors

The **product** of two types $X$ and $Y$ is another type $X \times Y$. The interpretation is that an element of type $X \times Y$ consists of an element of type $X$ *and* an element of type $Y$. Thus, if $x$ has type $X$ and $y$ has type $Y$, then the pair $\langle x, y \rangle$ has type $X \times Y$. Products of three or more types are defined similarly. Product types are often supported as tuples or record types in real-world programming languages, for example as `struct` types in C. As an expression tree, the product type $X \times Y$ appears as:

sexp: Product of types
:::
["otimes", "X", "Y"]
:::

The **unit type** $1$ is a type inhabited by a single element. It is analogous to the `void` type in C and Java, the `NoneType` type in Python (whose sole inhabitant is `None`), and the `NULL` type in R. By itself, the unit type is not of much use. However, once functions are in play, it becomes useful for defining functions with no inputs (i.e. constants) or no outputs. The unit type has the simple expression tree:

sexp: Unit type
:::
["munit"]
:::

Every type in a Monocl is either a basic type, the unit type, or a product of basic types. Therefore, you can think of a general type as a finite (possibly empty) list of basic types. The empty list corresponds to the unit type.

#### Subtypes

A basic type can be declared a **subtype** of one or more other basic types. To a first approximation, subtyping establishes an “is-a” relationship between types. For instance, the [matrix](/concept/matrix) concept is a subtype of both [array](/concept/array) (being an array of rank 2) and [data table](/concept/table) (being a table whose columns all have the same data type).

As this example illustrates, subtyping in Monocl is *not* like inheritance in a typical object-oriented programming language. Inheritance is a design pattern that combines—arguably conflates—subtyping with a mechanism for implementation sharing (code reuse). Because Monocl concepts are not implemented at all, implementation sharing is irrelevant and the usual problems related to multiple inheritance do not arise.

Instead, subtyping should be understood in terms of *implicit conversion*, also known as *coercion*. The idea is that if a type $X$ is a subtype of $X'$, then there is a canonical way to convert elements of type $X$ into elements of type $X'$.  Elaborating the example above, a matrix simply *is* an array (of rank 2), hence can be trivially converted into an array. Meanwhile, a matrix can be converted into a data table (of homogeneous data type) by assigning numerical names to the columns, as accomplished by the function `as.data.frame` in R. Notice that the set of matrices is *not* a subset of the set of data tables, hence the slogan in programming language theory that [types are not sets](https://doi.org/10.1145/512927.512938).

Besides playing the role of the ubiquitous “is-a” relation in knowledge representation systems, subtyping enables a form of [ad hoc polymorphism](https://en.wikipedia.org/wiki/Ad_hoc_polymorphism): a function taking input of type $X'$ can, via implicit conversion, automatically take input of any subtype $X$ of $X'$. What this means should become more clear when we discuss functions below.

### Functions

Every function has an input type (aka *domain*) and an output type (aka *codomain*). These types may be basic or compound. Thus a function may have zero, one, or many basic types as inputs, and likewise for outputs. In contrast to many programming languages, there is a perfect symmetry between inputs and outputs, even at the syntactic level.

A **program** in Monocl is a function built from the basic functions using a set of predefined constructors. There are several constructors for making new functions out of existing functions or types. The most important are composition and products. The ontology language also has a notion of “generic function” that extends the idea of subtyping from types to functions.

Because a program is a simply a function, in the mathematical sense, you can think of Monocl as a [purely functional programming language](https://en.wikipedia.org/wiki/Purely_functional_programming). There are no mutations and no side effects. Some implications of this restriction are discussed later in this guide and in the [FAQ](/help/faq).

#### Graphical syntax

As an alternative to the textual syntax based on expression trees, programs in Monocl can be displayed in a graphical syntax. The textual and graphical syntaxes are equally expressive. The textual syntax is the “native” format of the ontology, being more convenient for computer entry, but most people find the graphical syntax more easily interpretable. The graphical syntax is derived from the [string diagrams](https://ncatlab.org/nlab/show/string+diagram) of monoidal category theory, but in this guide we assume no knowledge of that subject. We will refer to programs in the graphical syntax as “wiring diagrams.”

In a wiring diagram, functions are represented by **boxes** (aka nodes). A box has an **input port** for every input of the corresponding function and an **output port** for every output of the function. For example, a function $f$ with input type $X \times Y$ and output type $W \times Z$, declared by the expression tree

sexp: Function definition
:::
["Hom", "f", ["otimes", "X", "Y"], ["otimes", "W", "Z"]]
:::

is represented as the box:

!cytoscape[Function definition](intro/function.json)

As we have said, the unit type is useful for defining functions with no inputs or no outputs. For example, a function $c$ with input type $1$ and output type $X$, is declared by the expression tree

sexp: Constant definition
:::
["Hom", "c", ["munit"], "X"]
:::

and is represented as a box with no input ports:

!cytoscape[Constant definition](intro/constant.json)

We think of the function $c$ as a “constant” of type $X$.

A **wiring diagram** consists of a collection of boxes whose ports are connected by **wires** (aka edges or strings), plus an **outer box** that defines the inputs and outputs of the whole diagram. The configuration of the boxes and wires in the diagram determines the meaning of the program. Let us now see how this works.

#### Function constructors

##### Composition

The most fundamental function constructor is **composition**: it composes two or more functions *in sequence*, so that the outputs of the first function become the inputs of the second function, the outputs of the second become the inputs of the third, and so on. The input type of the composition is the input type of the first function and the output type is the output type of the last function. In “point-full” mathematical notation, the composition of a function $f$ with another function $g$ is the function $x \mapsto g(f(x))$. That is, the function $f$ is applied, followed by $g$. The expression tree for this composition is

sexp: Composition of functions
:::
["compose", "f", "g"]
:::

In the graphical syntax, composition is represented by wires:

!cytoscape[Composition of functions](intro/compose.json)

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

!cytoscape[Product of functions](intro/product.json)

Already with composition and products, we have enough structure to define some interesting programs. Suppose we have functions $f$, $g$, $h$, and $k$ such that it makes sense to compose $f$ with $g$ and compose $h$ with $k$ (the input and output types are compatible). There are two ways we can combine all four functions into a single program. We can take a product of compositions:

sexp: Product of compositions
:::
["otimes", ["compose", "f", "g"], ["compose", "h", "k"]]
:::

Or we can take a composition of products:

sexp: Composition of products
:::
["compose", ["otimes", "f", "h"], ["otimes", "g", "k"]]
:::

You should convince yourself that both expressions actually define the same function. In graphical syntax, that function is:

!cytoscape[Product of compositions](intro/compose-products.json)

This situation illustrates an important point: the graphical syntax is “coarser” than the textual syntax. In general, there may be many different expression trees corresponding to a given wiring diagram. We consider this feature to be another advantage of the graphical syntax over the textual syntax. It is why most of our program analysis tools operate on wiring diagrams, not expressions. There may, in turn, be many different wiring diagrams corresponding to the same function. That should not be surprising. In any programming language (graphical or textual), there will be syntactically distinct programs that are semantically equivalent. To summarize: an expression uniquely determines a wiring diagram, and a wiring diagram uniquely determines a function, but not conversely.

##### Other function constructors

There are numerous other function constructors besides composition and products. They are less conceptually significant but are practically important. We'll describe them briefly in this section. On a first reading, you may wish to skip this section, referring to it later as needed. Much of the graphical syntax should be fairly obvious.

For each type $X$, there is an **identity** function $1_{X}$ that maps every element of type $X$ to itself. It is represented by the expression

sexp: Identity function
:::
["id", "X"]
:::

and diagrammatically as nothing but a wire:

!cytoscape[Identity function](intro/identity.json)

It is often useful to reorder the component types of a product type. This is accomplished by the swap functions (also known as braidings). For each pair of types $X$ and $Y$, there is a **swap** function $\sigma_{X,Y}$ from $X \times Y$ to $Y \times X$ that exchanges the two input elements. In point-full notation, it is the function $\langle x,y \rangle \mapsto \langle y,x \rangle$. It is represented by

sexp: Braid
:::
["braid", "X", "Y"]
:::

in the textual syntax and by crossed wires in the graphical syntax:

!cytoscape[Braid](intro/braid.json)

By composing swap functions, it is possible to define arbitrary permutations on products of three or more types. Diagrammatically this means that arbitrary crossings of wires are allowed.

There are constructors for copying and deleting data. For each type $X$, there is a **copy** function from $X$ to $X \times X$, defined by $x \mapsto \langle x,x \rangle$, and a **delete** function from $X$ to $1$, defined by $x \mapsto *$. The delete function effectively “discards” data by mapping it to the unit type. These functions are represented by the expressions

sexp: Copy
:::
["mcopy", "X"]
:::

and

sexp: Delete
:::
["delete", "X"]
:::

respectively. Arbitrarily many copies can be made by repeatedly applying the copy function. As a convenience, the $n$-fold copy function can be expressed directly as

sexp: n-fold copy
:::
["mcopy", "X", "n"]
:::

In the graphical syntax, a copy is implicitly represented by an output port with multiple outgoing wires and a deletion is implicitly represented by an output port with no outgoing wires. Thus any output port is allow to have zero, one, or many outgoing wires. The same is *not* true of input ports: in a valid wiring diagram, every input port has exactly one incoming wire. This restriction holds because there is no natural way to **merge** multiple elements or **create** new elements of an arbitrary data type.

There is, however, a family of functions to **construct** elements of a given data type satisfying certain properties. In the simplest case, the construct function take no inputs and creates an element of type $X$ that does not necessarily satisfy any properties:

sexp: Construct by type
:::
["construct", "X"]
:::

Diagrammatically, it is a box labeled by the type name:

!cytoscape[Construct by type](/intro/construct-type.json)

Now suppose $f$ is a function from $X$ to $Y$, which we think of as a “property” of $X$, named $f$ and of data type $Y$. There is a construct function from $Y$ to $X$ that creates elements of type $X$ with property $f$:

sexp: Construct by function
:::
["construct", "f"]
:::

Or, diagrammatically:

!cytoscape[Construct by function](/intro/construct-function.json)

(The name $f$ is omitted in the graphical syntax, a defect we hope to rectify in the future.) To be more precise, the defining property of this construct function is that its composition with $f$ is $1_Y$, the identity function on $Y$.

Finally, although implicit conversions (aka coercions) are usually implicit—hence the name—it is occasionally useful to explicitly reference the coercion functions. That's what the **coerce** constructor does. If $X$ is a subtype of $Y$, then the coercion function from $X$ to $Y$ is represented by the expression:

sexp: coercion
:::
["coerce", ["SubOb", "X", "Y"]]
:::

#### Subfunctions

A basic function can be declared a **subfunction** of one or more other basic functions. Subfunctions extend the idea of subtyping from types to functions: they establish “is-a” relations between functions, loosely speaking. In programming jargon, subfunctions enable an “ad hoc” form of [generic functions](https://en.wikipedia.org/wiki/Generic_function).

As an example, the concept of [reading a tabular file](/concept/read-tabular-file) is a subfunction of [reading data](/concept/read-data) from a generic data source. That seems intuitively plausible but what does it really mean? Consider two possible computational paths. Given a [tabular file](/concept/tabular-file) (a file containing tabular data), we could [read the tabular file](/concept/read-tabular-file), then coerce the resulting [table](/concept/table) to generic [data](/concept/data). Alternatively, we could coerce the [tabular file](/concept/tabular-file) to a generic [data source](/concept/data-source), then [read data](/concept/read-data) from it. Both paths take a [tabular file](/concept/tabular-file) as input and return [data](/concept/data) as output. We expect them to be equivalent and that's exactly what the subfunction relation guarantees.

The general definition is perfectly analogous. Suppose $X$ is a subtype of $X'$, $Y$ is a subtype of $Y'$, and $f$ and $f'$ are functions with input types $X$ and $X'$ and output types $Y$ and $Y'$, respectively. Then $f$ is a subfunction of $f'$ if the [naturality](https://ncatlab.org/nlab/show/natural+transformation) condition is satisfied: the two functions from $X$ to $Y'$ defined by

1. applying $f$, then coercing the output from type $Y$ to $Y'$
2. coercing the input from type $X$ to $X'$, then applying $f'$

are the same.

## Concepts

The concepts of the Data Science Ontology constitute the basic types and functions of the data science domain. Annotations express the classes and functions of data science libraries in terms of the concepts, using the ontology language. In this and the next section, we describe the format of the concept and annotation entries appearing on this website.

Every concept is uniquely identified among all concepts in the ontology by an **ID** field. The **kind** field marks the concept as a type or a function. Most concepts also have a **name** and a **description**. These fields document the concept for human readers but have no formal meaning. The other fields are determined by whether the concept is a type or a function.

### Type concepts

Type concepts in the Data Science Ontology include [SQL queries](/concept/sql-query), [data tables](/concept/table), [clustering models](/concept/clustering-model), and [linear regression models](/concept/linear-regression).

The **is** field lists the types of which the concept is a direct subtype. We say “direct” because the relation of being a subtype is *transitive*: if $X$ is a subtype of $X'$ and $X'$ is a subtype of $X''$, then $X$ is a subtype of $X''$. (Why? Because if $X$ is implicitly convertible to $X'$ and $X'$ is implicitly convertible to $X''$, then $X$ is implicitly convertible to $X''$ by composing the two implicit conversion functions.) The subtype relation is also *reflexive*: every type is a subtype of itself. (Why? Because every type is implictly convertible to itself by applying the identity function.) The **is** field lists only the direct supertypes of the concept, not those implied by reflexivity or transitivity.

### Function concepts

Function concepts in the ontology include [reading a data table](/concept/read-table), [fitting a predictive model](/concept/fit-supervised), and [getting clusters from a clustering model](/concept/clustering-model-clusters). Generally speaking, function concepts can be grouped into three categories:

1. The most obvious are functions that tangibly “do something”: read data from a data source, fit a statistical model, make predictions, etc. These often correspond to the public functions and methods in data science libraries.

2. Other functions access the “properties” or “slots” of an object. Typically the input type is a complex object and the output type is an [array](/concept/array) or [scalar](/concept/scalar) type, such as a [number](/concept/number) or [string](/concept/string). Examples of such functions are the shape of an array, the clusters of a clustering model, and the coefficients of a linear model. These often correspond to the attributes and accessor methods of classes in data science libraries.

3. Finally, some functions in the ontology exist purely for knowledge representation purposes and are unlikely to be reified in source code. An example is the class of the [kernelized](/concept/kernelized) functions, such as [kernelized PCA](/concept/pca-kernelized), mapping models to their kernelizations (where Euclidean inner products are replaced by arbitrary kernels, via the so-called [“kernel trick”](https://en.wikipedia.org/wiki/Kernel_method)). Kernelization defines a valid functional relation but most machine learning libraries do not make this relation explicit.

The taxonomy of functions is informal. Function concepts in the ontology are *not* marked as belonging to one of these categories; in some cases, there is no single category that obviously applies.

Entries for function concepts have several additional fields. The **input** and **ouput** fields state the input and output types of the functions, presented as a finite list of basic types. The **is** field lists the functions of which the concept is a direct subfunction. We say “direct” subfunction for the same reason we said “direct” subtype above.

## Annotations

Annotations map the concrete types and functions of data science libraries onto the abstract types and functions of the ontology. Annotation entries are more complicated than concept entries because real-world data science libraries are inherently diverse and complex. We expect that the annotation system will evolve over time to achieve greater accuracy and fidelity in the face of this complexity.

The format and interpretation of an annotation varies slightly depending on the language features supported by the target programming language. In this introductory guide, we will occasionally point out such differences, but we will not dwell on the implementation details for any particular programming language. The phrase “concrete type” refers to anything that can be construed as a type in the target language, such as primitive or builtin types, as well as classes in object-oriented languages. Likewise, the phrase “concrete function” encompasses not just functions and methods in the target language but also operations that are not always regarded as functions, such as unary operators, binary operators, attribute retrieval, and attribute assignment.

Every annotation is uniquely identified by three fields: its **language**, a programming language like Python or R; its **package**, a library or package written in the given language; and its **ID**, an identifier unique among all annotations for the given language and package. The **kind** field marks the annotation as a type or function. The optional **name** and **description** provide human-readable documentation, just as with concepts.

### Type annotations

Some examples of type annotations are the [numpy array](/annotation/python/numpy/ndarray), the [pandas data frame](/annotation/python/pandas/data-frame), the [k-means clustering model in scikit-learn](/annotation/python/sklearn/k-means), and the [linear regression model in statsmodels](/annotation/python/statsmodels/linear-regression).

The **definition** of a type annotation is the abstract type to which the concrete type is mapped. For now we require the definition to be a basic type of the ontology, although we may relax that restriction in the future. As an example, the [pandas data frame](/annotation/python/pandas/data-frame) annotation maps the pandas `DataFrame` class to the [data table](/concept/table) concept.

A type annotation applies to the concrete type given by its **class** field. The assignment of annotations to concrete types respects class inheritance. When multiple annotations match, the annotation with the most specific class is assigned. The “most specific class” is unambiguous in languages with single inheritance, such as R. When multiple inheritance is allowed, ambiguities are settled in a language-specific manner, e.g. by the [method resolution order (MRO)](https://www.python.org/download/releases/2.3/mro/) in Python. Under multiple inheritance, the **class** field may also list multiple classes. In this case the annotation matches any class inheriting from *all* the listed classes. Here's an example. The annotation for [clusterers in scikit-learn](/annotation/python/sklearn/base-clusterer) matches all classes that inherit from both `BaseEstimator` and `ClusterMixin`, which is how clustering models are represented in scikit-learn. However, for the `KMeans` class, which inherits from both `BaseEstimator` and `ClusterMixin`, the more specific [k-means clustering](/annotation/python/sklearn/k-means) annotation takes precedence over the [clusterers](/annotation/python/sklearn/base-clusterer) annotation.

The properties of a concrete type are annotated by the **slots** field. Slots are essentially a shorthand for function annotations. A slot annotation maps a slot on the concrete type to an abstract function whose input type is the **definition** type (or a supertype thereof). For example, the annotation of [k-means clustering in scikit-learn](/annotation/python/sklearn/k-means) has slots for the number of clusters, the cluster assignments, and the centroids of the clusters. As usual, what constitutes a “slot” depends on the target language. Object attributes, methods with no arguments, and compositions thereof are all slots.

### Function annotations

The **definition** of a function annotation is the abstract function to which the concrete function is mapped. It can be any program written in the ontology language. The definition is displayed in both the textual and graphical syntax on the annotation page.

There are several different ways to attach a function annotation to a concrete function. The **function** field identifies a standalone function. Alternatively, a method of an object is identified by its name, via the **method** field, and the object's class, via the **class** field. Classes are specified exactly as in type annotations.

#### Inputs and outputs

Function annotations, unlike type annotations, most also account for inputs and outputs. The **input** and **output** fields map the inputs and outputs of the concrete function onto the inputs and outputs of the abstract function, respectively. Both fields are ordered lists. Every concrete input in the **input** list is mapped to the corresponding input of the abstract function (viewing its input type as a finite list of basic types). The **output** list works similarly. As a first example, in the [read data frame from SQL table](/annotation/python/pandas/read-sql-table) annotation, the second argument of the pandas `read_sql_table` function is mapped to the first abstract input and the first argument is mapped to the second input. (Note the zero-based indexing in Python.)

Importantly, in order to have a valid function annotation, there should also be type annotations mapping the concrete types of the inputs and outputs to the corresponding abstract types. This condition ensures that type and function annotations are logically compatible. Continuing the previous example, there are type annotations mapping the SQLAlchemy “connectables,” namely [connections](/annotation/python/sqlalchemy/connection) and [engines](/annotation/python/sqlalchemy/engine), to the [SQL database](/concept/sql-database) concept. In mathematical jargon, we say that annotations are [functorial](https://en.wikipedia.org/wiki/Functor), an idea pursued further in the [advanced guide](/help/math).

Let us expand on how concrete inputs and outputs are specified. A concrete input is a just function argument, identified by position (a number) or name (a string). Not every argument must be annotated. Unannotated arguments are simply ignored for the purposes of knowledge representation. Omitting arguments is a practical necessity for functions with dozens of inessential keyword arguments, a popular design pattern in data science libraries. A prime example is the [read_csv](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.read_csv.html) function in pandas.

A concrete output is either the function's return value, identified by the special name `__return__`, or a function argument, identified as above. Marking a function argument as an output means that the argument is passed by reference and mutated within the function. Because the ontology language is purely functional, mutated arguments are represented as extra outputs. For example, when [fitting a regression model in scikit-learn](/annotation/python/sklearn/fit-regression), the `self` argument is both an input and an output. The method is reinterpreted as taking an unfitted regression model as input and yielding a fitted regression model as output.

## What's next? 

You should now have a working knowledge of the Data Science Ontology, sufficient to read and understand the content of this website. If you'd like to contribute to the ontology, you should also read the short [contribution guide](/help/contribute). The [advanced guide](/help/math) presents the ontology language with greater mathematical rigor and references to the research literature.

Finally, a few words about what's next for the Data Science Ontology itself. You may have noticed that the ontology language is not expressive enough to capture some very fundamental programming idioms, such as looping. In the future we will likely extend the ontology language and program analysis tools to support **function types** (enabling higher-order functions), **lambda abstraction** (defining new functions), and **recursion** (looping). Nonetheless we believe that the Data Science Ontology should already be useful for many purposes in its present, nascent state.
