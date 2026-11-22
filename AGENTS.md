# AGENTS.md — LastroFit

> **Instruções permanentes para agentes de código (incluindo Codex).**
> Este arquivo deve ser lido **antes de planejar, implementar, refatorar, testar ou criar qualquer funcionalidade** neste repositório.
> Aplica-se à raiz do projeto e a todos os subdiretórios, salvo instruções mais específicas em arquivos `AGENTS.md` internos, que não podem contrariar requisitos essenciais de segurança e produto aqui definidos.
>
## 1. Visão do produto

**LastroFit** é o nome de trabalho do produto. Trata-se de uma aplicação de orientação de treinos, inicialmente como **web app mobile-first**, com possível evolução futura para aplicativos Android e iOS.

**Problema a resolver:** pessoas que estão começando a treinar, especialmente em academias, frequentemente não sabem qual treino executar, como fazer os movimentos, quantas séries ou repetições seguir, nem como organizar a semana. Interfaces complexas dificultam ainda mais a experiência.

**Proposta de valor:** abrir o LastroFit e entender imediatamente **o que treinar hoje, como executar cada exercício e como acompanhar a conclusão do treino**, sem menus ou configurações desnecessárias.

**Princípios do produto, em ordem de prioridade:**
1. **Simplicidade:** a ação principal de cada tela deve ser óbvia.
2. **Orientação visual:** cada exercício deve ter demonstração prática e instruções objetivas.
3. **Adequação responsável:** rotinas devem considerar contexto do aluno e modelos revisados por profissional habilitado.
4. **Rapidez no celular:** poucos toques, carregamento rápido e leitura fácil durante a academia.
5. **Continuidade:** o aluno deve localizar seu treino semanal, concluí-lo e consultar seu histórico.
6. **IA útil e delimitada:** suporte educativo contextual, não prescrição clínica ou substituição de acompanhamento profissional.

**Público inicial:** adultos iniciantes em musculação e treinamento físico, prioritariamente falantes de português do Brasil. O MVP deve ser concebido para usuários **com 18 anos ou mais** até revisão específica de requisitos, consentimento e segurança para menores.

**Posicionamento desejado:** prático, amigável, acessível, confiável, moderno e pouco intimidador. Evitar visual excessivamente agressivo ou linguagem técnica sem explicação.

**Possível mensagem de marca:** “LastroFit — Treinar ficou simples.” É uma sugestão, não uma decisão final de branding. O nome LastroFit também permanece sujeito à verificação de marca e domínio.

## 2. O que deve funcionar no MVP

### 2.1 Jornada essencial

1. O usuário acessa a aplicação e cria sua conta (ou entra).
2. Preenche um **onboarding curto** com informações necessárias para organizar seu treino.
3. Recebe uma **semana de treinos** associada a modelos aprovados e compatíveis com sua disponibilidade e equipamentos.
4. Abre a tela **Treino de hoje**, com exercícios, séries, repetições e descansos previstos.
5. Toca em um exercício para assistir a uma **demonstração animada** e ler passos curtos de execução.
6. Marca séries/exercícios como realizados e, quando aplicável, registra carga e repetições.
7. Finaliza a sessão e pode consultar o histórico básico.
8. Se tiver dúvidas, aciona o **assistente de IA contextual** para explicações seguras sobre exercícios e uso do app.

### 2.2 Navegação principal

Priorizar **três áreas principais**:
- **Início:** treino de hoje, estado do progresso e ação “Começar/Continuar treino”.
- **Minha semana:** visão simples dos dias, treinos planejados, descanso e sessões concluídas.
- **Perfil:** dados do aluno, preferências, assinatura, privacidade e conta.

Biblioteca de exercícios: acessível pelo treino e, se necessário, por busca simples. Assistente: acesso contextual por botão de ajuda/atalho; evitar criar navegação pesada só para a IA.

### 2.3 Cadastro e onboarding

