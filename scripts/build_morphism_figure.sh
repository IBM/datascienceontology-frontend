#!/usr/bin/env bash
set -e

if [[ $# -eq 0 ]] ; then
  echo 'Missing argument: JSON file'; exit 1
fi

result=$(kui wsk app invoke data-science-ontology/build_morphism_figure --param-file "$1")
echo "$result" | jq '.' > "$1"
