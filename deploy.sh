#!/bin/bash

# Checkout gh-pages branch
git checkout gh-pages

git merge master

# Build the project
npm run build

mkdir docs
# Copy dist to docs
cp -r dist/* docs/

# Push changes
git add docs/
git commit -m "Update docs from dist"
git push origin gh-pages

git checkout -