Campos previstos, sujeitos à necessidade e revisão de produto:
- Nome, e-mail e mecanismo seguro de autenticação.
- Idade ou data de nascimento/faixa etária, com validação de público adulto.
- Peso e altura como **dados de referência**, não como determinantes automáticos de prescrição.
- Objetivo principal: por exemplo, ganho de massa muscular, emagrecimento ou condicionamento.
- Experiência: iniciante, intermediário ou avançado (MVP prioriza iniciantes).
- Dias da semana e tempo disponível por sessão.
- Local de treino: academia, casa ou ambos.
- Equipamentos disponíveis quando pertinente.
- Restrições/limitações opcionais, coletadas somente quando justificadas, com cuidados adequados de privacidade e encaminhamento à avaliação profissional quando necessário.

Regras: usar poucas etapas; explicar por que os dados são pedidos; não solicitar dados excessivos; validar entradas; permitir correção posterior; não bloquear desnecessariamente por dados secundários; informar limites do serviço.

### 2.4 Exercícios

Cada exercício deve permitir, no mínimo:
- Nome em português do Brasil e termos alternativos para busca.
- Grupo(s) muscular(es), equipamento e nível/compatibilidade.
- **Demonstração visual** (GIF, WebP, vídeo curto ou outro formato suportado).
- Instruções curtas e claras de execução.
- Erros comuns ou precauções relevantes, revisados.
- Alternativas/substituições **pré-aprovadas**, quando disponíveis.

A biblioteca inicial pode ter cerca de **50 a 80 exercícios frequentes** (meta orientativa, não obrigação imediata). Para desenvolvimento, preferir dados de demonstração próprios/placeholder claramente identificados. **Não copiar GIFs, vídeos, textos ou imagens de outros aplicativos ou de buscas na web sem licença compatível com uso comercial.** Verificar direitos, atribuição e termos antes de integrar uma base externa. A qualidade técnica das demonstrações deve ser validada por profissional habilitado.

O catálogo e a mídia devem ser desacoplados para permitir troca de provedor no futuro. Sempre prever estado de mídia indisponível, texto alternativo e fallback didático.

### 2.5 Plano de treino semanal

- Exibir distribuição por dia da semana, incluindo descanso.
- Usar **modelos de treino pré-definidos e revisados**; não gerar recomendações arbitrárias a partir de peso, altura ou objetivo isolados.
- Relacionar plano a objetivo, experiência, frequência, tempo e equipamentos disponíveis, dentro de regras aprovadas.
- Exibir exercícios, ordem, séries, repetições/faixas e descanso previstos no modelo.
- Preservar histórico ao alterar agenda ou trocar de plano.
- Suportar estados: sem plano, plano ativo, dia de descanso, treino em andamento e treino concluído.
- Permitir substituições **somente por opções compatíveis previamente aprovadas** quando o recurso existir.

### 2.6 Execução e histórico

- Iniciar, pausar/retomar e finalizar sessão.
- Marcar séries e exercícios concluídos.
- Registrar carga e repetições realizadas quando adequado.
- Exibir progresso da sessão e, quando útil, o último registro do exercício.
- Evitar perda de dados em recarregamento/navegação, conforme arquitetura adotada.
- Proteger contra sessões duplicadas, cliques repetidos e inconsistência de registros.
- Manter histórico mínimo de treinos realizados; gráficos avançados podem ficar para depois.

### 2.7 Assistente de IA

**Objetivo:** responder dúvidas simples e contextualizadas sobre exercícios, navegação, orientações revisadas e rotina do aluno, sem tirar o usuário do fluxo de treino.

Exemplos de perguntas esperadas:
- “Como faço a puxada frontal?”
- “O que significa 3 séries de 12?”
- “Essa máquina está ocupada. Quais alternativas aprovadas existem no meu treino?”
- “Que treino tenho hoje?”

