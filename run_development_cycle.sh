#!/bin/bash

# Copyright 2018 Vincent Jacques <vincent@vincent-jacques.net>

# GENI: prologue(quickness=False, show_in_browser=False)
# GENERATED SECTION, MANUAL EDITS WILL BE LOST
set -o errexit

PROJECT_ROOT=$(pwd)

SHOW_IN_BROWSER=false
function show_in_browser {
  echo
  echo "$1: $PROJECT_ROOT/$2"
  echo
  if $SHOW_IN_BROWSER
  then
    python -m webbrowser -t file://$PROJECT_ROOT/$2
  fi
}

while [[ "$#" > 0 ]]
do
  case $1 in
    -wb|--web-browser)
      SHOW_IN_BROWSER=true
      ;;
    *)
      echo "Unknown parameter passed: $1"
      exit 1;;
  esac
  shift
done
# END OF GENERATED SECTION

# GENI: install_dependencies
# GENERATED SECTION, MANUAL EDITS WILL BE LOST
# END OF GENERATED SECTION


# GENI: run_tests()
# GENERATED SECTION, MANUAL EDITS WILL BE LOST
jekyll serve --livereload
# END OF GENERATED SECTION

# GENI: check_code
# GENERATED SECTION, MANUAL EDITS WILL BE LOST
# END OF GENERATED SECTION


# GENI: documentation
# GENERATED SECTION, MANUAL EDITS WILL BE LOST
# END OF GENERATED SECTION


# GENI: install
# GENERATED SECTION, MANUAL EDITS WILL BE LOST
# END OF GENERATED SECTION


# GENI: epilogue()
# GENERATED SECTION, MANUAL EDITS WILL BE LOST
echo
echo "Development cycle OK"
# END OF GENERATED SECTION
