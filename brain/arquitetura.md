# Arquitetura

Aplicação Next.js App Router em `src/app`, com grupos `(auth)` e `(app)`. Componentes reutilizáveis em `src/components`; primitivas shadcn/ui em `src/components/ui`. Supabase Auth fica encapsulado em `src/lib/supabase`, acessado no servidor. `src/proxy.ts` atualiza sessão e protege rotas privadas quando a configuração existe. Sem variáveis, as telas internas são prévias com estados vazios.

O tema é definido por tokens CSS em `src/app/globals.css` e compilado com PostCSS/Webpack. A navegação usa barra inferior no mobile e lateral em telas grandes. O layout interno é dinâmico para revalidar a sessão a cada requisição. Ainda não há tabelas, migrações ou dados de treino.
