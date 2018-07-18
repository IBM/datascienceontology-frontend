---
title: Contributing to the Data Science Ontology
---

From this short guide, you will learn how to contribute new concepts and annotations to the Data Science Ontology. We assume you already understand the basic ideas behind the ontology, as explained in the [introductory guide](/help/intro). We explain here the internal data format for concepts and annotations and the contribution process.

## Data format

Concepts and annotations are expressed in [YAML](http://yaml.org), a markup language designed to be easy to read and write by humans. To simplify machine processing, they are also converted automatically into [JSON](https://www.json.org). The documents can then be straightforwardly loaded into a database or processed by other tools, such as [Catlab](https://github.com/epatters/Catlab).

#### Concepts

YAML defines a simple syntax for expressing key-value pairs, reminiscent of the [OBO file format](https://owlcollab.github.io/oboformat/doc/GO.format.obo-1_4.html) popular among biomedical ontologists. For example, the concept [reading a data table](/concept/read-table) is expressed in YAML as:

```yaml
schema: concept
id: read-table
name: read table
description: read tabular data from a data source
kind: morphism
is-a: read-data
domain:
  - object: tabular-data-source
codomain:
  - object: table
    name: data
```

The correspondence between the concept page and this file should be clear enough, apart from some differences in terminology. We use the terminology of programming, which should be familiar to you, when displaying concepts and annotations on this website. However, the data format uses the terminology of category theory. You may find the following dictionary helpful for translating back and forth.

| | Programming | Category theory |
|-|-------------|-----------------|
| | type        | object          |
| | function    | morphism        |
| | inputs      | domain          |
| | outputs     | codomain        |

#### Annotations

Annotations are expressed in YAML similarly, with a twist provided by the **definition** field. An annotation defines a chunk of code by an expression in the ontology language. We represent expression trees, as shown in the introductory guide, as [S-expressions](https://en.wikipedia.org/wiki/S-expression) in JSON or YAML. For instance, the product of function compositions

sexp: Product of compositions
:::
["otimes", ["compose", "f", "g"], ["compose", "h", "k"]]
:::

is represented as the S-expression

```yaml
[ otimes,
  [ compose, f, g],
  [ compose, h, k] ]
```

## Making contributions