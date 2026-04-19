# Fase 6 - Instrumentacao editorial e progressao de jornada

## Escopo

Esta nota registra a camada minima de instrumentacao editorial do blog da PAVIE. A fase prepara captura de eventos reais de clique sem alterar arquitetura, taxonomia, rotas, paginacao, governanca da B1, readiness do acervo, interlinking, regime de CTA ou refinamento visual.

Nao foram criados dashboards, rankings, contadores, "mais lidos" ou qualquer simulacao de popularidade.

## Diagnostico aplicado

A Fase 5 deixou os links criticos marcados com `data-link-origin` e `data-link-target`, mas o projeto ainda nao possuia camada ativa de analytics editorial. Tambem nao havia provider identificado como `gtag`, `dataLayer`, Plausible, Fathom ou PostHog.

A solucao aplicada cria uma camada neutra:

- escuta apenas links explicitamente marcados com `data-analytics-event`;
- publica o payload em `window.pavieEditorialDataLayer`;
- dispara o evento browser `pavie:editorial-analytics`;
- chama `window.pavieEditorialTrack(eventName, payload)` se um adapter real for conectado futuramente.

## Eventos implementados

| Evento | Finalidade |
|---|---|
| `editorial_b1_category_click` | Clique de B1 para categoria B2 |
| `editorial_b1_article_click` | Clique de B1 para artigo B3 |
| `editorial_b2_s2_click` | Clique de categoria B2 para area institucional S2 |
| `editorial_b3_s2_final_cta_click` | Clique no CTA final de B3 para S2 |
| `editorial_b3_related_read_click` | Clique em leitura relacionada dentro de B3 |
| `editorial_b4_site_click` | Clique de B4 para site institucional |
| `editorial_s2_blog_bridge_click` | Clique de S2 para B2 ou B3 quando houver acervo real |
| `editorial_s2_site_contact_click` | Clique de S2 para contato institucional existente |

## Payload minimo

Todo evento marcado deve carregar:

| Campo | Regra |
|---|---|
| `eventName` | Nome estavel do evento editorial |
| `surfaceOrigin` | Superficie de origem: `B1`, `B2`, `B3`, `B4`, `S2` ou `SITE` |
| `surfaceTarget` | Superficie de destino: `B1`, `B2`, `B3`, `B4`, `S2` ou `SITE` |
| `categoryCode` | Codigo canonico quando houver categoria resolvida |
| `categorySlug` | Slug canonico da categoria quando houver |
| `articleSlug` | Slug do artigo quando o link envolver B3 |
| `areaSlug` | Slug da area S2 quando houver |
| `authorSlug` | Slug do autor quando houver |
| `linkLabel` | Texto real do link clicado |
| `linkType` | Tipo operacional do link: artigo, categoria, area, CTA final, relacionado, site ou ponte blog |

A camada tambem inclui `href` e `pagePath` como contexto tecnico de auditoria do clique.

## Superficies cobertas

| Superficie | Cobertura |
|---|---|
| B1 `/blog/` | Categoria e artigo nos destaques principais, leituras uteis e recentes subordinados |
| B2 `/blog/categoria/[slug]/` | Retorno para S2 no hero e CTA final da categoria |
| B3 `/blog/[slug]/` | CTA final para S2 e leituras relacionadas |
| B4 `/blog/autor/[slug]/` | Retorno para o site institucional |
| S2 `/areas/[slug]/` | Ponte para B2, ponte para B3 quando houver acervo real e contato institucional existente |

## Lacunas dependentes de analytics real

- Persistencia, visualizacao e atribuicao multissessao dependem de provider analitico futuro.
- A camada nao calcula popularidade, rankings ou "mais lidos".
- A governanca da B1 ainda nao usa performance real; os eventos apenas preparam sinais honestos para uma fase futura.
- Contribuicao assistida para contato institucional dependera de uma camada de atribuicao que conecte cliques B1/B2/B3 -> S2 com cliques S2 -> contato.

## Uso futuro na governanca da B1

Quando houver provider real, os eventos poderao alimentar `performanceSupportScore` da matriz da B1 de forma auxiliar e subordinada. A regra permanece: performance nao governa sozinha a home editorial e nao substitui prioridade editorial, reconducao para S2, cobertura de categoria ou utilidade de leitura.
