#!/usr/bin/env bash
# Публикует или удаляет статику стенда в ветке gh-pages: pr-<номер>/.
set -euo pipefail

mode="${1:?mode: deploy or remove}"
pr="${2:?pull request number}"

if ! [[ "$pr" =~ ^[0-9]+$ ]]; then
  echo "Pull request number must be numeric, got: $pr" >&2
  exit 1
fi

repo_root=$(cd "$(dirname "$0")/../.." && pwd)
pages_templates="${PAGES_TEMPLATES:-$repo_root/.github/pages}"
build_dir="${BUILD_DIR:-$repo_root/build}"
remote="${PREVIEW_GIT_REMOTE:-https://github.com/${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}.git}"

export GIT_TERMINAL_PROMPT=0

if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  basic_auth=$(printf 'x-access-token:%s' "$GITHUB_TOKEN" | base64 -w0)
  export GIT_CONFIG_COUNT=1
  export GIT_CONFIG_KEY_0="http.https://github.com/.extraheader"
  export GIT_CONFIG_VALUE_0="AUTHORIZATION: basic ${basic_auth}"
  unset basic_auth
fi

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

if git ls-remote --heads "$remote" gh-pages | grep -q 'refs/heads/gh-pages$'; then
  git clone --depth 1 --branch gh-pages "$remote" "$work/site"
else
  mkdir -p "$work/site"
  git -C "$work/site" init -b gh-pages
  git -C "$work/site" remote add origin "$remote"
fi

site="$work/site"
cp "$pages_templates/404.html" "$site/404.html"
cp "$pages_templates/index.html" "$site/index.html"
touch "$site/.nojekyll"

target="$site/pr-$pr"
if [[ "$mode" == "deploy" ]]; then
  if [[ ! -f "$build_dir/index.html" ]]; then
    echo "Build output not found: $build_dir/index.html" >&2
    exit 1
  fi
  rm -rf "$target"
  mkdir -p "$target"
  cp -a "$build_dir"/. "$target"/
elif [[ "$mode" == "remove" ]]; then
  rm -rf "$target"
else
  echo "Unknown mode: $mode" >&2
  exit 1
fi

git -C "$site" config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git -C "$site" config user.name "github-actions[bot]"
git -C "$site" add -A
if git -C "$site" diff --cached --quiet; then
  echo "No changes to publish"
  exit 0
fi

git -C "$site" commit -m "preview: ${mode} pr-${pr}"

attempt=1
while [[ "$attempt" -le 5 ]]; do
  if git -C "$site" push --set-upstream origin gh-pages; then
    exit 0
  fi
  git -C "$site" pull --rebase origin gh-pages
  sleep "$attempt"
  attempt=$((attempt + 1))
done

echo "Failed to push gh-pages" >&2
exit 1
