# Lastrofit

Base de um SaaS de orientação de treinos para iniciantes. A interface mobile-first usa Supabase Auth e há migrações PostgreSQL com RLS. **Não há geração de treinos, pagamentos nem chamadas de IA.**

## Stack

- Next.js 16 (App Router), React 19 e TypeScript
- Tailwind CSS 4 e componentes shadcn/ui
- Supabase Auth e PostgreSQL com migrações e RLS

## Começar

Execute npm install, copie .env.example para .env.local e inicie com npm run dev. No PowerShell, use Copy-Item .env.example .env.local.

Preencha SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY e APP_URL com os valores do seu projeto e ambiente. Aplique a migração de `supabase/migrations/` em ambiente de desenvolvimento. Sem Supabase, o aplicativo mostra uma **prévia da interface** e desabilita login e cadastro. Nenhuma credencial foi incluída no repositório.

Configure no Supabase Auth a URL do site e os templates SSR de confirmação/recuperação, conforme [supabase/README.md](supabase/README.md). Se a confirmação de e-mail estiver ativa, o usuário deve confirmá-lo antes de entrar. Para produção, configure HTTPS e as URLs reais no painel do Supabase.

## Rotas

| Rota | Função |
| --- | --- |
| / | Boas-vindas |
| /entrar | Login |
| /cadastro | Cadastro |
| /recuperar-senha | Solicitação de link de recuperação |
| /redefinir-senha | Nova senha após confirmação do link |
| /auth/confirm | Confirmação de e-mail e recuperação |
| /inicio | Área inicial |
| /semana | Visualização semanal vazia |
| /perfil | Dados da conta |

Com Supabase configurado, /inicio, /semana e /perfil exigem sessão. Sem configuração, ficam acessíveis como prévia, com aviso visível.

## Arquitetura

src/app/(auth) contém as telas públicas e Server Actions de autenticação. src/app/(app) contém o layout e as telas internas. src/components/ui guarda componentes shadcn/ui locais; os demais arquivos em src/components compõem a interface. src/lib/supabase encapsula configuração, cliente com cookies e consulta do usuário. src/proxy.ts atualiza a sessão e protege rotas.

As páginas são Server Components por padrão. A navegação ativa e o botão com estado de envio são Client Components pequenos. Login, cadastro, saída e recuperação usam Server Actions. O cliente Supabase só é criado no servidor com variáveis **sem** prefixo NEXT_PUBLIC_; nenhuma chave é enviada deliberadamente ao JavaScript do navegador. A chave publishable não substitui as políticas RLS. As tabelas de treinos estão preparadas, mas ainda não há conteúdo aprovado nem fluxos de prescrição.

O tema usa tokens CSS semânticos (cores, bordas e raio) em src/app/globals.css. Os componentes de src/components/ui pertencem ao projeto e podem ser ajustados. A organização por domínio em app e lib permite extrair regras de negócio para um pacote compartilhado quando houver app React Native.

## Verificações

Execute npm run lint, npm run typecheck e npm run build. O build usa Webpack e PostCSS devido a uma falha do worker Turbopack neste ambiente. A suíte SQL de RLS roda com `supabase test db` em Supabase local; veja [supabase/README.md](supabase/README.md). O fluxo real de e-mail precisa de projeto Supabase configurado.

## Mapa do código com Graphify

O grafo local fica em `brain/graphify/graphify-out/`. Abra `graph.html` para explorar as relações ou consulte pelo terminal:

```powershell
graphify query "Quais arquivos participam da autenticação Supabase?" --graph brain/graphify/graphify-out/graph.json
```

Para reconstruir o grafo após alterações no código, execute `graphify extract . --code-only --out brain/graphify` e `graphify cluster-only brain/graphify --no-label`. A skill do Graphify está em `.agents/skills/graphify/`. Veja [brain/graphify/README.md](brain/graphify/README.md) para instalação da CLI e limites da extração.

## Próximas etapas

- Configurar projeto Supabase e validar login/cadastro com e-mail real.
- Definir modelo de dados, migrações e RLS para perfil e treinos.
- Planejar orientação e acompanhamento de treinos com requisitos de segurança e validação profissional.
- Adicionar testes de integração e acessibilidade para os fluxos reais.
