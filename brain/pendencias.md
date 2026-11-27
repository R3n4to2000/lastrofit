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
- Produzir e validar textos pt-BR para os 862 exercícios que permanecem rascunhos; cinco não têm instruções na fonte. Publicar individualmente após revisão do conteúdo efetivamente produzido.
- Completar e revisar os campos de erros comuns/precauções dos 14 exercícios publicados; o lote de traduções fornecia apenas nome e instruções curtas.
- Registrar decisões individuais sobre os 55 pares de equivalência sugeridos antes de criar substituições; similaridade de nomes não é aprovação de troca de movimento.
- Encontrar ou produzir fotos e demonstrações reais com licença comercial para exercícios sem vídeo; conferir direitos por item no wger, se ele for utilizado. Medir tráfego e cache dos 14 vídeos CC0 já espelhados antes de ampliar a mídia.
- A revisão visual em dispositivos e redes reais foi informada pelo responsável em 2026-11-26, mas não foi reproduzida nesta execução. Verificar a versão implantada do frontend após o deploy para confirmar reprodução e filtros com os dados novos.
