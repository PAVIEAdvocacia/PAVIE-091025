# Checklist de publicacao controlada do blog PAVIE

## Escopo

Este checklist operacional acompanha o `RC-BLOG-FINAL-2026-04-19`. Ele nao altera arquitetura, taxonomia, rotas, score, pageSize, templates, CSS, eventos ou copy. Sua funcao e padronizar pre-deploy, deploy, pos-deploy imediato e rollback logico.

## Pre-deploy

- Confirmar branch/pacote de release e registrar identificador do RC.
- Confirmar que nao ha alteracoes funcionais fora do escopo aceito.
- Rodar `npm run check`.
- Rodar `npm run build`.
- Rodar `npm run qa:blog` e registrar o resultado.
- Se `qa:blog` falhar apenas pelos eventos removidos de B3, decidir antes do deploy se a excecao documentada no RC esta aceita.
- Conferir no HTML gerado de B3 a ausencia de `Transicao para o site`, `Conheca a area correspondente`, `Responsavel pelo conteudo`, `Leituras relacionadas da categoria`, `reading-footer`, `reading-next-step`, `author-card` e `related-posts`.
- Conferir no HTML gerado de B3 a ordem da sidebar: `Neste artigo`, `Categorias`, `Leituras da mesma categoria`.
- Fazer QA visual humana em navegador real, desktop e mobile.

## Excecao operacional do `qa:blog`

A falha atual do `npm run qa:blog` pode ser aceita no deploy atual quando estiver limitada aos eventos abaixo:

- `editorial_b3_s2_final_cta_click`;
- `editorial_b3_related_read_click`.

Esses eventos deixaram de ter ponto de disparo porque o ajuste final aceito da B3 removeu do corpo principal do artigo o CTA final para S2 e o bloco final de leituras relacionadas. A remocao e compativel com o estado aprovado da B3: pagina de leitura mais limpa, sidebar preservada e ordenada, sem cauda promocional/institucional e sem novo CTA dominante.

Essa excecao nao invalida o GO tecnico quando `npm run check` e `npm run build` passam e a inspecao do HTML confirma a ausencia dos blocos removidos. O alinhamento futuro do script `qa:blog` ao novo comportamento de B3 deve ser tratado como tarefa separada, sem bloquear este pacote de publicacao controlada.

## Deploy

- Publicar o build gerado em `dist`.
- Preservar headers/canonical/redirects existentes.
- Nao criar rota extra, redirect novo ou regra de cache que modifique a arquitetura aceita.
- Invalidar cache/CDN apenas para as rotas publicas afetadas ou para o pacote completo, conforme o ambiente de hospedagem exigir.
- Registrar data, responsavel, commit/pacote e ambiente.

## Pos-deploy imediato

Verificar rotas criticas:

- `/blog/`
- `/blog/categoria/direito-do-consumidor-responsabilidade-civil/`
- `/blog/autor/fabio-pavie/`
- ao menos um artigo B3 publicado
- `/areas/direito-do-consumidor-responsabilidade-civil/`

Verificar B3 ajustada:

- breadcrumbs presentes;
- titulo e metadados principais presentes;
- corpo do artigo preservado;
- sidebar visivel no desktop com ordem correta;
- no mobile, leitura sem regressao visual;
- blocos finais removidos continuam ausentes;
- hero com altura contida e imagem subordinada ao titulo;
- footer preservado.

Verificar B2:

- categoria com acervo exibe posts reais;
- categorias sem acervo exibem estado honesto de preparacao;
- nao ha `/blog/categoria/[slug]/1/`;
- paginacao nao aparece sem massa real.

Verificar links e cache:

- links internos principais nao geram 404;
- links de categoria, artigo, autor e S2 abrem destino correto;
- CDN/cache nao entrega versao anterior da B3 com cauda promocional;
- sitemap e paginas estaticas carregam sem erro.

## Evidencias minimas

Registrar:

- resultado de `npm run check`;
- resultado de `npm run build`;
- resultado de `npm run qa:blog` ou excecao documentada;
- captura ou anotacao de QA visual desktop/mobile;
- lista curta das rotas testadas;
- status final: GO, GO com pendencia, ou rollback.

## Rollback logico

Aplicar rollback se houver:

- quebra de build ou rota critica;
- 404 em links internos estrategicos;
- retorno da cauda promocional na B3;
- ordem incorreta da sidebar de B3;
- B2 com duplicata `/1` ou paginacao artificial;
- taxonomia divergente do registry;
- problema visual grave em desktop ou mobile;
- cache/CDN mantendo versao antiga de B3 sem possibilidade de invalida-la rapidamente.

Procedimento:

- interromper promocao do pacote;
- restaurar o ultimo build aprovado;
- limpar cache/CDN das rotas afetadas;
- registrar evidencia, data, ambiente e decisao;
- so tentar nova publicacao apos corrigir ou ratificar a causa da regressao.
