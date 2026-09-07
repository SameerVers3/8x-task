#!/bin/bash
# Capture hook for Claude Code — 8x assignment
# Captures prompts and responses to .agent-logs/
# This script is called by hooks in .claude/settings.json

# Don't exit on error — we want to log as much as possible
# set -e

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

# Try to extract session_id from stdin JSON
SESSION_ID=""
if command -v jq >/dev/null 2>&1; then
  SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // .sessionId // empty' 2>/dev/null || echo "")
fi
if [ -z "$SESSION_ID" ]; then
  SESSION_ID="unknown"
fi

# State file for this session
STATE_FILE="$LOG_DIR/.state-${SESSION_ID:0:8}.json"

# Initialize state if needed
if [ ! -f "$STATE_FILE" ]; then
  echo '{"count":0,"first_prompt_time":"","last_prompt_time":""}' > "$STATE_FILE"
fi

# Read current state
COUNT=$(jq -r '.count // 0' "$STATE_FILE" 2>/dev/null || echo "0")
FIRST_PROMPT_TIME=$(jq -r '.first_prompt_time // empty' "$STATE_FILE" 2>/dev/null || echo "")

# Current timestamp
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)

# Log file for this session
LOG_FILE="$LOG_DIR/$(date -u +%Y-%m-%d_%H-%M-%S)_${SESSION_ID:0:8}.md"

# --- HANDLE PROMPT EVENT ---
if [ "$EVENT_TYPE" = "prompt" ]; then
  # Try to extract prompt text from various possible JSON fields
  PROMPT_TEXT=""
  if command -v jq >/dev/null 2>&1; then
    PROMPT_TEXT=$(echo "$INPUT" | jq -r '
      .prompt //
      .tool_input.prompt //
      .message //
      .text //
      .content //
      empty
    ' 2>/dev/null || echo "")
  fi

  if [ -z "$PROMPT_TEXT" ] || [ "$PROMPT_TEXT" = "null" ]; then
    PROMPT_TEXT="[Prompt text not available in hook data — see hook-debug.log]"
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
  if [ "$COUNT" -eq 1 ]; then
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

Session: \`${SESSION_ID:0:8}\` | Project: \`8x\` | Author: \`sameer\`

---

EOF
  fi

  # Append prompt entry
  cat >> "$LOG_FILE" <<EOF
[LOG_ENTRY type=PROMPT num=$COUNT session=${SESSION_ID:0:8}]
timestamp: $TIMESTAMP
model: accounts/fireworks/models/kimi-k2p6

$PROMPT_TEXT

EOF
fi

# --- HANDLE STOP/RESPONSE EVENT ---
if [ "$EVENT_TYPE" = "stop" ]; then
  COUNT=$(jq -r '.count // 0' "$STATE_FILE" 2>/dev/null || echo "0")

  # Try to get transcript path from stdin
  TRANSCRIPT_PATH=""
  if command -v jq >/dev/null 2>&1; then
    TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // .transcriptPath // empty' 2>/dev/null || echo "")
  fi

  RESPONSE_TEXT=""

  # If transcript path is provided, try to read it
  if [ -n "$TRANSCRIPT_PATH" ] && [ "$TRANSCRIPT_PATH" != "null" ] && [ -f "$TRANSCRIPT_PATH" ]; then
    echo "Found transcript: $TRANSCRIPT_PATH" >> "$DEBUG_LOG"
    # Read the transcript and try to extract the last assistant response
    # This is a best-effort attempt — transcript format may vary
    RESPONSE_TEXT=$(cat "$TRANSCRIPT_PATH" 2>/dev/null | tail -n 200 || echo "")
  fi

  # If no transcript or couldn't read it, try to get response from stdin directly
  if [ -z "$RESPONSE_TEXT" ]; then
    if command -v jq >/dev/null 2>&1; then
      RESPONSE_TEXT=$(echo "$INPUT" | jq -r '.response // .text // .content // empty' 2>/dev/null || echo "")
    fi
  fi

  if [ -z "$RESPONSE_TEXT" ] || [ "$RESPONSE_TEXT" = "null" ]; then
    RESPONSE_TEXT="[Response text not captured — see hook-debug.log for raw hook data]"
  fi

  # Find the most recent log file for this session
  LOG_FILE=$(ls -t "$LOG_DIR"/*.md 2>/dev/null | grep "${SESSION_ID:0:8}" | head -n 1)

  # If no log file exists yet, create one (can happen if Stop fires before any prompt)
  if [ -z "$LOG_FILE" ]; then
    LOG_FILE="$LOG_DIR/$(date -u +%Y-%m-%d_%H-%M-%S)_${SESSION_ID:0:8}.md"
    cat > "$LOG_FILE" <<EOF
---
session_id: $SESSION_ID
date: $(date -u +%Y-%m-%d)
author: sameer
model: accounts/fireworks/models/kimi-k2p6
tool: claude-code
project: 8x
total_exchanges: 0
first_prompt_time: $TIMESTAMP
last_prompt_time: $TIMESTAMP
---

# Session Log - $(date -u +%Y-%m-%d)

Session: \`${SESSION_ID:0:8}\` | Project: \`8x\` | Author: \`sameer\`

---

EOF
  fi

  # Append response entry
  cat >> "$LOG_FILE" <<EOF
[LOG_ENTRY type=RESPONSE num=$COUNT session=${SESSION_ID:0:8}]
timestamp: $TIMESTAMP
model: accounts/fireworks/models/kimi-k2p6

$RESPONSE_TEXT

EOF
fi
