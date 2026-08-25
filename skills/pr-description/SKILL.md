---
name: pr-description
description: Suggest and update GitHub PR titles and descriptions from the real PR diff and related Linear ticket. Use when the user asks to suggest a PR title, suggest a PR description, update a PR title/body, or invoke pr-description for a GitHub pull request. Prefer GitHub CLI for GitHub reads/writes, inspect the latest PR changes before drafting, include Linear context when provided, and require explicit user approval before mutating GitHub.
license: Apache-2.0
---

# pr-description

Draft or update PR metadata from source-of-truth context, not from memory or branch names alone.

## Workflow

1. Read the PR with GitHub CLI when available.
   - Use `gh pr view <url-or-number>` for title, body, base/head, and current metadata.
   - Use `gh pr diff <url-or-number>` for the latest diff.
   - Use GitHub MCP only when GitHub CLI is unavailable or the user explicitly asks for it.
2. Read Linear context when the user provides a Linear issue link or ticket ID.
   - If both PR and Linear ticket are provided, inspect both before drafting.
   - If the user explicitly says to skip the ticket ID, do not include it in the title.
3. Draft the proposed title and description first.
   - Do not update GitHub before the user approves the exact proposed content.
   - Treat short confirmations such as `ok` as approval only after a concrete preview has been shown.
4. After approval, update the PR with GitHub CLI, preserving existing body comments.

## Title Rules

- Default to `[Ticket ID] PR Title` when the PR is tied to a Linear ticket.
- Omit the ticket prefix when the user says `ticket idはskip`, `ticketはskip`, or equivalent.
- Keep the title in English.
- Make the title describe the actual behavioral or structural change from the diff.
- Use plain, specific wording. Avoid promotional or abstract claims, and name the actual change shown in the diff.

## Description Rules

- Write descriptions in both English and Japanese on each line, separated by a slash with spaces around it.
  - Example: `Added Button component. / ボタンコンポーネントを追加しました。`
- Write each language naturally instead of translating word for word. Keep the meaning aligned, but use wording that a developer would normally use in that language.
- Prefer plain, concrete descriptions of what changed and why it matters to reviewers. Name the affected behavior or structure instead of using vague claims.
- Avoid inflated, promotional, or stereotypically AI-generated wording in both languages. For example, do not reach for words such as `leverage`, `seamless`, `robust`, `comprehensive`, `streamline`, `enhance`, `活用`, `シームレス`, `堅牢`, `包括的`, or `強化` when a simpler, more specific description is available. Use such terms only when they are technically accurate and necessary.
- Remove filler that does not help a reviewer understand the change, such as generic claims that the implementation improves maintainability, reliability, or developer experience without evidence in the diff.
- If a sentence could apply to many unrelated PRs, rewrite it using concrete facts from the diff.
- Keep Japanese text in standard, straightforward Japanese. Avoid literal translations, unnecessary katakana, and repeated sentence endings that make the description sound mechanical.
- Keep English text concise and idiomatic. Prefer direct verbs and familiar technical terms over formal or abstract phrasing.
- Preserve existing HTML comments exactly, including markers such as:
  - `<!-- CURSOR_AGENT_PR_BODY_BEGIN -->`
  - `<!-- PRERELEASE_VERSION_START -->`
- If the existing PR body already has content, re-check the latest diff and revise only what is needed.
- For large refactors, include a concise responsibility split or scope summary when it helps reviewers understand the change.

## Mutation Guard

Never run `gh pr edit`, GitHub MCP update calls, or other write operations until the user approves the previewed title/body.
