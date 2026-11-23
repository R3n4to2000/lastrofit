# Banco e acesso

A migração `migrations/20261121000100_initial_auth_schema.sql` cria as dez tabelas de domínio, `admin_users` e funções no schema `private`. Execute-a em um projeto Supabase de desenvolvimento antes de usar o cadastro. Ela não cria catálogo, treinos, cobrança ou IA. Não a aplique automaticamente a um banco compartilhado sem revisar o estado e o backup.

## Políticas

| Dados | `authenticated` | Administração/backend |
| --- | --- | --- |
| `profiles` | Lê o próprio perfil e atualiza apenas `full_name` | Lê todos; cria perfil no gatilho de `auth.users` |
| `exercises`, `workout_templates`, `workout_template_exercises` | Lê somente conteúdo aprovado | Lê rascunhos; escrita com conexão administrativa |
| `user_workout_plans`, `scheduled_workouts` | Lê apenas os próprios | Cria e altera planos e agenda após revisão |
| `workout_sessions`, `exercise_set_logs` | Lê e registra apenas os próprios, respeitando vínculos e limites | Lê todos; pode reconciliar registros |
| `ai_conversations`, `subscriptions` | Lê apenas os próprios; sem escrita direta | Escrita apenas pelo backend, quando essas etapas existirem |
| `admin_users` | Sem leitura ou escrita direta | Manutenção exclusiva por conexão administrativa |

`anon` não recebe acesso às tabelas. `private.is_admin()` consulta `admin_users` com `security definer` e `search_path` fixo; o schema `private` não deve ser exposto na Data API. Só um operador com acesso administrativo ao banco deve adicionar/remover membros de `admin_users`. Não derive permissões de `raw_user_meta_data`, que o próprio usuário pode alterar. A chave `service_role` ignora RLS e **não pode** ir para o cliente ou para variáveis `NEXT_PUBLIC_*`.

Chaves estrangeiras compostas impedem que agenda, sessão e registro de séries referenciem linhas de outra conta. O gatilho de séries também confere se o exercício e o número da série pertencem ao modelo agendado. Há uma única sessão por treino agendado. Índices cobrem usuário/data, catálogo aprovado e expiração de conversas. `ai_conversations.expires_at` marca retenção de 30 dias; a exclusão periódica ainda precisa de rotina operacional antes da etapa de IA.

## Auth e recuperação

Defina `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` e `APP_URL` no ambiente do servidor; copie apenas os nomes de `.env.example`. O ambiente local está configurado em `config.toml`, com confirmação de e-mail e templates em `templates/`. No painel Supabase Auth hospedado, defina **Site URL** igual a `APP_URL` e permita `${APP_URL}/auth/confirm` nas URLs de redirecionamento. Copie os modelos SSR equivalentes para o painel:

- Confirmação: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
- Recuperação: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`.

O endpoint também aceita `code` PKCE. Um link válido de recuperação cria sessão temporária e leva a `/redefinir-senha`; após trocar a senha, o usuário sai da sessão. A resposta de solicitação é igual para e-mails existentes e desconhecidos. Configure limites de envio e proteção contra abuso no Auth/provedor de e-mail. O cadastro exige declaração de maioridade; ela é uma autodeclaração, não verificação documental.

## Testes

Com Supabase local e Docker ativos, execute `supabase start`, `supabase db reset` **somente em ambiente descartável** e `supabase test db`. `tests/database/rls_test.sql` usa três identidades fictícias em transação com rollback e verifica acesso entre contas, leitura de rascunhos, elevação administrativa, escrita proibida e chaves compostas. O comando `db reset` destrói dados locais; não o execute em banco compartilhado.

Faça também o teste de fluxo com duas contas de teste: cadastrar e confirmar e-mail, entrar, sair, solicitar recuperação, abrir o link e trocar a senha. Tente consultar o perfil da outra conta pela API com o token da primeira; a consulta deve retornar zero linhas. Esses fluxos dependem de um projeto Supabase e de e-mail configurados.
