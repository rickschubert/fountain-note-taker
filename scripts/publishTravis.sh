#!/bin/sh

set -e
# set +x

# setup_git() {
#     git config --global user.email "travis@travis-ci.org"
#     git config --global user.name "Travis CI"
#     git checkout master
# }

# upload_files() {
#     git remote add origin-master https://${GITHUB_TOKEN}@github.com:rickschubert/fountain-note-taker.git > /dev/null 2>&1
#     git push --set-upstream origin-master master
# }

echo "$SSH_KEY" >> ~/.ssh/id_rsa.pub
echo "$SSH_KEY_PRIVATE" >> ~/.ssh/id_rsa
git checkout master
npm run build
yarn vsce package
yarn vsce publish minor -p $VSCODEPUBLISHTOKEN
git push
# upload_files