Requisitos obrigatórios:
- Chamar provedores de IA **somente pelo backend**; jamais expor API keys no cliente.
- Utilizar contexto mínimo e autorizado (exercício em foco, plano permitido, textos revisados).
- Preferir recuperação de conteúdo confiável do catálogo em vez de confiar em memória do modelo.
- Não inventar exercícios, técnica, séries, progressões, substituições ou limitações não validadas.
- Não diagnosticar, prescrever tratamento, interpretar sintomas como avaliação médica ou prometer resultados.
- Se houver dor, lesão, sintomas preocupantes ou condição relevante, orientar a interromper a atividade quando apropriado e procurar profissional de saúde/educação física habilitado. Não fornecer instruções arriscadas.
- Não afirmar que um movimento foi executado corretamente sem observação qualificada; o MVP não analisa vídeo nem postura em tempo real.
- Implementar tratamento de erros, limites de uso, controle de custos, proteção contra abuso e minimização de logs/dados pessoais.
- Segregar funcionalidades Free/Premium por autorização **do lado do servidor**, não apenas escondendo botões no frontend.

## 3. Fora do escopo inicial / não construir sem pedido expresso

- Feed social, rankings públicos, mensagens entre usuários e comunidade.
- Dietas, contagem de calorias, planejamento nutricional ou prescrição alimentar.
- Integração com smartwatches e wearables.
- Marketplace, afiliados e anúncios intrusivos.
- Painel completo para personal trainers/academias (possível linha B2B futura).
- Análise automática de postura por câmera, visão computacional e correção biomecânica em tempo real.
- Geração de animações 3D do zero.
- Gamificação extensa, conquistas complexas e notificações excessivas.
- Aplicativos nativos Android/iOS antes de validar o web app.
- Arquitetura de microsserviços, mensageria distribuída ou infraestrutura complexa sem necessidade real.
- Funcionalidades clínicas ou prescrições individuais automáticas sem revisão profissional e jurídica.

**Regra:** se uma tarefa não exigir um recurso futuro, não antecipá-lo por iniciativa própria.

## 4. Stack e arquitetura de referência

**Preferências técnicas propostas** (devem ser confrontadas com o estado real do repositório antes de qualquer alteração):

| Camada | Escolha inicial |
|---|---|
| Aplicação web | Next.js + React + TypeScript |
| UI | Tailwind CSS + shadcn/ui, com acessibilidade |
| Banco | PostgreSQL gerenciado pelo Supabase |
| Autenticação | Supabase Auth |
| Mídia | Armazenamento com regras apropriadas, possivelmente Supabase Storage/CDN |
| IA | API de modelo consumida exclusivamente por serviço/backend |
| Pagamentos | Mercado Pago, inicialmente em sandbox/teste |
| Deploy web | Vercel ou outra infraestrutura compatível |
| Testes | Vitest e Playwright, quando adequados à base |
| Futuro mobile | React Native + Expo, reutilizando APIs, modelos e regras portáveis |

A stack é uma **decisão arquitetural de referência**, não licença para recriar um projeto existente. Inspecionar o repositório, scripts, versões, padrões, dependências e estrutura antes de instalar ou alterar ferramentas.

### Diretrizes de arquitetura

- Preferir arquitetura **modular e simples**, sem abstrações prematuras.
- Separar apresentação, regras de negócio e acesso a dados.
- Colocar validações de entrada e regras sensíveis no servidor.
- Manter tipagem forte, modelos bem definidos e contratos previsíveis.
- Usar componentes reutilizáveis sem criar sistemas de design excessivamente complexos.
- Considerar PWA e experiência em conexões instáveis **quando solicitado ou quando fizer parte da etapa**; não prometer offline completo no MVP.
- Preparar interfaces de serviço que permitam futuramente um cliente mobile sem duplicar lógica crítica.
- Internacionalização não é prioridade inicial: UI em `pt-BR`, fuso e formatação coerentes com a região; estruturar o código para não impedir expansão posterior.
- Segredos em variáveis de ambiente, nunca no repositório; fornecer somente `.env.example` sem valores reais.

## 5. Modelo de dados conceitual

Nomes sugeridos de entidades/tabelas; ajustar às convenções reais sem introduzir duplicações:

