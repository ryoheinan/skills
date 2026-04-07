---
name: safe-commit-preview
description: Plan and create local git commits by choosing boundaries that match meaningful work chunks, not just the smallest working slice. Use when the user wants you to commit changes, split work into multiple commits, preview the commit plan before committing, or choose commit granularity based on natural task boundaries someone may want to keep or roll back later. Use `commit-message-staged-check` for commit message proposals, and never create commits until the user has seen and approved the preview.
---

# safe-commit-preview

Use this skill when committing local changes.

Prioritize commit boundaries that reflect meaningful work chunks someone may later want to inspect, review, or revert as a unit.

Revert safety still matters, but only as a guardrail. It should validate the boundary, not define it by default.

Always show a preview before committing. Do not run `git commit` before the user has seen and approved the preview.

## Workflow

### 1. Inspect the full change set

- Check `AGENTS.md` and any local workflow rules first
- Review `git status`, the staged diff, the unstaged diff, and recent commit history when needed
- If the user asks to split the work into multiple commits, do not trust the current staging blindly; inspect the whole working tree before deciding the boundaries

### 2. Choose commit boundaries by work context first

Think in this order:

1. What are the distinct work chunks in this change set?
2. Which chunk would someone naturally want to review, discuss, or revert as a unit later?
3. Does that boundary still leave the codebase coherent if committed separately?
4. If not, what is the nearest larger boundary that still matches the work context?

Prefer to split these apart:

- separate tasks completed in the same branch
- preparatory refactors and the feature that depends on them
- behavior changes and pure formatting
- rename or move operations and the logic changes that follow them when they represent different review topics
- implementation work and follow-up cleanup when they are meaningfully different steps
- tests and implementation when they correspond to different work phases or review conversations

Do not force a split when:

- splitting would create a broken intermediate state
- the separated commits would no longer map cleanly to a meaningful work chunk
- the implementation and follow-up adjustments are tightly coupled enough that treating them as different tasks would be artificial

If the boundary is ambiguous, prefer the grouping that best matches the actual work story, then sanity-check that it is still safe enough to stand on its own.

### 3. Show a preview and wait for approval

Before any commit, always show the proposed commit plan as a preview.

For each proposed commit, include at least:

- the proposed commit message
- the scope of changes included
- why those changes are grouped together
- what work chunk or task boundary that commit represents
- whether there is any revert or intermediate-state risk worth calling out
- if something was intentionally not split out, the reason why

Example preview:

```text
Commit preview

1. feat: Add safe commit preview workflow
   Scope: add the main skill definition
   Why grouped: this is the main workflow change and stands as one reviewable task
   Work boundary: introduces the core behavior of the skill
   Risk note: low risk to keep separate because metadata does not depend on it

2. chore: Add skill metadata for safe commit preview
   Scope: `agents/openai.yaml`
   Why grouped: this is UI metadata for the skill rather than workflow logic
   Work boundary: updates presentation and invocation copy only
   Risk note: safe to separate because it does not change the workflow itself
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
- Do not create mixed commits just because the feature works if they blur distinct work chunks
- If you find unrelated changes or in-progress user work, do not mix them in silently; separate them or confirm first
- If the work cannot be cleanly split, say so explicitly in the preview
