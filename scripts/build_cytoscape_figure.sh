#!/usr/bin/env bash
set -e

if [[ $# -eq 0 ]] ; then
  echo 'Missing argument: JSON file'; exit 1
fi

result=$(fsh app invoke --raw-output data-science-ontology/build_cytoscape_figure -P "$1")
echo "$result" | jq '.' > "$1"
