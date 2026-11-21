# Lastrofit

Base de um SaaS de orientação de treinos para iniciantes. Esta etapa entrega a interface mobile-first, autenticação preparada com Supabase e áreas vazias para a futura experiência de treinos. **Não há geração de treinos, pagamentos nem chamadas de IA.**

## Stack

- Next.js 16 (App Router), React 19 e TypeScript
- Tailwind CSS 4 e componentes shadcn/ui
- Supabase Auth; PostgreSQL será a persistência quando o domínio de treinos for definido

## Começar

Execute npm install, copie .env.example para .env.local e inicie com npm run dev. No PowerShell, use Copy-Item .env.example .env.local.

Preencha SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY com os valores do seu projeto Supabase. Sem essas variáveis, o aplicativo mostra uma **prévia da interface** e desabilita login e cadastro. Nenhuma credencial foi incluída no repositório.

Configure no Supabase Auth a URL do site (http://localhost:3000 em desenvolvimento) e as URLs de redirecionamento desejadas. Se a confirmação de e-mail estiver ativa, o usuário deve confirmá-lo antes de entrar. Para produção, configure HTTPS e as URLs reais no painel do Supabase.

## Rotas

| Rota | Função |
| --- | --- |
| / | Boas-vindas |
| /entrar | Login |
| /cadastro | Cadastro |
| /inicio | Área inicial |
| /semana | Visualização semanal vazia |
| /perfil | Dados da conta |

Com Supabase configurado, /inicio, /semana e /perfil exigem sessão. Sem configuração, ficam acessíveis como prévia, com aviso visível.

## Arquitetura

src/app/(auth) contém as telas públicas e Server Actions de autenticação. src/app/(app) contém o layout e as telas internas. src/components/ui guarda componentes shadcn/ui locais; os demais arquivos em src/components compõem a interface. src/lib/supabase encapsula configuração, cliente com cookies e consulta do usuário. src/proxy.ts atualiza a sessão e protege rotas.

As páginas são Server Components por padrão. A navegação ativa e o botão com estado de envio são Client Components pequenos. Login, cadastro e saída usam Server Actions. O cliente Supabase só é criado no servidor com variáveis **sem** prefixo NEXT_PUBLIC_; nenhuma chave é enviada deliberadamente ao JavaScript do navegador. A chave publishable não substitui políticas de Row Level Security (RLS). Antes de armazenar dados de treinos, criar schema, migrações e políticas RLS no PostgreSQL.

O tema usa tokens CSS semânticos (cores, bordas e raio) em src/app/globals.css. Os componentes de src/components/ui pertencem ao projeto e podem ser ajustados. A organização por domínio em app e lib permite extrair regras de negócio para um pacote compartilhado quando houver app React Native.

## Verificações

Execute npm run lint, npm run typecheck e npm run build. O build usa Webpack e PostCSS devido a uma falha do worker Turbopack neste ambiente. Ainda não existe suíte de testes automatizados nesta base. A primeira suíte deve cobrir os fluxos de autenticação e as regras de domínio quando o backend for configurado.

## Próximas etapas

- Configurar projeto Supabase e validar login/cadastro com e-mail real.
- Definir modelo de dados, migrações e RLS para perfil e treinos.
- Planejar orientação e acompanhamento de treinos com requisitos de segurança e validação profissional.
- Adicionar testes de integração e acessibilidade para os fluxos reais.
