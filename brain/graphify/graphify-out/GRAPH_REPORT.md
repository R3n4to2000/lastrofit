# Graph Report - graphify  (2026-11-25)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 271 nodes · 546 edges · 13 communities (12 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f4a9e6d2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12

## God Nodes (most connected - your core abstractions)
1. `next` - 25 edges
2. `createSupabaseServerClient()` - 18 edges
3. `getSupabaseConfig()` - 16 edges
4. `compilerOptions` - 16 edges
5. `lucide-react` - 14 edges
6. `buttonVariants` - 10 edges
7. `getCurrentUser` - 10 edges
8. `react` - 9 edges
9. `Badge()` - 8 edges
10. `scripts` - 8 edges

## Surprising Connections (you probably didn't know these)
- `RecoveryPage()` --calls--> `getSupabaseConfig()`  [EXTRACTED]
  src/app/(auth)/recuperar-senha/page.tsx → src/lib/supabase/config.ts
- `ResetPasswordPage()` --calls--> `getCurrentUser`  [EXTRACTED]
  src/app/(auth)/redefinir-senha/page.tsx → src/lib/supabase/auth.ts
- `ExercisesPage()` --calls--> `buttonVariants`  [EXTRACTED]
  src/app/(app)/exercicios/page.tsx → src/components/ui/button.tsx
- `getExercise()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  src/lib/exercises/catalog.ts → src/lib/supabase/server.ts
- `getSubstitutes()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  src/lib/exercises/catalog.ts → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (13 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (32): data_demo_exercises, data_exercise_options, ExerciseDetailPage(), ExercisesPage(), metadata, ExerciseCard(), ExerciseMedia(), Badge() (+24 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (30): eslintConfig, name, private, scripts, build, dev, import:exercises, lint (+22 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (13): lucide-react, DashboardPage(), days, benefits, WelcomePage(), Brand(), EmptyState(), Button() (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (12): nextConfig, next, completeImplicitRecovery(), verifyEmailLink(), metadata, RecoveryFragment(), src_app_globals, metadata (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (16): server-only, AppLayout(), dynamic, ProfilePage(), appUrl(), requestPasswordReset(), signIn(), signOut() (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (20): base(), box(), circle(), color(), label(), line(), logo(), mark() (+12 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.26
Nodes (11): cn, react, errors, errors, notices, RecoveryPage(), ResetPasswordPage(), AuthShell() (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (16): ref_node_assert, ref_node_fs, ref_node_path, ref_node_test, ref_node_url, allowed, buildImportSql(), fields (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (12): dependencies, class-variance-authority, cn, lucide-react, next, radix-ui, react, react-dom (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, postcss, shadcn, supabase, tailwindcss, @tailwindcss/postcss (+4 more)

## Knowledge Gaps
- **105 isolated node(s):** `CatalogFilters`, `ExerciseDetail`, `RawFilters`, `MediaInput`, `MediaProvider` (+100 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 131 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Community 3` to `Community 0`, `Community 1`, `Community 2`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Community 2` to `Community 0`, `Community 1`, `Community 3`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 10` to `Community 1`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `CatalogFilters`, `ExerciseDetail`, `RawFilters` to the rest of the system?**
  _105 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11794871794871795 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.11462450592885376 - nodes in this community are weakly interconnected._