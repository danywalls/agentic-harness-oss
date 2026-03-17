#!/bin/bash
# Factory loop runner — designed for systemd
# Runs loop.js every 60s, self-heals on failures

set -a
source $(dirname "$0")/../.env 2>/dev/null
set +a
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/root/.local/bin"

LOG="${FACTORY_LOG:-/tmp/factory-loop.log}"
WORKDIR="$(cd "$(dirname "$0")/.." && pwd)"
PIDFILE="/tmp/factory-loop-runner.pid"
CONSECUTIVE_FAILURES=0

# Single-instance guard
if [ -f "$PIDFILE" ]; then
  OLD_PID=$(cat "$PIDFILE")
  if kill -0 "$OLD_PID" 2>/dev/null; then
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] ⛔ Another loop already running (PID $OLD_PID) — exiting" >> "$LOG"
    exit 1
  fi
fi
echo $$ > "$PIDFILE"
trap 'rm -f "$PIDFILE"; echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Factory loop shutting down (signal)" >> "$LOG"; exit 0' SIGTERM SIGINT

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] 🔄 Factory loop starting (systemd-managed, PID $$)" >> "$LOG"

while true; do
  RUNNING=$(ps aux | grep '[c]laude.*-p.*--model' | wc -l)

  if [ "$RUNNING" -lt 3 ]; then
    cd "$WORKDIR"
    node --experimental-vm-modules factory/dist/loop.js >> "$LOG" 2>&1
    EC=$?

    if [ "$EC" -ne 0 ]; then
      CONSECUTIVE_FAILURES=$((CONSECUTIVE_FAILURES + 1))
      echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] ⚠️ Loop tick failed (exit $EC, consecutive: $CONSECUTIVE_FAILURES)" >> "$LOG"
      if [ "$CONSECUTIVE_FAILURES" -ge 5 ]; then
        echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] 🔴 5 consecutive failures — backing off 5 min" >> "$LOG"
        sleep 300
        CONSECUTIVE_FAILURES=0
      fi
    else
      CONSECUTIVE_FAILURES=0
    fi
  else
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] ⏳ $RUNNING agents active, skipping tick" >> "$LOG"
  fi

  sleep 20
done
