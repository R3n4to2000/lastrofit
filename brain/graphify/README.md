# Graphify no LastroFit

O mapa do código foi gerado com a CLI oficial `graphifyy` 0.9.64. Os artefatos compartilhados ficam em `graphify-out/`: `graph.json`, `GRAPH_REPORT.md` e `graph.html`. A skill de projeto fica em `../../.agents/skills/graphify/`.

Para instalar a CLI em outra máquina, use `uv tool install graphifyy` (Python 3.11.5 a 3.14). A CLI é uma ferramenta de desenvolvimento separada do `package.json`.

No diretório raiz do projeto:

```powershell
graphify query "Como a autenticação se conecta às páginas?" --graph brain/graphify/graphify-out/graph.json
graphify extract . --code-only --out brain/graphify
graphify cluster-only brain/graphify --no-label
```

O primeiro comando consulta o grafo. Os dois seguintes o reconstroem após mudanças no código. Esta extração é local, baseada em AST e sem custo de tokens; inclui código e arquivos de configuração reconhecidos pela ferramenta, mas não analisa semanticamente documentos, imagens ou o brandbook. Nenhum modelo de IA externo foi configurado para essa etapa. Confira o código-fonte antes de tomar decisões de implementação: o grafo é um índice de relações, não uma validação de comportamento.

Arquivos de cache, manifesto e o marcador de caminho absoluto são locais e ignorados pelo Git. O relatório e a visualização podem ser versionados com o JSON para compartilhar o mapa inicial.
