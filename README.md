# skills

Personal agent skills repository for Codex and other tools that support the open agent skills format.  
Install with [`gh skill`](https://cli.github.com/manual/gh_skill) or [`vercel-labs/skills`](https://github.com/vercel-labs/skills).

## Install

Per-project install:

```bash
gh skill install ryoheinan/skills --all --scope project
npx skills add ryoheinan/skills
```

Global install:

```bash
gh skill install ryoheinan/skills --all --scope user
npx skills add ryoheinan/skills -g
```

## Update

Installed skills:

```bash
gh skill update --all
npx skills update
```

## Release

Validate and publish:

```bash
pnpm check
gh skill publish --dry-run
gh skill publish
```
