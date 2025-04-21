---
created_at: 2024-09-27 15:07:22
updated_at: 2025-04-22 05:55:49
---
# Quick Start for Datadocs Team

This guide is used for helping members to quickly modify/fix Apache arrow **TypeScript** module.

## Setup

``` bash
python3 -m venv .venv
. .venv/bin/activate
pip install -e "dev/archery[integration]"

cd js
yarn install

yarn run build

# speeding up build:
# 1. clone closure-compiler into the project to avoid download source files every time
#    the branch/tag name can be found in `package.json`.
#    E.g., "google-closure-compiler": "20240317.0.0",
git clone --depth=1 --branch v20240317 https://github.com/google/closure-compiler.git
# 2. build `apache-arrow` only: (~20s)
yarn run gulp build:apache-arrow

# test
yarn test

# this tools will generate many apache arrow data to check if typescript module
# can encode and decode them correctly:
# archery -> generate IPC binary data and json data
# -> call js/bin/integration.ts -> load these data and compare with each other
archery integration --run-ipc --with-js=1
# 
```

## Release Package

``` bash
vim datadocs.env
# Add GITHUB_TOKEN=....

cd js;
yarn run build;
../datadocs-release-pkg.sh
```