| Entidade | Responsabilidade |
|---|---|
| `profiles` | Dados e preferências do aluno |
| `exercises` | Catálogo revisado e metadados de mídia |
| `workout_templates` | Modelos aprovados de treino |
| `workout_template_exercises` | Ordem, séries, repetições e descansos dos modelos |
| `user_workout_plans` | Plano associado a cada aluno, com vigência e estado |
| `scheduled_workouts` | Programação semanal do aluno |
| `workout_sessions` | Sessões iniciadas/concluídas |
| `exercise_set_logs` | Séries, cargas, repetições e conclusão |
| `ai_conversations` | Histórico mínimo e controlado de interações com IA |
| `subscriptions` | Assinaturas, status e identificadores do provedor |

Pontos obrigatórios: `user_id` e escopo de autorização onde aplicável, integridade referencial, índices para consultas frequentes, timestamps, histórico preservado, tratamento de concorrência, migrações versionadas e políticas **RLS (Row Level Security)** no Supabase para dados por usuário. Não armazenar dados de cartão. Não manter conversas de IA por prazo indefinido sem justificativa.

Nenhuma tabela ou campo deve ser considerado existente apenas por estar descrito aqui: **verificar as migrações e o schema real**.

## 6. Planos e monetização

Modelo desejado: **freemium**, com acesso gratuito ao valor principal e assinatura Premium para recursos ampliados.

**Free — proposta inicial:**
- Acesso ao treino semanal básico baseado em modelos.
- Biblioteca essencial e demonstrações de execução.
- Registro básico de sessões/cargas.
- Cota pequena de perguntas à IA (proposta: 3/mês).

**Premium — proposta inicial:**
- Mais opções de personalização e modelos compatíveis.
- Biblioteca mais ampla e substituições aprovadas.
- Histórico e evolução avançados.
- Cota maior de perguntas à IA (proposta: 50/mês).
- Outros recursos agregados que realmente resolvam problemas do aluno.

**Hipóteses de preço, não definitivas:** R$ 19,90/mês ou R$ 149,90/ano. Não fixar preços no código sem configuração de produto/pagamentos; não apresentar essas hipóteses como valores comerciais já aprovados.

**Implementar cobrança apenas na etapa correspondente.** Nessa etapa, usar ambiente de teste, webhooks autenticados/verificados, idempotência, reconciliação de status, cancelamento, falhas de pagamento e acesso Premium controlado pelo backend. Verificar regras aplicáveis de cobrança quando houver aplicativos móveis nativos no futuro.

**Princípio comercial:** nunca bloquear a função básica de ver como executar um exercício comum apenas para forçar uma assinatura. O valor pago deve vir de conveniência, profundidade e evolução.

## 7. UX, UI e conteúdo

**Regra de ouro:** o usuário deve conseguir responder rapidamente:
1. **O que eu treino hoje?**
2. **Como faço este exercício?**
3. **Já concluí meu treino?**

Critérios:
- Começar pelo viewport de celular; validar também desktop/tablet.
- Evitar excesso de menus, cards, gráficos, pop-ups e passos obrigatórios.
- Usar títulos compreensíveis: “Treino de hoje”, “Minha semana”, “Ver execução”, “Concluir série”.
- Ações primárias visíveis; estados de carregamento, vazio, erro e sucesso claros.
- Texto curto, em português natural e sem jargões desnecessários.
- Botões adequados para toque, bom contraste, navegação por teclado e leitores de tela.
- Animações ajudam a ensinar, mas devem ter alternativa textual, controles apropriados e respeito à preferência de movimento reduzido quando aplicável.
- Não depender apenas de cor para indicar conclusão ou erro.
- Manter performance adequada para internet móvel e aparelhos intermediários.
- Não transformar o app em dashboard fitness complexo.
- Reutilizar tokens e componentes existentes antes de criar novos.

**Identidade visual:** a marca ainda não tem paleta, logotipo, tipografia ou brandbook aprovados. Portanto, criar visual **provisório, minimalista, contemporâneo e confiável**, facilmente substituível. Não tratar exemplos ou mocks anteriores como especificação visual obrigatória.

## 8. Saúde, segurança e responsabilidades

O LastroFit é uma ferramenta de **orientação e apoio à organização de treino**, não um substituto de avaliação individual por profissionais habilitados.

