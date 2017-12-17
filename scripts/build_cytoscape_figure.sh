#!/usr/bin/env bash
set -e

if [[ $# -eq 0 ]] ; then
  echo 'Missing argument: JSON file'; exit 1
fi

# XXX: Work around pretty-printed but invalid JSON output from fsh by
# extracting stringified JSON with regex.
out=$(fsh app invoke data-science-ontology/build_cytoscape_figure -P "$1")
if [[ "$out" =~ value:\ \"(.*)\" ]] ; then
  echo "${BASH_REMATCH[1]}" | jq '.' > "$1"
else
  echo 'Failed to parse output'; exit 1
fi
