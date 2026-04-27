#!/usr/bin/env bash
# Git Bash (Windows) + macOS + Linux — създава SUPER_ADMIN (по подразбиране zlatevsoft).
#
# Преди пускане (стойностите НЕ се пазят в този файл):
#   export SETUP_SECRET='точната-стойност-на-SETUP_SECRET-от-Vercel'
#   export ADMIN_PASS='твоята-парола-мин-8-знака'
# Опционално: export SITE='https://astrohoroscope.online'  ; export USER_NAME='zlatevsoft'
#
#   bash scripts/create-master-admin-zlatevsoft.sh

set -euo pipefail

SITE="${SITE:-https://astrohoroscope.online}"
USER_NAME="${USER_NAME:-zlatevsoft}"

if [ -z "${SETUP_SECRET:-}" ] || [ -z "${ADMIN_PASS:-}" ]; then
  echo "ERROR: export SETUP_SECRET and ADMIN_PASS first."
  exit 1
fi
if [ "${#ADMIN_PASS}" -lt 8 ]; then
  echo "ERROR: ADMIN_PASS must be at least 8 characters."
  exit 1
fi

if ! command -v node &>/dev/null; then
  echo "ERROR: Node.js (node) is required to build safe JSON. Install from nodejs.org"
  exit 1
fi

export U="$USER_NAME"
export P="$ADMIN_PASS"
BODY=$(node -e "console.log(JSON.stringify({username:process.env.U,password:process.env.P,name:'Admin'}))")

req() {
  local url="$1"
  curl -sS --ssl-no-revoke -o /tmp/astro_admin_resp.json -w "%{http_code}" -X POST "$url" \
    -H "Content-Type: application/json" \
    -H "X-Setup-Key: $SETUP_SECRET" \
    -d "$BODY"
}

echo "POST $SITE/api/admin/bootstrap"
code=$(req "$SITE/api/admin/bootstrap")
echo "HTTP $code"
cat /tmp/astro_admin_resp.json
echo

if [ "$code" = "200" ]; then
  echo "OK. Log in: $SITE/login  user: $USER_NAME"
  exit 0
fi

if [ "$code" = "409" ]; then
  echo "→ Trying provision-super-user (admin may already exist)…"
  code=$(req "$SITE/api/admin/provision-super-user")
  echo "HTTP $code"
  cat /tmp/astro_admin_resp.json
  echo
  if [ "$code" = "200" ]; then
    echo "OK. Log in: $SITE/login  user: $USER_NAME"
    exit 0
  fi
  echo "If 409: user may already exist — try login, or set USER_NAME to a new value."
  exit 1
fi

echo "Failed (401=wrong SETUP_SECRET, 503=no DATABASE_URL). Fix Vercel + redeploy, then retry."
exit 1
