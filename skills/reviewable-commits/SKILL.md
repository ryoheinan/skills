---
name: reviewable-commits
description: Plan and create local git commits around reviewable work contexts. Use when the user asks to preview a commit plan, split changes, choose commit boundaries, or commit local changes. Preserve the existing index while preparing the preview, and create commits only when explicitly authorized.
license: Apache-2.0
---

# reviewable-commits

Plan commit boundaries around coherent reviewer conversations, then show the exact plan before committing.

Match the user's requested mode:

- For a preview or boundary-planning request, inspect and propose only. Approval of that preview does not authorize commits unless the user also asked to commit.
- For a commit request, show the preview and wait for approval before creating any commit. Once that commit intent is established, an affirmative response such as `OK` authorizes the still-matching preview; do not require the user to repeat the commit request.
- A later explicit instruction to commit also authorizes the most recently shown, still-matching preview.

## Workflow

### 1. Inspect the full change set

- Read `AGENTS.md` and other applicable repository instructions.
- Inspect `git status`, staged, unstaged, and untracked changes. Use recent history when it helps match repository conventions.
- Determine boundaries from the full change set rather than the current staging layout.
- Preserve unrelated and in-progress user work.

### 2. Choose boundaries by review context

Identify candidate contexts such as subsystem ownership, contracts, product behavior, UI, operational workflows, documentation, generated artifacts, and mechanical cleanup. These are signals, not mandatory file-based splits.

- Keep tests with the behavior they verify.
- Keep generated artifacts with their source configuration or contract.
- Keep narrow documentation with the change it explains; separate broad operational guidance when it is a different reviewer conversation.
- Separate unrelated tasks, preparatory refactors, formatting, and operational changes when they can be reviewed meaningfully on their own.
- Express dependencies through commit order when each commit remains internally coherent.

Do not choose a commit count in advance. Multiple services, generated bindings, deployment order, a shared phase label, or convenient whole-feature reverts do not by themselves justify one commit. Conversely, do not split tightly coupled changes when the result would be artificial or internally invalid.

Each proposed commit should remain buildable and testable where practical. An incomplete end-to-end feature is acceptable; an internally broken commit is not. If no honest boundary avoids a known failure, identify the exact failing check and obtain explicit approval for that exception.

Before proposing one commit across several apparent review contexts, state the plausible splits considered and the concrete coupling that prevents them. Generic claims that the changes are connected are insufficient.

### 3. Prepare the preview safely

Do not modify the user's real Git index solely to prepare the preview. When `commit-message-staged-check` needs a staged candidate, use a temporary alternate index initialized from `HEAD`, stage only that candidate's paths or hunks there, and leave the real index unchanged.

Use `commit-message-staged-check` for each candidate commit. Do not repeat its message-formatting rules here.

For each proposed commit, show:

- the proposed commit message variants
- the exact path or hunk scope needed to stage it
- the review context and grouping rationale
- material dependency, validation, or intermediate-state risks

For a single commit spanning several apparent contexts, also show the considered splits and why each fails.

Stop after showing the preview. For commit requests, wait for approval; an affirmative response authorizes the matching preview without requiring another explicit commit instruction. For preview-only requests, do not infer commit intent from approval alone.

### 4. Commit only the authorized plan

Immediately before each commit:

- recheck the working tree and staged diff
- stage only the approved paths or hunks
- run `git diff --cached --check`
- confirm that the staged content and commit message still match the preview

After each commit, recheck the remaining changes before continuing. If the scope, boundary, order, message, or relevant working-tree state differs from the approved preview, stop, show an updated preview, and wait for fresh approval.

Never mix unrelated changes into a commit or alter existing user staging without making the effect explicit.
