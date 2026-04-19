# Fase 1 - Estrutura publica do blog

## Escopo

Esta nota fecha apenas o mapa estrutural publico do blog da PAVIE na Fase 1. Nao reabre arquitetura, taxonomia, funcao dominante, regime de CTA, metricas, refinamento visual ou curadoria editorial da B1.

## Arvore Astro consolidada

```text
src/pages/blog/index.astro
src/pages/blog/categoria/[slug]/[...page].astro
src/pages/blog/[slug].astro
src/pages/blog/autor/[slug].astro
```

## Funcao dominante por rota

- `/blog/`: home editorial curada do blog, com recentes limitados e entrada para o acervo sem operar como arquivo cronologico exaustivo.
- `/blog/categoria/[slug]/`: categoria canonica paginada, resolvida pelo registry e vinculada a area correspondente, sem criar taxonomia no front-end.
- `/blog/categoria/[slug]/[page]/`: paginas subsequentes da mesma categoria, mantendo a mesma funcao de arquivo paginado.
- `/blog/[slug]/`: artigo individual, com autoria, breadcrumb, metadados, relacionados e CTA editorial sobrio.
- `/blog/autor/[slug]/`: perfil editorial de autoria do blog, destinado a sustentar prova de autoria e textos assinados.

## Conflitos encontrados

- `src/pages/blog/[...slug].astro` ampliava B3 para catch-all e poderia absorver segmentos estruturais futuros.
- `src/pages/blog/categoria/[category].astro` criava categoria sem paginacao obrigatoria e com parametro divergente do slug canonico.
- `src/pages/blog/categoria/index.astro` criava uma superficie publica extra nao prevista nas premissas B1-B4.
- `src/pages/blog/sobre.astro` duplicava a funcao institucional de `/sobre/`.
- `src/pages/blog/contato.astro` duplicava contato comercial dentro do blog, contrariando a premissa de nao replicar contato forte do site.
- `src/pages/autor/[slug].astro` duplicava a superficie de autoria agora fixada em `/blog/autor/[slug]/`.

## Decisao estrutural aplicada

Foi adotada uma arvore minima e fechada para o blog: B1, B2 paginada, B3 artigo e B4 autor. As categorias continuam governadas pelo registry canonico; o front-end apenas resolve rotas, listagem e apresentacao. Rotas excedentes foram removidas para evitar duplicidade estrutural e regressao semantica.
