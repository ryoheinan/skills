---
name: safe-commit-preview
description: Plan and create local git commits with a strong bias toward revert-safe boundaries, not just the smallest working slice. Use when the user wants you to commit changes, split work into multiple commits, preview the commit plan before committing, or choose commit granularity that stays safe to partially revert later. Use `commit-message-staged-check` for commit message proposals, and never create commits until the user has seen and approved the preview.
---

# safe-commit-preview

Use this skill when committing local changes.

Prioritize not only the smallest working unit, but also whether a single commit can be safely reverted later when only part of the work needs to be rolled back.

Always show a preview before committing. Do not run `git commit` before the user has seen and approved the preview.

## Workflow

### 1. Inspect the full change set

- Check `AGENTS.md` and any local workflow rules first
- Review `git status`, the staged diff, the unstaged diff, and recent commit history when needed
- If the user asks to split the work into multiple commits, do not trust the current staging blindly; inspect the whole working tree before deciding the boundaries

### 2. Choose commit boundaries with revert safety as the primary lens

Think in this order:

1. What part of this work might someone want to revert later?
2. What is the safest boundary for a single revert?
3. Which changes should be separated to reduce rollback risk?

Prefer to split these apart:

- behavior changes and pure formatting
- refactors and feature work
- changes that may need independent rollback if something fails
- rename or move operations and logic changes
- test additions and implementation changes when one side is likely to be reverted without the other

Do not force a split when:

- splitting would create a broken intermediate state
- reverting only one side would clearly leave the codebase inconsistent
- the implementation and follow-up adjustments are tightly coupled and independent rollback is not realistic

If the boundary is ambiguous, prefer revert safety over the smallest working slice.

### 3. Show a preview and wait for approval

Before any commit, always show the proposed commit plan as a preview.

For each proposed commit, include at least:

- the proposed commit message
- the scope of changes included
- why those changes are grouped together
- why that commit should be safe to revert on its own later
- if something was intentionally not split out, the reason why

Example preview:

```text
Commit preview

1. feat: Add safe commit preview workflow
   Scope: add the main skill definition
   Why grouped: keeps the workflow definition isolated
   Revert safety: reverting this commit should not affect existing skills

2. chore: Add skill metadata for safe commit preview
   Scope: `agents/openai.yaml`
   Why grouped: keeps UI metadata separate from the workflow definition
   Revert safety: metadata can be reverted independently
```

After showing the preview, wait for approval. Do not push ahead with `git add` or `git commit` beyond what is needed to prepare an accurate preview.

### 4. Propose commit messages

Use `commit-message-staged-check` to generate commit message proposals.

Always use that skill to inspect the staged diff and produce both a subject-only version and a subject-plus-body version.
Adopt the subject-plus-body version as the actual commit message unless the user explicitly asks for a subject-only commit.
Include the actual body-including candidate message you plan to use in the preview.

- As required by `commit-message-staged-check`, always decide from the real staged diff
- Use an appropriate prefix such as `feat:`
- Start the subject with a capital letter
- Do not include a ticket ID
- Do not include non-essential concrete numeric values
- Use the body-including version as the default

If the staged diff no longer matches the previewed message candidate, update the preview instead of committing immediately.

### 5. Commit only after approval

- Stage only the files or hunks needed for each planned commit
- Recheck the staged diff immediately before each commit
- Make sure the preview still matches the actual staged content before running `git commit`
- After each commit, review the remaining changes and confirm that the next planned boundary still makes sense

## Guardrails

- Do not commit before showing a preview, even if the user simply says "commit this"
- Do not immediately commit based only on what is already staged; include unstaged changes in the boundary decision when needed
- Do not create mixed commits just because the feature works if that would make later reverts risky
- If you find unrelated changes or in-progress user work, do not mix them in silently; separate them or confirm first
- If the work cannot be cleanly split, say so explicitly in the preview
