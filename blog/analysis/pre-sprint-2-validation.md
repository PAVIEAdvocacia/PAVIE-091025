# Pre-Sprint 2 - Validacao Formal

## Dependencias instaladas

- `@astrojs/check`
- `typescript`

Essas dependencias foram adicionadas em [`/C:/dev/PAVIE-091025/blog/package.json`](/C:/dev/PAVIE-091025/blog/package.json) e resolvidas em [`/C:/dev/PAVIE-091025/blog/package-lock.json`](/C:/dev/PAVIE-091025/blog/package-lock.json).

## Comandos executados

1. `npm run audit:pre-sprint-2`
2. `npm run check`
3. `npm run build`

## Resultado

- `astro check`: 0 errors, 0 warnings, 14 hints
- `astro build`: concluido com 35 paginas
- busca no `dist/`: sem ocorrencias do slug do post canonico de teste e sem ocorrencias do slug da area canonica nova

## Observacoes

- Os hints atuais do `astro check` sao avisos de processamento inline em scripts JSON-LD e um parametro nao usado em `rss.xml.js`. Eles nao bloqueiam a build.
- `npm install` reportou 3 vulnerabilidades (`1 moderate`, `2 high`) no grafo atual. Nenhuma foi tratada nesta etapa porque o objetivo aqui foi habilitar a validacao formal, nao atualizar o lockfile por seguranca.
