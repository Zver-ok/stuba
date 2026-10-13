#!/usr/bin/env bash
set -euo pipefail
app_root=$(cd "$(dirname "$0")/.." && pwd)
php_bin=${PHP_BIN:-php}
port=${TEST_PORT:-8003}
fixture=$(mktemp -d)
server_pid=''
cleanup() {
  if [[ -n "$server_pid" ]]; then kill "$server_pid" 2>/dev/null || true; wait "$server_pid" 2>/dev/null || true; fi
  rm -rf "$fixture"
}
trap cleanup EXIT
export EXHIBITION_DATA_DIR="$fixture"
printf '%s\n' 'Exhibition-Test-Only-2026!' | "$php_bin" "$app_root/app/create-admin.php" testadmin
"$php_bin" -S "127.0.0.1:$port" -t "$app_root/public" > "$fixture/server.log" 2>&1 &
server_pid=$!
export TEST_BASE_URL="http://127.0.0.1:$port"
for attempt in {1..50}; do
  if curl -fsS "$TEST_BASE_URL/admin.php" >/dev/null; then break; fi
  if ! kill -0 "$server_pid" 2>/dev/null; then cat "$fixture/server.log"; exit 1; fi
  sleep 0.1
done
node "$app_root/tests/smoke.cjs"
