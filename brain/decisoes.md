# Decisões

- 2026-11-21: iniciar com Next.js App Router, TypeScript, Tailwind 4 e shadcn/ui no mesmo projeto.
- 2026-11-21: usar Supabase Auth via `@supabase/ssr` somente no servidor e variáveis `SUPABASE_URL`/`SUPABASE_PUBLISHABLE_KEY`, sem credenciais no repositório.
- 2026-11-21: exibir uma prévia explícita e estados vazios quando não houver Supabase; não simular treinos ou progresso.
- 2026-11-21: manter páginas como Server Components e limitar Client Components à navegação ativa e ao estado do botão de envio.
- 2026-11-21: usar PostCSS e Webpack para compilação; o pipeline Turbopack gerado pelo scaffold falhou ao iniciar o worker de CSS neste ambiente.
- 2026-11-21: forçar renderização dinâmica da área interna para validar sessão por requisição, inclusive quando o build ocorre sem variáveis Supabase.
- 2026-11-21: produzir o brandbook visual da direção criativa "Tração" como proposta para validação, sem aplicar a identidade ao aplicativo nesta etapa.
