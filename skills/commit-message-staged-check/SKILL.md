---
name: commit-message-staged-check
description: Draft a Conventional Commits–style message from the current staged diff only. Use when a user asks for a commit message; inspect staged changes, never commit, avoid numeric specifics unless they are the change itself.
---

# commit-message

現在ステージングした内容を確認し、コミットメッセージを考える。

コミットメッセージを提案するのみで、コミットはしない。

## ルール

- 必ずステージング内容を実際に確認する。推測ではなく、実際に確認する。
- **具体的な設定値（px、rem、gap、padding などの数値）は含めない**
  - 変更の意図や目的を記述する
  - 例外：その変更の本質が設定値の変更である場合（例：フォントサイズの調整、余白の微調整など）
- 変更内容を簡潔に説明する
- 文頭は大文字で始める
- 過去のコミットメッセージを参考にする
- Ticket ID は含めない
- `feat:` のように適切な prefix を使用する
- @が含まれる場合はバッククオートで囲む
