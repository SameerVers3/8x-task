#!/bin/bash
# Capture hook for Claude Code — 8x assignment
# Captures prompts and responses to .agent-logs/
# Uses exact fields from Claude Code hook JSON:
#   UserPromptSubmit → .prompt
#   Stop → .last_assistant_message

# Don't exit on error — we want to log as much as possible

# Determine project root from script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_DIR/.agent-logs"
mkdir -p "$LOG_DIR"

EVENT_TYPE="$1"
INPUT=$(cat)

# Debug logging — log everything we receive for inspection
DEBUG_LOG="$LOG_DIR/hook-debug.log"
echo "=== $(date -u +%Y-%m-%dT%H:%M:%S.%3NZ) EVENT=$EVENT_TYPE ===" >> "$DEBUG_LOG"
echo "$INPUT" >> "$DEBUG_LOG"
echo "" >> "$DEBUG_LOG"

# Extract session_id from stdin JSON
SESSION_ID=""
if command -v jq >/dev/null 2>&1; then
  SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty' 2>/dev/null || echo "")
fi
if [ -z "$SESSION_ID" ]; then
  SESSION_ID="unknown"
fi

SESSION_SHORT="${SESSION_ID:0:8}"

# Find or create the log file for this session
LOG_FILE=$(ls -t "$LOG_DIR"/????-??-??_??-??-??_"$SESSION_SHORT".md 2>/dev/null | head -n 1)

if [ -z "$LOG_FILE" ]; then
  LOG_FILE="$LOG_DIR/$(date -u +%Y-%m-%d_%H-%M-%S)_${SESSION_SHORT}.md"
fi

# State file for this session
STATE_FILE="$LOG_DIR/.state-${SESSION_SHORT}.json"

# Initialize state if needed
if [ ! -f "$STATE_FILE" ]; then
  echo '{"count":0,"first_prompt_time":"","last_prompt_time":""}' > "$STATE_FILE"
fi

# Read current state
COUNT=$(jq -r '.count // 0' "$STATE_FILE" 2>/dev/null || echo "0")
FIRST_PROMPT_TIME=$(jq -r '.first_prompt_time // empty' "$STATE_FILE" 2>/dev/null || echo "")

# Current timestamp
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)

# --- HANDLE PROMPT EVENT ---
if [ "$EVENT_TYPE" = "prompt" ]; then
  # Extract prompt text from the exact field Claude Code provides
  PROMPT_TEXT=""
  if command -v jq >/dev/null 2>&1; then
    PROMPT_TEXT=$(echo "$INPUT" | jq -r '.prompt // empty' 2>/dev/null || echo "")
  fi

  if [ -z "$PROMPT_TEXT" ] || [ "$PROMPT_TEXT" = "null" ]; then
    PROMPT_TEXT="[Prompt text not available in hook data]"
  fi

  COUNT=$((COUNT + 1))

  if [ -z "$FIRST_PROMPT_TIME" ] || [ "$FIRST_PROMPT_TIME" = "null" ]; then
    FIRST_PROMPT_TIME="$TIMESTAMP"
  fi

  # Update state
  jq --arg c "$COUNT" --arg t "$TIMESTAMP" --arg f "$FIRST_PROMPT_TIME" \
    '.count = ($c | tonumber) | .last_prompt_time = $t | .first_prompt_time = $f' \
    "$STATE_FILE" > "${STATE_FILE}.tmp" 2>/dev/null && mv "${STATE_FILE}.tmp" "$STATE_FILE" || true

  # Create log file with header if this is the first prompt
  if [ "$COUNT" -eq 1 ] || [ ! -f "$LOG_FILE" ]; then
    cat > "$LOG_FILE" <<EOF
---
session_id: $SESSION_ID
date: $(date -u +%Y-%m-%d)
author: sameer
model: accounts/fireworks/models/kimi-k2p6
tool: claude-code
project: 8x
total_exchanges: 0
first_prompt_time: $FIRST_PROMPT_TIME
last_prompt_time: $TIMESTAMP
---

# Session Log - $(date -u +%Y-%m-%d)

Session: \`${SESSION_SHORT}\` | Project: \`8x\` | Author: \`sameer\`

---

EOF
  fi

  # Append prompt entry
  cat >> "$LOG_FILE" <<EOF
[LOG_ENTRY type=PROMPT num=$COUNT session=${SESSION_SHORT}]
timestamp: $TIMESTAMP
model: accounts/fireworks/models/kimi-k2p6

$PROMPT_TEXT

EOF

  # Update header last_prompt_time and total_exchanges
  if command -v sed >/dev/null 2>&1; then
    sed -i "s/last_prompt_time: .*/last_prompt_time: $TIMESTAMP/" "$LOG_FILE" 2>/dev/null || true
    sed -i "s/total_exchanges: .*/total_exchanges: $COUNT/" "$LOG_FILE" 2>/dev/null || true
  fi
fi

# --- HANDLE STOP/RESPONSE EVENT ---
if [ "$EVENT_TYPE" = "stop" ]; then
  COUNT=$(jq -r '.count // 0' "$STATE_FILE" 2>/dev/null || echo "0")

  # Extract the last assistant message from the exact field Claude Code provides
  RESPONSE_TEXT=""
  if command -v jq >/dev/null 2>&1; then
    RESPONSE_TEXT=$(echo "$INPUT" | jq -r '.last_assistant_message // empty' 2>/dev/null || echo "")
  fi

  if [ -z "$RESPONSE_TEXT" ] || [ "$RESPONSE_TEXT" = "null" ]; then
    RESPONSE_TEXT="[Response text not available in hook data]"
  fi

  # Append response entry
  cat >> "$LOG_FILE" <<EOF
[LOG_ENTRY type=RESPONSE num=$COUNT session=${SESSION_SHORT}]
timestamp: $TIMESTAMP
model: accounts/fireworks/models/kimi-k2p6

$RESPONSE_TEXT

EOF
fi
