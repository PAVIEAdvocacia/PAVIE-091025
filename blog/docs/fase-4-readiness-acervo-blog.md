# Fase 4 — Readiness mínimo do acervo por categoria do blog

## Escopo

Esta nota fecha a Fase 4 do blog da PAVIE exclusivamente pelo estado real do acervo público por categoria. Ela não altera arquitetura, taxonomia, rotas, paginação da B2, governança editorial da B1, regime de CTA ou refinamento visual.

## Regra mínima de prontidão editorial por categoria

Uma categoria é considerada minimamente pronta para cobertura pública proporcional quando possui, cumulativamente:

- 1 texto-base público, revisado e indexável do tipo `cornerstone` ou `guide`;
- pelo menos 1 texto complementar público, revisado e indexável do tipo `faq`, `checklist` ou `spoke`;
- `categoryCode`, `authorId`, `slug`, `excerpt`, `contentType`, `readerStage`, `ctaType`, `ctaTarget`, `legalReview` e `editorialReview` válidos;
- vínculo área-categoria resolvido pelo registry canônico;
- ausência de `draft` e ausência de `noindex`.

O alvo editorial preferencial para maturidade inicial é 1 texto-base + 2 complementares, mas a prontidão mínima não deve ser simulada com placeholder ou texto sem revisão material.

## Diagnóstico do acervo atual

| Categoria | Posts públicos elegíveis | Base (`cornerstone`/`guide`) | Complementares (`faq`/`checklist`/`spoke`) | Prontidão |
|---|---:|---:|---:|---|
| CAT-01 — Sucessões e Inventários | 0 | 0 | 0 | Em preparação |
| CAT-02 — Planejamento Patrimonial | 0 | 0 | 0 | Em preparação |
| CAT-03 — Família Patrimonial | 0 | 0 | 0 | Em preparação |
| CAT-04 — Família Binacional | 0 | 0 | 0 | Em preparação |
| CAT-05 — Imóveis e Regularizações | 0 | 0 | 0 | Em preparação |
| CAT-06 — Cobrança e Contratos | 0 | 0 | 0 | Em preparação |
| CAT-07 — Tributação Patrimonial | 0 | 0 | 0 | Em preparação |
| CAT-08 — Consumidor e Responsabilidade Civil | 5 | 2 | 3 | Pronta |

## Conteúdos públicos hoje elegíveis

### CAT-08 — Consumidor e Responsabilidade Civil

- `cornerstone`: `direito-consumidor-situacoes-documentaveis-organizar-problema-analise-juridica`
- `guide`: `documentos-casos-voo-cobranca-negativacao-compras-online`
- `faq`: `perguntas-voo-atrasado-nome-negativado-cobranca-compra-nao-entregue`
- `checklist`: `documentos-minimos-analise-juridica-consumo-responsabilidade-civil`
- `spoke`: `nome-negativado-indevidamente-organizar-situacao-analise-caso`

Todos os cinco itens estão em `src/content/blog`, com `draft: false`, `noindex: false`, `legalReview: "reviewed"`, `editorialReview: "reviewed"`, autoria definida e vínculo com a área correspondente.

## Categorias que permanecem em preparação

CAT-01 a CAT-07 possuem registry canônico, páginas de área e rota B2 estruturada, mas não possuem massa editorial pública suficiente no acervo atual. Elas devem permanecer como categorias em preparação até que haja conteúdo materialmente revisado, taxonomicamente classificado e liberado para superfície pública.

## Conteúdo legado e decisão de não integração automática

Relatórios antigos do repositório registram itens legados úteis para triagem editorial, como temas de divórcio, matrícula de imóvel e saúde/consumo. Esses itens não estão hoje como posts canônicos publicáveis em `src/content/blog` e, conforme a auditoria anterior, exigiam campos obrigatórios, reclassificação ou triagem humana.

Decisão aplicada: nenhum conteúdo legado foi integrado nesta fase, porque não havia arquivo público atual que cumprisse simultaneamente revisão jurídica, revisão editorial, `draft: false`, `noindex: false`, categoria canônica explícita, autoria, excerpt, slug e vínculo área-categoria resolvido.

## Estado das páginas de categoria

As páginas B2 já refletem honestamente o estado do acervo:

- categorias com posts exibem contagem pública baseada apenas em conteúdo publicado e liberado;
- categorias sem posts mantêm mensagem de "acervo em preparação";
- nenhuma página cria placeholder editorial, lista artificial ou paginação falsa;
- a transição para a área correspondente permanece preservada.

## Decisão estrutural aplicada

A Fase 4 documenta e fixa a régua mínima de publicação por categoria, reconhece a CAT-08 como única categoria hoje minimamente pronta e mantém CAT-01 a CAT-07 em preparação. A expansão mínima não foi forçada, porque não havia massa real revisada para novas categorias.
