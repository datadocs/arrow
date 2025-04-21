#!/usr/bin/env bash
# shellcheck disable=SC2016

PKG_DIR='js/targets/apache-arrow';
PKG_TGZ="./datadocs-apache-arrow.tgz";

PKG_NAME='@datadocs/apache-arrow';
PKG_MANAGER="yarn@4.9.1";

YARNRC_YML='httpProxy: "${http_proxy-}"
httpsProxy: "${https_proxy-}"
nodeLinker: node-modules
npmScopes: { datadocs: { npmAlwaysAuth: true, npmAuthToken: "${GITHUB_TOKEN}", npmPublishRegistry: "https://npm.pkg.github.com" } }
injectEnvironmentFiles: ["../../../datadocs.env?"]';


throw() { printf "${RED}fatal: %s${RESET}\n" "$1" >&2; exit 1; }
print_cmd() { printf "${CYAN}\$ %s${RESET}\n" "$*"; }
execute() { print_cmd "$@"; "$@" || throw "Failed to execute '$1'"; }
execute_silent() { print_cmd "$@"; "$@" >/dev/null || throw "Failed to execute '$1'"; }
get_stdout() { print_cmd "$@"; get_stdout_result="$("$@")"; }
RED="\x1b[31m"; CYAN="\x1b[36m"; RESET="\x1b[0m";

pushd "$( dirname -- "${BASH_SOURCE[0]}" )" >/dev/null || exit 1;
PKG_TGZ="$(pwd)/${PKG_TGZ}";

execute_silent pushd "$PKG_DIR";

jq_args=( --arg pkg_name "${PKG_NAME}" --arg pkg_manager "${PKG_MANAGER}" );
jq_args+=( '.name = $pkg_name | .packageManager = $pkg_manager | .version |= gsub("-\\w+$"; "")' );
get_stdout jq "${jq_args[@]}" package.json;
# echo "<${get_stdout_result}>"; exit 0;
echo "${get_stdout_result}" > package.json;

print_cmd "echo ... > .yarnrc.yml";
echo "$YARNRC_YML" > .yarnrc.yml;

[ -f "yarn.lock" ] || execute touch yarn.lock;
execute yarn install;

execute yarn pack -o "${PKG_TGZ}";
execute ls -alh "${PKG_TGZ}";

execute yarn npm publish --access public;