- Modelos de treino, demonstrações, substituições e critérios de progressão devem passar por revisão de profissional de Educação Física habilitado antes de publicação para usuários reais.
- Não inferir prescrições seguras apenas de IMC, peso, altura ou objetivo.
- Não gerar metas de perda de peso, intensidade ou volume extremo automaticamente.
- Não sugerir ignorar dor, tontura, falta de ar anormal ou outros sinais de alerta.
- Se o usuário declarar restrições ou limitações que escapem das regras validadas, não forçar a geração do treino; apresentar encaminhamento/aviso claro.
- Nunca afirmar que uma IA garante a execução correta ou evita lesões.
- Separar instruções educativas de avaliações pessoais e evitar garantias de resultado.
- Revisar informações técnicas, mensagens de segurança e fluxos com especialista antes do lançamento público.

## 9. Privacidade, segurança e conformidade

Tratar dados do usuário seguindo princípios da **LGPD** e boas práticas de segurança. Peso, medidas, informações de saúde e histórico podem exigir atenção especial.

- Minimizar dados coletados e expostos; justificar finalidade de cada informação.
- Definir bases legais e avisos/consentimentos com revisão jurídica quando apropriado.
- Aplicar autenticação, autorização por recurso e RLS; testar tentativas de acesso entre contas.
- Validar dados no servidor; proteger contra injeção, XSS, CSRF conforme arquitetura, abuso de API e vazamento em logs.
- Evitar incluir informações pessoais em prompts de IA sem necessidade.
- Não incluir segredos em código, screenshots, logs, documentação ou mensagens de erro.
- Prever edição, exportação quando aplicável, exclusão de conta/dados e política de retenção.
- Restringir permissões administrativas e segregar dados públicos do catálogo de dados privados dos alunos.
- Não usar dados pessoais reais como seeds, fixtures ou testes.
- Cobrança e permissões devem ser verificadas no backend; o frontend não é autoridade para pagamentos.
- Não executar operações destrutivas em banco compartilhado sem autorização explícita, backup/plano de rollback e compreensão do impacto.

## 10. Roadmap e ordem das etapas

Trabalhar incrementalmente. **Não implementar etapas futuras sem pedido explícito**, salvo preparação pequena e necessária para cumprir a tarefa atual.

| Etapa | Foco | Resultado esperado |
|---|---|---|
| **00** | Fundação e protótipo | Estrutura, tema provisório, navegação e telas-base mobile-first |
| **01** | Autenticação e banco | Login/cadastro, perfil, migrações e autorização seguras |
| **02** | Biblioteca de exercícios | Busca, filtros, detalhe, mídia e instruções revisáveis |
| **03** | Onboarding | Perfil de treino com validações e persistência |
| **04** | Semana de treinos | Associação a modelos aprovados, agenda e treino do dia |
| **05** | Execução e registro | Séries, cargas, progresso, conclusão e histórico básico |
| **06** | IA contextual | Ajuda especializada com conteúdo confiável e limites de uso |
| **07** | Monetização | Free/Premium, checkout, webhooks e permissões |
| **08** | Validação e lançamento | Qualidade, acessibilidade, privacidade, testes e publicação |
| **09** | Mobile nativo (futuro) | React Native/Expo depois da validação do produto web |

**Validação prioritária:** antes de investir pesado na IA ou em pagamentos, garantir que um iniciante consiga encontrar o treino do dia, abrir uma demonstração e concluir uma sessão com facilidade.

## 11. Procedimento obrigatório do Codex em cada tarefa

### Antes de alterar código

1. **Ler este `AGENTS.md` integralmente** e qualquer `AGENTS.md` relevante em subdiretórios.
2. Inspecionar o estado real do repositório: `README`, estrutura de pastas, scripts, dependências, schemas, migrações, testes e alterações não commitadas.
3. Identificar em qual etapa do roadmap a solicitação se encaixa.
4. Explicitar suposições e distinguir **requisitos confirmados** de **hipóteses/propostas**.
5. Para mudanças médias/grandes, apresentar um plano curto com arquivos/áreas a alterar, riscos e testes esperados.
6. Se faltar informação não bloqueante, adotar a solução mais simples, reversível e alinhada a este documento; registrar a suposição. Perguntar apenas se uma decisão essencial puder causar impacto perigoso ou irreversível.

