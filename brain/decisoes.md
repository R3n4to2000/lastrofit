# Decisões

- 2026-11-21: iniciar com Next.js App Router, TypeScript, Tailwind 4 e shadcn/ui no mesmo projeto.
- 2026-11-21: usar Supabase Auth via `@supabase/ssr` somente no servidor e variáveis `SUPABASE_URL`/`SUPABASE_PUBLISHABLE_KEY`, sem credenciais no repositório.
- 2026-11-21: exibir uma prévia explícita e estados vazios quando não houver Supabase; não simular treinos ou progresso.
- 2026-11-21: manter páginas como Server Components e limitar Client Components à navegação ativa e ao estado do botão de envio.
- 2026-11-21: usar PostCSS e Webpack para compilação; o pipeline Turbopack gerado pelo scaffold falhou ao iniciar o worker de CSS neste ambiente.
- 2026-11-21: forçar renderização dinâmica da área interna para validar sessão por requisição, inclusive quando o build ocorre sem variáveis Supabase.
- 2026-11-21: produzir o brandbook visual da direção criativa "Tração" como proposta para validação, sem aplicar a identidade ao aplicativo nesta etapa.
- 2026-11-21: integrar Graphify como ferramenta de desenvolvimento local, com skill versionada em `.agents/skills/graphify/` e grafo do código em `brain/graphify/graphify-out/`; a primeira extração usa apenas AST, sem IA externa.
- 2026-11-21: criar migração inicial das dez entidades com RLS padrão restritivo, `admin_users` protegido e vínculos compostos por usuário; escrita de planos, catálogo, IA e assinatura fica reservada ao backend/administração.
- 2026-11-21: usar e-mails SSR com `token_hash` para confirmação e recuperação; exigir autodeclaração de maioridade no cadastro e não armazenar chave privilegiada no app.
- 2026-11-23: nos testes RLS, executar a tentativa de `UPDATE` em comando próprio e conferir o valor persistido como administrador; aceitar o erro do gatilho de integridade quando ele rejeitar uma série antes da política de `INSERT`.
- 2026-11-23: manter `supabase/.temp/` e `supabase/.branches/` fora do Git; preservar migrações, testes, templates, configuração e snippets legítimos ao reescrever o único commit local bloqueado pelo push protection.
