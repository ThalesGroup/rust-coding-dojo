# Academy — Arbre de compétences live from user progress

## Context

`TreeScreen` currently renders from hard-coded `SKILL_NODES`.  
User progress is already persisted in local storage/IndexedDB via `AppContext` + `store/progress.ts`.

Goal: make the tree reflect real progress of the current user, while staying compatible with other screens that also read/write local storage progress.

## Scope

- In scope:
  - Compute live node completion and unlock state in `TreeScreen`
  - Use existing progress state (`katasCompleted`) as source of truth
  - Preserve existing UI layout/styling and interactions
- Out of scope:
  - New persistence schema
  - New backend
  - Refactoring other screens

## Confirmed product decisions

1. Unlock model: global progression unlock chain
2. Node progress: strictly completed katas (`katasCompleted / katasTotal`)
3. Unlock threshold: next concept unlocks only when previous is 100% complete
4. Fresh user: only `bases` unlocked initially
5. Implementation approach: compute dynamic tree state directly in `TreeScreen`

## Architecture and components

- Keep `progress` from `useApp()` as the single source of truth.
- In `TreeScreen`, derive a runtime node list from:
  - static presentation/layout data (`SKILL_NODES`: position, icon, color, description)
  - kata metadata grouped by concept
  - `progress.katasCompleted`
- Do not persist derived tree state; it is deterministic and recalculated on render.

## Data flow

1. Read `progress` from `AppContext`.
2. Build per-concept stats:
   - `katasTotal` from kata catalog
   - `katasCompleted` by intersecting concept katas with `progress.katasCompleted`
3. Apply unlock chain order:
   - `bases -> ownership -> borrowing -> lifetimes -> structs -> traits -> generics -> concurrency -> macros -> unsafe`
   - `bases` always unlocked
   - each next node unlocked only if all previous nodes are fully complete
4. Render computed nodes in existing tree UI.
5. Node details panel reads the computed selected node.
6. Initial selected node = first unlocked node that is not complete; fallback to `bases`.

## Error handling and resilience

- If progress is unavailable/corrupt, use safe defaults already provided by progress loading.
- If a concept has no katas, treat totals as `0` and display `0/0` without crashing.
- If selected node becomes locked after recompute, reset selection to fallback unlocked node.

## Testing strategy

- Add targeted tests for pure computation rules:
  - per-concept completed counts
  - unlock chain behavior
  - fresh-user behavior (`bases` only unlocked)
  - 100% gate for unlocking next concept
- Keep UI tests minimal; rely on existing rendering and class logic with derived data.

## Success criteria

- Tree screen no longer depends on hard-coded completion/unlock values.
- Progress shown in tree is consistent with `progress.katasCompleted`.
- Unlock behavior follows agreed global chain and 100% rule.
- No schema change is required for local storage/IndexedDB progress.
