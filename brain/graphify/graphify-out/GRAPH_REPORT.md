# Graph Report - graphify  (2026-11-21)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 192 nodes · 327 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3179e2c8`
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `next` - 15 edges
3. `getSupabaseConfig()` - 11 edges
4. `lucide-react` - 10 edges
5. `createSupabaseServerClient()` - 8 edges
6. `buttonVariants` - 8 edges
7. `getCurrentUser` - 8 edges
8. `color()` - 7 edges
9. `text()` - 7 edges
10. `cn` - 7 edges

## Surprising Connections (you probably didn't know these)
- `WelcomePage()` --calls--> `buttonVariants`  [EXTRACTED]
  src/app/page.tsx → src/components/ui/button.tsx
- `DashboardPage()` --calls--> `getCurrentUser`  [EXTRACTED]
  src/app/(app)/inicio/page.tsx → src/lib/supabase/auth.ts
- `SignUpPage()` --calls--> `getSupabaseConfig()`  [EXTRACTED]
  src/app/(auth)/cadastro/page.tsx → src/lib/supabase/config.ts
- `SignInPage()` --calls--> `getSupabaseConfig()`  [EXTRACTED]
  src/app/(auth)/entrar/page.tsx → src/lib/supabase/config.ts
- `DashboardPage()` --calls--> `buttonVariants`  [EXTRACTED]
  src/app/(app)/inicio/page.tsx → src/components/ui/button.tsx

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (24): eslintConfig, name, private, scripts, build, dev, lint, start (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (15): class-variance-authority, cn, radix-ui, react, DashboardPage(), days, EmptyState(), Badge() (+7 more)

### Community 2 - "Community 2"
Cohesion: 0.15
Nodes (19): react-dom, server-only, AppLayout(), ProfilePage(), signIn(), signOut(), signUp(), errors (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (20): base(), box(), circle(), color(), label(), line(), logo(), mark() (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.20
Nodes (10): nextConfig, lucide-react, next, dynamic, benefits, WelcomePage(), AppNavigation(), items (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (12): dependencies, class-variance-authority, cn, lucide-react, next, radix-ui, react, react-dom (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, postcss, shadcn, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.40
Nodes (3): src_app_globals, metadata, viewport

## Knowledge Gaps
- **88 isolated node(s):** `eslintConfig`, `name`, `private`, `build`, `dev` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 105 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Community 6` to `Community 0`, `Community 1`, `Community 2`, `Community 9`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 7` to `Community 0`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 8` to `Community 0`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `name`, `private` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._