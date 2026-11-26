# Banco e acesso

A migração `migrations/20261121000100_initial_auth_schema.sql` cria as dez tabelas de domínio, `admin_users` e funções no schema `private`. Execute-a em um projeto Supabase de desenvolvimento antes de usar o cadastro. Ela não cria catálogo, treinos, cobrança ou IA. Não a aplique automaticamente a um banco compartilhado sem revisar o estado e o backup.

A migração aditiva `migrations/20261125000100_exercise_library.sql` acrescenta `common_mistakes`, índices para o catálogo aprovado e `exercise_substitutions` com chaves estrangeiras, restrição contra auto substituição e RLS. Não altera as dez tabelas de treino existentes nem publica exercícios. `authenticated` vê apenas relações aprovadas cujo exercício de origem e substituto também estão aprovados; `anon` não recebe acesso. A escrita exige conexão administrativa. A aprovação de exercício e de cada relação é uma decisão separada após revisão profissional.

A migração seguinte, `migrations/20261125000200_publish_demo_exercises.sql`, importa e aprova em uma transação os quatro exemplos próprios e as duas relações cuja publicação foi autorizada pelo responsável em 2026-11-25. Ela exige IDs sem colisão e aborta se encontrar conteúdo já aprovado ou contagens inesperadas. Aplique as migrações na ordem versionada; os SVGs são servidos pelo app e precisam estar presentes no deploy da mesma versão.

## Importação do catálogo

`data/demo-exercises.json` e os SVGs em `public/media/exercises/` são conteúdo ilustrativo próprio, sem licença externa. O lote inicial foi autorizado para publicação; isso não aprova lotes futuros. Valide com `npm run import:exercises -- data/demo-exercises.json`. `--out data/import-preview.sql` gera SQL transacional de rascunhos para revisão e aplicação manual; o gerador não acessa o banco nem inclui `approved_at`. Ele verifica IDs, campos permitidos, valores dos filtros, conteúdo, mídias locais, referências e duplicações. Um lote com ID já aprovado é recusado pelo SQL antes de qualquer alteração. O arquivo de saída é criado sem sobrescrever outro arquivo. Não aplique novos lotes em banco compartilhado sem autorização. A mídia em Storage público é resolvida por `src/lib/exercises/media.ts`; a importação atual aceita somente arquivos SVG locais próprios.

## Políticas

| Dados | `authenticated` | Administração/backend |
| --- | --- | --- |
| `profiles` | Lê o próprio perfil e atualiza apenas `full_name` | Lê todos; cria perfil no gatilho de `auth.users` |
| `exercises`, `workout_templates`, `workout_template_exercises` | Lê somente conteúdo aprovado | Lê rascunhos; escrita com conexão administrativa |
| `exercise_substitutions` | Lê somente relação aprovada entre dois exercícios aprovados | Lê rascunhos; escrita com conexão administrativa |
| `user_workout_plans`, `scheduled_workouts` | Lê apenas os próprios | Cria e altera planos e agenda após revisão |
| `workout_sessions`, `exercise_set_logs` | Lê e registra apenas os próprios, respeitando vínculos e limites | Lê todos; pode reconciliar registros |
| `ai_conversations`, `subscriptions` | Lê apenas os próprios; sem escrita direta | Escrita apenas pelo backend, quando essas etapas existirem |
| `admin_users` | Sem leitura ou escrita direta | Manutenção exclusiva por conexão administrativa |

`anon` não recebe acesso às tabelas. `private.is_admin()` consulta `admin_users` com `security definer` e `search_path` fixo; o schema `private` não deve ser exposto na Data API. Só um operador com acesso administrativo ao banco deve adicionar/remover membros de `admin_users`. Não derive permissões de `raw_user_meta_data`, que o próprio usuário pode alterar. A chave `service_role` ignora RLS e **não pode** ir para o cliente ou para variáveis `NEXT_PUBLIC_*`.

Chaves estrangeiras compostas impedem que agenda, sessão e registro de séries referenciem linhas de outra conta. O gatilho de séries também confere se o exercício e o número da série pertencem ao modelo agendado. Há uma única sessão por treino agendado. Índices cobrem usuário/data, catálogo aprovado e expiração de conversas. `ai_conversations.expires_at` marca retenção de 30 dias; a exclusão periódica ainda precisa de rotina operacional antes da etapa de IA.

## Auth e recuperação

Defina `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` e `APP_URL` no ambiente do servidor; copie apenas os nomes de `.env.example`. O ambiente local está configurado em `config.toml`, com confirmação de e-mail e templates em `templates/`. No painel Supabase Auth hospedado, defina **Site URL** igual a `APP_URL` e cadastre a URL exata `${APP_URL}/auth/verificar` em **Redirect URLs**. O `APP_URL` deve apontar para a mesma origem que o usuário abre no navegador. O modelo padrão do Supabase hospedado usa `ConfirmationURL`; a recuperação no app recebe os tokens no fragmento do navegador, remove o fragmento da barra de endereço e cria a sessão no servidor antes de abrir `/redefinir-senha`. Solicite um **novo** e-mail após alterar a configuração: links anteriores continuam com o destino antigo ou já foram consumidos.

Se o projeto hospedado permitir modelos personalizados, copie os modelos SSR equivalentes para o painel:

- Confirmação: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
- Recuperação: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`.

O endpoint também aceita `code` PKCE. Links com `token_hash` passam por uma página que exige um clique antes de consumir o token, para evitar pré-visualizações automáticas de e-mail. O modelo padrão hospedado valida o link diretamente no Supabase antes de retornar ao app; quando for possível personalizar o modelo de e-mail, prefira `token_hash` para proteger também essa etapa contra verificadores automáticos de links. Um link válido de recuperação cria sessão temporária e leva a `/redefinir-senha`; após trocar a senha, o usuário sai da sessão. A resposta de solicitação é igual para e-mails existentes e desconhecidos. Configure limites de envio e proteção contra abuso no Auth/provedor de e-mail. O cadastro exige declaração de maioridade; ela é uma autodeclaração, não verificação documental.

## Testes

Com Supabase local e Docker ativos, execute `supabase start`, `supabase db reset` **somente em ambiente descartável** e `supabase test db`. `tests/database/rls_test.sql` usa três identidades fictícias em transação com rollback e verifica acesso entre contas, leitura de rascunhos, elevação administrativa, escrita proibida e chaves compostas. `tests/database/exercise_library_test.sql` verifica visibilidade de exercícios/substitutos, administração, escrita negada, acesso anônimo e a restrição contra auto substituição. O comando `db reset` destrói dados locais; não o execute em banco compartilhado. Execute também `npm run test:import` para a validação do importador.

Faça também o teste de fluxo com duas contas de teste: cadastrar e confirmar e-mail, entrar, sair, solicitar recuperação, abrir o link e trocar a senha. Tente consultar o perfil da outra conta pela API com o token da primeira; a consulta deve retornar zero linhas. Esses fluxos dependem de um projeto Supabase e de e-mail configurados.
