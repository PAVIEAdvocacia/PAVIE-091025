# Fase 5 — Malha de interlinking e recondução do blog

## Escopo

Esta nota consolida a malha mínima entre B1, B2, B3, B4 e S2 sem alterar arquitetura, taxonomia, rotas, paginação, governança da B1, readiness do acervo, regime de CTA ou refinamento visual amplo.

## Diagnóstico aplicado

O interlinking já existia de forma funcional, mas ainda tinha três fragilidades:

- cards e destaques mostravam a categoria como texto, sem entrada direta clara para B2;
- o artigo usava o rótulo "Artigos mais lidos" em uma lista sem métrica real de leitura;
- S2 apontava para a categoria correspondente, mas não expunha B3 quando havia acervo público real.

## Entradas mínimas por superfície

| Superfície | Entradas mínimas |
|---|---|
| B1 `/blog/` | Navegação editorial, links de retorno do site, artigos curados e links de categoria nos cards/destaques |
| B2 `/blog/categoria/[slug]/` | Registry canônico, breadcrumbs, cards de S2, badges/links de categoria e área correspondente |
| B3 `/blog/[slug]/` | B1, B2, S2 quando houver lista de leitura, relacionados e breadcrumbs |
| B4 `/blog/autor/[slug]/` | B1, B2 e B3 por blocos de autoria e breadcrumbs |
| S2 `/areas/[slug]/` | Site institucional, B2 correspondente e B3 quando houver acervo público real |

## Saídas mínimas por superfície

| Superfície | Saídas mínimas |
|---|---|
| B1 | B3 por seleção editorial, B2 por categoria dos cards/destaques, B4 por autoria, site institucional por retorno |
| B2 | B3 por lista/featured, S2 por área correspondente, B4 por autoria editorial |
| B3 | B2 por breadcrumb/badge, S2 por CTA final único, B3 relacionados, B4 por autor |
| B4 | B3 por textos do autor e site institucional por vínculo institucional |
| S2 | B2 por categoria correspondente, B3 por artigos existentes, contato institucional pela home |

## Links obrigatórios

- Todo post público deve manter vínculo com a categoria canônica (`post.categoryUrl`) e área correspondente (`post.areaUrl`).
- Toda categoria B2 deve manter saída para S2 pela área correspondente.
- Todo artigo B3 deve manter CTA final único para S2 quando a taxonomia estiver resolvida.
- Toda página S2 deve manter ponte para B2 e, quando houver acervo real, links diretos para B3.
- B4 deve apontar para textos do autor e para o site institucional, sem substituir a página institucional.

## Links vedados

- Índice público `/blog/categoria/` sem rota aceita.
- Rota legada `/autor/fabio-pavie/` fora de `/blog/autor/fabio-pavie/`.
- Rótulos de performance como "mais lidos" ou "populares" sem instrumentação real.
- Links para categorias vazias como se houvesse acervo publicado.
- Contato paralelo forte dentro do blog fora dos CTAs já aceitos.

## Mensuração futura

Os links estruturais receberam atributos `data-link-origin` e `data-link-target` nos pontos críticos. Isso deixa a malha pronta para instrumentação analítica posterior, sem simular cliques, popularidade ou desempenho inexistente.

## Pendências residuais

- A mensuração real depende de camada analítica futura.
- CAT-01 a CAT-07 continuam com B2 honesta em preparação, sem links para B3 inexistentes.
- A expansão de links S2 para B3 crescerá naturalmente quando novos posts revisados entrarem no acervo público.
