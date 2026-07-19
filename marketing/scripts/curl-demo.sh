#!/usr/bin/env bash
# curl-demo.sh — full end-to-end demo flow.
#
# Requires: curl, openssl, python3 (or `python` on PATH), and the
# marketing server running on PORT 3010.
#
# Usage:
#   BASE=http://127.0.0.1:3010 ./scripts/curl-demo.sh

set -e
BASE=${BASE:-http://127.0.0.1:3010}
COOKIE=/tmp/lg-cookies.txt
rm -f "$COOKIE"

# Tolerate either python3 or python being on PATH
PYTHON=$(command -v python3 || command -v python)
if [ -z "$PYTHON" ]; then
  echo "python3 or python required" >&2
  exit 1
fi

echo "==> 1. Login as Lerato"
curl -s -c "$COOKIE" -X POST "$BASE/api/care/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"lerato@demo.lifeguard","password":"demo1234"}'
echo

echo "==> 2. List care receivers"
RECEIVERS=$(curl -s -b "$COOKIE" "$BASE/api/care/care-receivers")
echo "$RECEIVERS"
CR_ID=$(echo "$RECEIVERS" | "$PYTHON" -c "import sys,json; data=json.load(sys.stdin); print((data[0]['id'] if isinstance(data,list) else data.get('id','')))")
echo "  selected care_receiver: $CR_ID"

echo "==> 3. Get care receiver detail (extracts agent + first med id)"
DETAIL=$(curl -s -b "$COOKIE" "$BASE/api/care/care-receivers/$CR_ID")
echo "$DETAIL"
AGENT_ID=$(echo "$DETAIL" | "$PYTHON" -c "import sys,json; d=json.load(sys.stdin); print(d.get('agent',{}).get('id','') if isinstance(d.get('agent'),dict) else '')")
MED_ID=$(echo "$DETAIL" | "$PYTHON" -c "import sys,json; d=json.load(sys.stdin); meds=d.get('medications') or []; print(meds[0]['id'] if meds else '')")
echo "  selected agent: $AGENT_ID"
echo "  selected medication: $MED_ID"

echo "==> 4. Send a chat message"
curl -s -b "$COOKIE" -X POST "$BASE/api/care/chat" \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"what's the medication schedule today?\",\"agentId\":\"$AGENT_ID\"}"
echo

echo "==> 5. Confirm a medication"
curl -s -b "$COOKIE" -X POST "$BASE/api/care/adherence/confirm" \
  -H "Content-Type: application/json" \
  -d "{\"medicationId\":\"$MED_ID\",\"confirmationSource\":\"caregiver\"}"
echo

echo "==> 6. Send a vitals reading (HMAC-signed)"
SECRET="dev-webhook-secret"
BODY="{\"careReceiverId\":\"$CR_ID\",\"metric\":\"hr\",\"value\":125}"
SIG="sha256=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $NF}')"
echo "  signature: $SIG"
curl -s -X POST "$BASE/api/care/vitals/ingest" \
  -H "Content-Type: application/json" \
  -H "X-LG-Signature: $SIG" \
  -d "$BODY"
echo

echo "==> 7a. Run reminders cron"
curl -s -H "X-Cron-Secret: dev-cron-secret" "$BASE/api/care/cron/reminders"
echo

echo "==> 7b. Run escalations cron"
curl -s -H "X-Cron-Secret: dev-cron-secret" "$BASE/api/care/cron/escalations"
echo

echo "==> 7c. Run digest cron (no-op unless today is Sunday)"
curl -s -H "X-Cron-Secret: dev-cron-secret" "$BASE/api/care/cron/digest"
echo

echo "==> 8. Fetch latest digest for agent"
curl -s -b "$COOKIE" "$BASE/api/care/digest/$AGENT_ID"
echo

echo "Done."
