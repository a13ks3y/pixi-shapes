#!/bin/bash

# Checkout gh-pages branch
git checkout gh-pages

# Build the project
npm run build

# Copy dist to docs
cp -r dist/* docs/

# Push changes
git add docs/
git commit -a -m "Update docs from dist"
git push origin gh-pages

git checkout -