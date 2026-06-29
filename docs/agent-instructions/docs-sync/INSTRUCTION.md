# Docs Sync Instruction (Agent-Agnostic)

## Purpose
Keep repository documentation aligned with actual repository state after changes.

This instruction is designed to work with any coding agent (Copilot CLI, OpenCode, OpenClaw, or others). It defines behavior and checks, not tool-specific commands.

## When to run
Run this instruction at the end of any change that can affect documentation, including:
- new/removed/renamed files and directories
- changes to workflows, build behavior, commands, or dependencies
- new features, katas, or user-facing behavior
- changes to contribution flow, issue templates, release/changelog conventions

## Required process
1. **Read current docs first**
   - At minimum: `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, and any touched area docs.

2. **Inspect current repo state**
   - Confirm what actually changed in code/config/workflows/files.

3. **Detect documentation drift**
   - Identify statements, examples, tables, links, badges, paths, or commands that are now outdated/incomplete.

4. **Apply bounded doc updates**
   - Edit only documentation files needed to resolve identified drift.
   - Keep wording concise and factual.
   - Do not make unrelated editorial rewrites.

5. **Prepare docs-impact summary**
   - For PR or final report, include one of:
     - `docs updated: <files>` with short reason, or
     - `no docs changes needed: <reason>`

## Safety rules
- Prefer small, reviewable doc diffs.
- Preserve repository conventions and terminology.
- If uncertain whether docs should change, prefer updating with a short explicit note.
- Keep non-doc files out of docs-sync commits/PRs.

## PR guidance
- Include documentation updates in the same feature PR when practical, or open a dedicated docs PR when that is cleaner.
- If using a dedicated docs PR, use a docs-focused branch name (example: `docs/sync-<topic>`).
- If using a dedicated docs PR, use a docs-focused PR title (example: `docs: sync README with CI behavior`).
- Include drift evidence and updated files in PR body (for mixed or docs-only PRs).
- Reuse `docs/agent-instructions/docs-sync/PR_TEMPLATE.md` as the PR body checklist.
