#!/usr/bin/env bash
# Создаёт или обновляет комментарий со ссылкой на стенд пулл-реквеста.
set -euo pipefail

mode="${1:?mode: upsert or remove}"
pr="${PR_NUMBER:?PR_NUMBER is required}"
repo_name="${REPO_NAME:?REPO_NAME is required}"
owner=$(printf '%s' "${GITHUB_REPOSITORY_OWNER:?GITHUB_REPOSITORY_OWNER is required}" | tr '[:upper:]' '[:lower:]')
url="https://${owner}.github.io/${repo_name}/pr-${pr}/"
marker="<!-- preview-stand -->"

if [[ "$mode" == "upsert" ]]; then
  body=$(
    cat <<EOF
${marker}
Стенд: ${url}

API и картинки: https://testing.kinobattle.ru

Браузер ходит на бэкенд напрямую, поэтому testing.kinobattle.ru должен отдавать CORS для origin стенда: Access-Control-Allow-Origin и Access-Control-Allow-Headers: Authorization, Content-Type.
EOF
  )
elif [[ "$mode" == "remove" ]]; then
  body=$(
    cat <<EOF
${marker}
Стенд для этого пулл-реквеста снят.
EOF
  )
else
  echo "Unknown mode: $mode" >&2
  exit 1
fi

comment_id=$(
  gh api --paginate "repos/${GITHUB_REPOSITORY:?}/issues/${pr}/comments" \
    --jq '.[] | select(.body | contains("<!-- preview-stand -->")) | .id' |
    head -n 1
)

if [[ -n "$comment_id" ]]; then
  gh api --method PATCH "repos/${GITHUB_REPOSITORY}/issues/comments/${comment_id}" -f body="$body" >/dev/null
else
  gh api --method POST "repos/${GITHUB_REPOSITORY}/issues/${pr}/comments" -f body="$body" >/dev/null
fi