### Durante a implementação

1. Fazer somente o necessário para a tarefa solicitada; evitar mudanças paralelas.
2. Seguir padrões já estabelecidos no repositório; não reescrever código funcional sem motivo claro.
3. Preferir arquivos e componentes pequenos, nomes claros e TypeScript tipado.
4. Implementar acessibilidade, estados vazios/erro/carregamento e responsividade desde o início.
5. Criar ou ajustar testes relevantes para regras de negócio, autenticação, permissões e fluxos críticos.
6. Não usar mock como se fosse integração real; marcar claramente o que ainda é simulado.
7. Não fazer migrações destrutivas nem alterar dados de produção automaticamente.
8. Não instalar dependências por conveniência sem justificar necessidade e impacto.
9. Não desabilitar checks, validações ou políticas RLS para “fazer passar”.
10. Manter comentários e documentação úteis, sem excesso.

### Depois da implementação

1. Executar as verificações disponíveis pertinentes: lint, typecheck, testes e build, conforme scripts existentes.
2. Verificar manualmente (quando possível) os fluxos mobile e os principais estados da interface.
3. Informar claramente:
   - o que foi implementado;
   - quais arquivos/áreas foram alterados;
   - quais testes/comandos foram executados e seus resultados;
   - o que ainda é mock, pendência, risco ou decisão futura.
4. Caso alguma verificação não possa rodar, explicar **por quê**; não alegar que passou.
5. Atualizar README/documentação quando mudar configuração, ambiente, arquitetura ou comportamento relevante.
6. Sugerir o próximo passo lógico, **sem implementá-lo automaticamente**.

## 12. Critérios gerais de pronto (Definition of Done)

Uma tarefa só é considerada pronta quando, conforme seu escopo:

- [ ] Resolve a necessidade do usuário sem desviar para recursos futuros.
- [ ] Funciona no fluxo principal e apresenta mensagens para erro/vazio/carregamento.
- [ ] É utilizável em tela de celular e acessível de maneira razoável.
- [ ] Trata dados e permissões com segurança (incluindo RLS quando aplicável).
- [ ] Não contém credenciais, dados pessoais reais ou mídia sem licença adequada.
- [ ] Não apresenta orientação de treino inventada como prescrição validada.
- [ ] Contém testes apropriados e verificações executadas ou limitações relatadas.
- [ ] Preserva compatibilidade com código e dados existentes ou documenta migração.
- [ ] A entrega explica alterações, decisões e pendências de forma objetiva.

## 13. Como lidar com divergências e decisões novas

**Fonte de verdade para implementação:** solicitação atual do responsável pelo produto + estado atual do repositório + este arquivo. Em caso de conflito relevante entre instruções, expor a divergência antes de fazer alteração irreversível. Pedidos explícitos novos do responsável podem atualizar o escopo; registrar essas decisões na documentação.

**Não tratar como decisões finais sem confirmação:** nome definitivo/registro da marca, identidade visual, preços, cotas de IA, quantidade de exercícios, provedor definitivo de mídia, infraestrutura final e condições comerciais. Estes itens são hipóteses de produto descritas para orientar a construção.

**Não alterar este `AGENTS.md` silenciosamente** para justificar uma implementação fora do escopo. Propor atualizações quando houver mudança explícita de produto e preservar coerência com o roadmap.

---

**Resumo para o agente:** construa o **LastroFit** como um aplicativo de treinos para iniciantes que seja **simples, visual, rápido e seguro**. Primeiro faça funcionar muito bem o trio **treino do dia → demonstração do exercício → conclusão do treino**. Use modelos de treino revisados, preserve privacidade e implemente IA e monetização apenas em suas etapas. A cada tarefa: **leia, inspecione, planeje, implemente, teste e reporte**.
