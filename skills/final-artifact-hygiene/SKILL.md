---
name: final-artifact-hygiene
description: Create or revise reader-facing deliverables such as design documents, plans, specifications, and reports so they retain necessary constraints without conversational scaffolding or obsolete discussion. Use when turning chat or working notes into a durable final document. Do not use for casual conversation or open-ended brainstorming.
license: Apache-2.0
---

# Final Artifact Hygiene

Produce a standalone deliverable for its intended readers, not a transcript of how the deliverable was produced.

## Classify the source context

Before drafting, distinguish among:

- requirements, constraints, and scope that readers need
- rationale or decision history that readers need to act or maintain the result
- execution-only instructions, confirmations, and compliance narration
- rejected, superseded, or unrelated discussion

For each candidate detail, ask: if this detail were removed, would an intended reader make a different decision, take a different action, or face a realistic misunderstanding? Keep it when the answer is yes. Otherwise, apply the instruction silently or omit the detail.

## Write for the reader

- Draft as if the reader has not seen the source conversation.
- Apply instructions about format, tone, level, and excluded topics without announcing that they were followed.
- Omit rejected or obsolete options unless the user requested a decision record or the history is needed to understand the current choice.
- Prefer an affirmative requirement or scope statement when it preserves the full meaning.
- Keep explicit prohibitions when they protect safety, security, legal obligations, compatibility, or a meaningful support boundary.
- Preserve uncertainty, unverified claims, incomplete validation, known limitations, safety warnings, and other transparency the reader needs.
- Preserve requested structures such as decision logs and out-of-scope sections; refine their contents rather than deleting the structures.

## Boundary examples

- Execution scope: “Explain this at a high-school level.” Write at that level without adding “University-level concepts are not used.”
- Obsolete discussion: “Leave the discarded authentication redesign out of this specification.” Omit both the redesign and a note that it was omitted.
- Product scope: “Version 1 serves authenticated users.” Keep that audience boundary; mention unsupported anonymous access only when it prevents a realistic misunderstanding.
- Security invariant: “Access tokens must never be logged.” Keep the explicit prohibition.

## Final audit

Remove:

- statements that merely prove an instruction was followed
- references to the prompt or conversation that do not help the reader
- explanations of why an irrelevant or obsolete topic is absent
- alternatives that no longer belong to the artifact

Then confirm that the cleanup did not remove required behavior, scope, rationale, limitations, validation status, warnings, or requested documentation sections. Return the deliverable without a separate cleanup report unless the user asks for one.
