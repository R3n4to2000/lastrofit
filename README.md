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
| /auth/verificar | Validação do retorno do e-mail hospedado |
| /inicio | Área inicial |
| /exercicios | Biblioteca com busca e filtros |
| /exercicios/[id] | Instruções, mídia e substitutos aprovados |
| /semana | Visualização semanal vazia |
| /perfil | Dados da conta |

Com Supabase configurado, /inicio, /exercicios, /semana e /perfil exigem sessão. Sem configuração, ficam acessíveis como prévia, com aviso visível.

## Biblioteca de exercícios

A biblioteca consulta apenas exercícios aprovados pelo Supabase, com busca por nome, filtros por grupo muscular, equipamento e dificuldade e páginas de 12 itens. O detalhe mostra instruções, erros comuns, precauções e substitutos que também foram aprovados. Mídias ausentes têm alternativa textual. As consultas são feitas no servidor e a tabela tem RLS; aprovação e escrita exigem acesso administrativo ao banco.

Em desenvolvimento, `/exercicios?preview=1` mostra quatro exemplos próprios com SVGs ilustrativos em `public/media/exercises/`. O responsável confirmou a revisão e autorizou a publicação deste lote em 2026-11-25. A migração `20261125000200_publish_demo_exercises.sql` importa e aprova somente esses quatro exercícios e duas relações, após a migração do esquema. As ilustrações continuam simplificadas e não constituem prescrição individual. A camada `src/lib/exercises/media.ts` resolve a mídia local e já isola a futura origem em Supabase Storage público; novas origens podem ser acrescentadas ali sem mudar as páginas.

Para validar um lote JSON futuro, execute `npm run import:exercises -- data/demo-exercises.json`. Para gerar SQL transacional de rascunhos, execute `npm run import:exercises -- data/demo-exercises.json --out data/import-preview.sql`. O comando não se conecta ao banco e não aprova conteúdo. Revise o SQL e aplique-o manualmente somente em ambiente autorizado, após a migração da biblioteca. Novos lotes ainda exigem revisão profissional antes da aprovação. Veja [supabase/README.md](supabase/README.md).

## Arquitetura

src/app/(auth) contém as telas públicas e Server Actions de autenticação. src/app/(app) contém o layout e as telas internas. src/components/ui guarda componentes shadcn/ui locais; os demais arquivos em src/components compõem a interface. src/lib/supabase encapsula configuração, cliente com cookies e consulta do usuário. src/proxy.ts atualiza a sessão e protege rotas.

As páginas são Server Components por padrão. A navegação ativa e o botão com estado de envio são Client Components pequenos. Login, cadastro, saída e recuperação usam Server Actions. O cliente Supabase só é criado no servidor com variáveis **sem** prefixo NEXT_PUBLIC_; nenhuma chave é enviada deliberadamente ao JavaScript do navegador. A chave publishable não substitui as políticas RLS. As tabelas de treinos estão preparadas, mas ainda não há modelos de treino aprovados nem fluxos de prescrição.

O tema usa tokens CSS semânticos (cores, bordas e raio) em src/app/globals.css. Os componentes de src/components/ui pertencem ao projeto e podem ser ajustados. A organização por domínio em app e lib permite extrair regras de negócio para um pacote compartilhado quando houver app React Native.

## Verificações

Execute npm run lint, npm run typecheck, npm run test:import e npm run build. O build usa Webpack e PostCSS devido a uma falha do worker Turbopack neste ambiente. A suíte SQL de RLS roda com `supabase test db` em Supabase local; veja [supabase/README.md](supabase/README.md). O fluxo real de e-mail precisa de projeto Supabase configurado.

## Mapa do código com Graphify

O grafo local fica em `brain/graphify/graphify-out/`. Abra `graph.html` para explorar as relações ou consulte pelo terminal:

```powershell
graphify query "Quais arquivos participam da autenticação Supabase?" --graph brain/graphify/graphify-out/graph.json
```

Para reconstruir o grafo após alterações no código, execute `graphify extract . --code-only --out brain/graphify` e `graphify cluster-only brain/graphify --no-label`. A skill do Graphify está em `.agents/skills/graphify/`. Veja [brain/graphify/README.md](brain/graphify/README.md) para instalação da CLI e limites da extração.

## Próximas etapas

- Publicar a versão do app que inclui os quatro SVGs locais antes de testar a mídia do catálogo hospedado.
- Planejar orientação e acompanhamento de treinos com requisitos de segurança e validação profissional.
- Adicionar testes de integração e acessibilidade para os fluxos reais.
