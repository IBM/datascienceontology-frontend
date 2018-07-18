---
title: Contributing to the Data Science Ontology
math: true
---

From this short guide, you will learn how to contribute new concepts and annotations to the Data Science Ontology. We assume you already understand the basic ideas behind the ontology, as explained in the [introductory guide](/help/intro). Here we explain the contribution process and the data format for concepts and annotations.

## How to contribute

To submit a new concept or annotation, or improve an existing one, you should:

1. Write the concept or annotation, in the data format described below.
2. Run the validation script, to ensure it conforms to the schema.
3. Open a pull request on GitHub.

We will make every effort to give each pull request a fair and timely review. Please understand that the Data Science Ontology is a new project and we are still learning what processes will be most effective.

## Data format

Concepts and annotations are expressed in [YAML](http://yaml.org), a markup language designed to be easy to read and write by humans. To simplify machine processing, they are also converted automatically into [JSON](https://www.json.org). The documents can then be straightforwardly loaded into a database or processed by other tools, such as [Catlab](https://github.com/epatters/Catlab).

#### Concepts

YAML defines a simple syntax for expressing key-value pairs, reminiscent of the [OBO file format](https://owlcollab.github.io/oboformat/doc/GO.format.obo-1_4.html) popular among biomedical ontologists. For example, the concept [read a data table](/concept/read-table) is expressed in YAML as:

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

Annotations are expressed in YAML similarly, with a twist provided by the **definition** field. Recall that an annotation defines a chunk of code by an expression written in the ontology language and built out of the ontology's concepts. The expression trees depicted in the introductory guide are represented as [S-expressions](https://en.wikipedia.org/wiki/S-expression) in JSON or YAML. For instance, the product of function compositions

sexp: Product of compositions
:::
["otimes", ["compose", "f", "g"], ["compose", "h", "k"]]
:::

is represented as the S-expression

```
[ otimes,
  [ compose, f, g],
  [ compose, h, k] ]
```

(In another terminological difference, the data format uses the symbol `otimes` for products, a mnemonic for the monoidal product $\otimes$. It also uses `braid` for the swap functions.)

As a complete example, here is the YAML source for the annotation [read data frame from SQL table](/annotation/python/pandas/read-sql-table):

```yaml
schema: annotation
language: python
package: pandas
id: read-sql-table
name: read data frame from SQL table
description: read pandas data frame from table in SQL databsase
function: pandas.io.sql.read_sql_table
kind: morphism
definition: [
  compose,
  [ construct, [ pair, sql-table-database, sql-table-name ] ],
  read-table
]
domain:
  - slot: 1
    name: database
  - slot: 0
    name: table-name
    description: name of SQL table
codomain:
  - slot: __return__
```
