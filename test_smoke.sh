#!/usr/bin/env bash
set -euo pipefail

BASE=http://localhost:3000

echo "Health check..."
curl -sSf "$BASE/api/health" | jq || (echo "Health failed"; exit 2)

echo "Register initial admin (if none)..."
REG_RES=$(curl -s -X POST "$BASE/api/auth/register" -H "Content-Type: application/json" -d '{"username":"admin","password":"adminpass"}' || true)
echo "$REG_RES" | jq -r '.token' >/dev/null 2>&1 || true

echo "Login..."
TOK=$(curl -s -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" -d '{"username":"admin","password":"adminpass"}' | jq -r .token)
if [ -z "$TOK" ] || [ "$TOK" = "null" ]; then echo "Login failed"; exit 5; fi

echo "Create school..."
SCH=$(curl -s -X POST "$BASE/api/schools" -H "Content-Type: application/json" -H "Authorization: Bearer $TOK" -d '{"name":"Smoke School"}' | jq)
SCH_ID=$(echo "$SCH" | jq -r .id)
if [ -z "$SCH_ID" ] || [ "$SCH_ID" = "null" ]; then echo "Create school failed"; echo $SCH; exit 6; fi

echo "Create entry (admin)..."
curl -sSf -X POST "$BASE/api/entries" -H "Content-Type: application/json" -H "Authorization: Bearer $TOK" -d "{\"author\":\"Smoke\",\"content\":\"Smoke test entry\",\"schoolId\":$SCH_ID}" | jq || (echo "Create failed"; exit 7)

echo "List entries for school..."
curl -sSf "$BASE/api/entries?schoolId=$SCH_ID" | jq || (echo "List failed"; exit 8)

echo "Smoke test succeeded"
