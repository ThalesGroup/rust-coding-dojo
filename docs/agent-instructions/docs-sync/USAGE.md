# Docs Sync Usage Guide (Any Agent)

Canonical instruction: `docs/agent-instructions/docs-sync/INSTRUCTION.md`

## Quick usage flow
1. Complete your functional/code/config changes.
2. Run the docs-sync instruction with your agent.
3. Review and apply documentation updates.
4. Commit docs updates.
5. Include docs impact summary in your PR (mixed or docs-only) using `docs/agent-instructions/docs-sync/PR_TEMPLATE.md`.

## Invocation
Use a generic prompt with your agent:

- "Apply the repository docs-sync instruction at `docs/agent-instructions/docs-sync/INSTRUCTION.md` before finalizing. Detect and fix documentation drift, then report docs impact."

## Completion gate (mandatory)
Before marking work complete, include:
- `docs updated: <file list> — <reason>` **or**
- `no docs changes needed: <explicit reason>`

If this line is missing, docs-sync was not completed.
