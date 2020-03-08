#!/bin/sh
# Credit: https://gist.github.com/willprice/e07efd73fb7f13f917ea

set -e

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

upload_files() {
  # Remove existing "origin"
  git remote rm origin
  # Add new "origin" with access token in the git URL for authentication
  git remote add origin https://rickschubert:${GITHUB_TOKEN}@https://github.com/rickschubert/fountain-note-taker.git > /dev/null 2>&1
  git push origin master --quiet
}

setup_git
upload_files
