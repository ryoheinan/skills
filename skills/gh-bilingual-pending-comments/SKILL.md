---
name: gh-bilingual-pending-comments
description: Preview and apply Japanese-English rewrites to the authenticated user's inline comments in a pending GitHub pull request review. Use when a user provides a pull request URL or direct review-comment links and asks to make their unsubmitted comments bilingual. Do not use for submitted reviews, review summaries, issue comments, or replies.
license: Apache-2.0
---

# GitHub Bilingual Pending Comments

Accept a GitHub pull request URL or one or more direct review-comment URLs. Use GitHub CLI to find the authenticated user's pending review, prepare exact bilingual rewrites, and update GitHub only after the user explicitly approves the preview.

## Boundaries

- Operate only on inline comments belonging to one `PENDING` review authored by the authenticated user.
- Process one pull request and one pending review per invocation.
- Do not modify another user's review, a submitted comment, the review summary, an issue comment, or unsaved browser text.
- Do not create, reply to, resolve, delete, dismiss, approve, request changes, or submit a review.
- Stop if GitHub CLI is unavailable, unauthenticated, or cannot uniquely identify the target review. Do not require or silently switch to GitHub MCP.

## Read the pending review

Parse each URL into owner, repository, and pull request number. Prefer these read patterns with pagination where supported:

```sh
gh api user
gh api --paginate --slurp repos/OWNER/REPO/pulls/NUMBER/reviews
gh api --paginate --slurp repos/OWNER/REPO/pulls/NUMBER/reviews/REVIEW_ID/comments
```

Capture each comment's numeric `id` and GraphQL `node_id` from that list. Do not `GET /repos/OWNER/REPO/pulls/comments/COMMENT_ID`; pending comments are not available there.

Flatten the page arrays returned by `--slurp` before selecting reviews or comments. Select a review only when its state is `PENDING` and its author login matches the authenticated login. Confirm that every selected comment belongs to that review and author. If there is no match or more than one match, stop and report the ambiguity.

- When given only a pull request URL, target every inline comment in that pending review.
- When given direct review-comment URLs, normalize the supplied and API URLs by removing query parameters and trailing slashes before comparing `html_url`. If a supplied URL safely exposes a numeric review-comment ID, also use it as a secondary match against the API `id`. All links must resolve to the same pull request and pending review.
- Reject a link that does not resolve uniquely to an inline comment in that review, including an issue comment, review summary, reply, submitted comment, or another user's comment.

## Prepare bilingual bodies

Place Japanese before English. For a prose-only comment, use:

```md
<Japanese text>

<English text>

---

> This comment was translated by AI.
```

Translate the comment as a whole. Put the complete Japanese prose before the complete English prose; do not alternate languages by sentence or paragraph. Preserve meaning, request strength, conditions, tone, and technical terminology, but freely split, merge, reorder, or rephrase sentences and paragraphs when that makes each language natural. Do not imitate the source structure mechanically or translate word for word.

- Use this final order: complete Japanese prose, complete English prose, unchanged fenced code or `suggestion` blocks in their original order and present only once, then the AI notice.
- Keep inline code, URLs, mentions, file paths, and identifiers unchanged. Repeat them in both language sections when needed for each section to stand on its own.
- Preserve the role of lists, quotes, and headings while allowing their structure to differ naturally between languages.
- Treat the existing Japanese or English text as authoritative and add the missing language. If both languages already express the same meaning, do not rewrite them merely for style.
- Append the AI notice only when this run generates or revises a translation. If an equivalent AI-translation notice already exists, do not add another.
- If both languages already express the same meaning and this run does not change either translation, skip the comment; do not add the notice by itself.
- If a comment has no translatable prose, skip it rather than adding a misleading translation notice.
- If ambiguity prevents a meaning-preserving translation, mark the comment as requiring clarification and do not propose an update for it.

## Preview before writing

Do not mutate GitHub while preparing the preview. Group results as:

- `update`: comment ID, file and available line or range, complete original body, and complete proposed body
- `skip`: comment ID and reason, such as already bilingual without a translation change or no translatable prose
- `clarification-needed`: comment ID, the ambiguous text, and the decision needed

Present every proposed body in full. Ask for explicit approval to apply that exact preview. A request to inspect, translate, preview, or improve comments is not approval to update GitHub.

## Apply an approved preview

Authorization applies only to the latest exact preview. Before the first update, re-fetch the review and selected target comments. For a pull request URL, also confirm that the complete target comment set is unchanged. Stop and create a new preview if the review is no longer pending, a target changed, or any original body differs.

Immediately before each update, confirm again that the review is pending and that the target comment body still matches the previewed original. Then update only its body with GraphQL `updatePullRequestReviewComment`. Pass the comment's `node_id` as `variables.id`; do not pass the numeric REST `id`.

```sh
gh api graphql --input BODY_JSON_FILE
```

Create the temporary JSON payload with a JSON-aware encoder. The payload must be a GraphQL request with a `query` and a `variables` object that contains only `id` and `body`. Do not interpolate or hand-escape comment text into shell syntax.

```json
{
  "query": "mutation($id: ID!, $body: String!) { updatePullRequestReviewComment(input: { pullRequestReviewCommentId: $id, body: $body }) { pullRequestReviewComment { id body } } }",
  "variables": {
    "id": "PRRC_...",
    "body": "complete replacement body"
  }
}
```

Treat a GraphQL `errors` array as a failed update even when the HTTP status is 200. Pass the complete multiline body without lossy escaping, remove the temporary payload after use, and do not expose tokens or place comment content in logs beyond what the user approved in the preview.

After each update, re-fetch the pending review's comment list and verify the complete body. After all updates, re-fetch the review and confirm it remains pending. If any read, permission check, update, or verification fails, stop without retrying or rolling back automatically. Report which comments were verified as updated, which remain unchanged, and which have unknown status. Explain when `Pull requests: write` permission is required.
