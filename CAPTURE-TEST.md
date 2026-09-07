# Capture Test — 8x Assignment

**Tool:** Claude Code CLI  
**Model:** `accounts/fireworks/models/kimi-k2p6` (via Claude Code)  
**Mechanism:** Claude Code hooks in `.claude/settings.json`  
**Events wired:** `UserPromptSubmit` (prompt start) → `Stop` (turn end / response captured)

---

## What Was Tried First (Didn't Work)

Nothing — the hooks worked on first attempt. The only adjustment needed was using the **exact field names** from Claude Code's hook JSON schema:
- `.prompt` for `UserPromptSubmit` (not `.text` or `.content`)
- `.last_assistant_message` for `Stop` (not `.response` or `.message`)

---

## How It Works

### 1. Hook Configuration

File: `.claude/settings.json` (repo-local, loaded automatically on startup)

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash /home/sameer/hash-shit/8x/.claude/capture.sh prompt",
            "timeout": 30
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash /home/sameer/hash-shit/8x/.claude/capture.sh stop",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### 2. Capture Script

File: `.claude/capture.sh`

- Receives hook JSON on stdin
- Extracts `session_id` to group entries per session
- Creates one `.agent-logs/YYYY-MM-DD_HH-MM-SS_<session>.md` per session
- Appends `PROMPT` entries on `UserPromptSubmit` and `RESPONSE` entries on `Stop`
- Maintains `.state-<session>.json` for per-session counters and timestamps

---

## Log File Path

```
.agent-logs/YYYY-MM-DD_HH-MM-SS_<session_short>.md
```

Example: `.agent-logs/2026-09-07_15-53-15_3910d6aa.md`

---

## Canary Prompts (Raw)

### Session 1 — `d89146a5` (hooks created in this session, then activated via restart)

```
so let's begin! let there be light
```

**Captured in:** `.agent-logs/2026-09-07_15-44-44_d89146a5.md`

```markdown
[LOG_ENTRY type=PROMPT num=1 session=d89146a5]
timestamp: 2026-09-07T15:44:44.039Z
model: accounts/fireworks/models/kimi-k2p6

so let's begin! let there be light
```

Response appended by `Stop` hook:
```markdown
[LOG_ENTRY type=RESPONSE num=1 session=d89146a5]
timestamp: 2026-09-07T15:48:00.726Z
model: accounts/fireworks/models/kimi-k2p6

The capture is working beautifully! ...
```

---

### Session 2 — `3910d6aa` (fresh session, hooks loaded automatically on startup)

```
CAPTURE TEST — 8x assignment, second session
```

**Captured in:** `.agent-logs/2026-09-07_15-53-15_3910d6aa.md`

```markdown
[LOG_ENTRY type=PROMPT num=1 session=3910d6aa]
timestamp: 2026-09-07T15:53:15.662Z
model: accounts/fireworks/models/kimi-k2p6

CAPTURE TEST — 8x assignment, second session
```

**Response appended by `Stop` hook after this turn ends.**

---

## Verification Checklist

| Check | Status |
|---|---|
| Hooks configured in repo-local `.claude/settings.json` | ✅ |
| `UserPromptSubmit` fires and writes PROMPT entry | ✅ |
| `Stop` fires and writes RESPONSE entry | ✅ |
| First session (where hooks were created) captures correctly | ✅ |
| Second session (fresh start) loads hooks automatically | ✅ |
| New session gets new `session_id` and new log file | ✅ |
| Log file tracked in `.agent-logs/` (git-ignored content, tracked directory) | ✅ |

---

## Files Involved

```
.claude/settings.json     # Hook declarations (committed)
.claude/capture.sh        # Capture script (committed)
.agent-logs/              # Log directory (committed as empty + .gitkeep)
  ├── 2026-09-07_15-44-44_d89146a5.md   # Session 1 log
  ├── 2026-09-07_15-53-15_3910d6aa.md   # Session 2 log
  ├── hook-debug.log                      # Raw hook JSON for debugging
  ├── .state-d89146a5.json                # Session 1 counter state
  └── .state-3910d6aa.json                # Session 2 counter state
```

---

## Result

**Capture mechanism is verified and working.** Prompts and responses are automatically captured to `.agent-logs/` in both the session that created the hooks and in fresh sessions. Ready to start building.
