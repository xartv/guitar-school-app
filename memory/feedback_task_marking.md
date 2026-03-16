---
name: feedback_task_marking
description: Always commit docs/tasks.md together with the task implementation commit
type: feedback
---

Always include `docs/tasks.md` (with the ✅ completion mark) in the same git commit as the task implementation — not as a separate commit afterward.

**Why:** User has been corrected on this twice. Separate commits for tasks.md feel incomplete and create unnecessary noise in git history.

**How to apply:** When staging files for the task commit, always add `docs/tasks.md` to the same `git add` command before committing.
