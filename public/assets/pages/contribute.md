---
title: Contributing to the Data Science Ontology
---

From this short guide, you will learn how to contribute new concepts and annotations to the Data Science Ontology. We assume you already understand the basic ideas behind the ontology, as explained in the [introductory guide](/help/intro). Here we explain the contribution process and the data format for concepts and annotations.

## How to contribute

The Data Science Ontology source is hosted on [GitHub](https://github.com/ibm/datascienceontology). To submit a new concept or annotation, or improve an existing one, you should:

1. Write the concept or annotation, in the data format described below.
2. Run the validation script, to ensure it conforms to the schema.
3. Open a [pull request](https://github.com/ibm/datascienceontology/pulls) on GitHub.

We welcome contributions of all kinds and we will make every effort to give each pull request a fair and timely review.

## Data format

Concepts and annotations are expressed in [YAML](http://yaml.org), a markup language designed to be easy to read and write by humans. To simplify machine processing, they are also converted automatically into [JSON](https://www.json.org). The documents can then be straightforwardly loaded into a database or processed by other tools, such as [Catlab](https://github.com/epatters/Catlab).

#### Concepts

YAML defines a simple syntax for expressing key-value pairs, reminiscent of the [OBO file format](https://owlcollab.github.io/oboformat/doc/GO.format.obo-1_4.html) popular among biomedical ontologists. For example, the concept [read a data table](/concept/read-table) is expressed in YAML as:

```yaml
schema: concept
id: read-table
name: read table
description: read tabular data from a data source
kind: function
is-a: read-data
inputs:
  - type: tabular-data-source
outputs:
  - type: table
    name: data
```

The correspondence between the [web page](/concept/read-table) and the YAML content should be clear enough.

#### Annotations

Annotations are also expressed in YAML, with a twist provided by the **definition** field. Recall that an annotation defines a chunk of code by an expression written in the ontology language and built out of the ontology's concepts. The expression trees depicted in the introductory guide are represented as [S-expressions](https://en.wikipedia.org/wiki/S-expression) in JSON or YAML. For instance, the product of function compositions

sexp: Product of compositions
:::
["product", ["compose", "f", "g"], ["compose", "h", "k"]]
:::

is represented as the S-expression

```
[ product,
  [ compose, f, g],
  [ compose, h, k] ]
```

As a complete example, here is the YAML source for the annotation [read data frame from SQL table](/annotation/python/pandas/read-sql-table):

```yaml
schema: annotation
language: python
package: pandas
id: read-sql-table
name: read data frame from SQL table
description: read pandas data frame from table in SQL databsase
function: pandas.io.sql.read_sql_table
kind: function
definition:
  [compose, [construct, [pair, sql-table-database, sql-table-name]], read-table]
inputs:
  - slot: 1
    name: database
  - slot: 0
    name: table-name
    description: name of SQL table
outputs:
  - slot: __return__
```

#### Other resources

We hope this brief introduction to the data format is helpful, but it's not an exhaustive reference. The definitive definitions of the data format are the [JSON schemas](http://json-schema.org) for [concepts](https://github.com/ibm/datascienceontology/blob/master/tools/schemas/concept.json) and [annotations](https://github.com/ibm/datascienceontology/blob/master/tools/schemas/annotation.json). Perhaps the easiest way to get started is to look at existing examples of concepts and annotations and adapt them to your purposes. If you get stuck, feel free to ask us questions by opening a [GitHub issue](https://github.com/ibm/datascienceontology/issues).
