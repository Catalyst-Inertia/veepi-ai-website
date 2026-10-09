---
name: no-skipping-verification
description: 'Never skip verification or assume code is structurally sound when a verification tool fails.'
condition: ['skip the .* verify', 'skip verification', 'structurally sound']
scope: 'thinking'
---

NEVER skip verification or assume a change is "structurally sound" just because a test or browser script failed to run. If your verification tool or script crashes, FIX THE SCRIPT and run it again until you have concrete proof the UI or feature works. You must not yield until you have actually verified the fix.
