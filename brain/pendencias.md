# Pendências

- Exigir prova de recuperação recente ou reautenticação para atualizar a senha; hoje qualquer sessão válida abre `/redefinir-senha` e pode chamar `updatePassword`.
- Antes de ativar planos e execução, definir integridade de datas da agenda e imutabilidade de sessões concluídas.
- Revisar política de retenção e rotina de exclusão para `ai_conversations` antes de ativar IA.
- Definir requisitos clínicos e de produto antes de criar orientação de treinos.
- Avaliar compartilhamento de domínio com o futuro aplicativo React Native.
- Acompanhar atualizações do CLI shadcn e seus avisos moderados de dependências de desenvolvimento (audit de produção sem vulnerabilidades).
- Validar com o responsável pela marca a direção "Tração", o símbolo em L, o logotipo, a paleta e as aplicações do brandbook antes de adotá-los como padrão oficial.
- Testar reconhecimento e similaridade do símbolo, legibilidade da assinatura em tamanho pequeno e contraste nos protótipos finais antes de produzir os assets definitivos.
- Avaliar extração SQL no Graphify quando houver necessidade de mapear migrações: a CLI atual não tem `tree_sitter_sql`. Extração semântica de documentos continua opcional e requer backend/autorização apropriados.
- Publicar a versão do aplicativo com os quatro SVGs em `public/media/exercises/` para que a mídia referenciada pelas linhas do catálogo hospedado esteja disponível fora do ambiente local.
