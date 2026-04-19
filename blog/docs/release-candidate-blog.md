# Release candidate documental e tecnico do blog PAVIE

## Metadados

- Versao: `RC-BLOG-2026-04-19`
- Data: 2026-04-19
- Escopo: fechamento executivo do blog apos Fases 1 a 8, baseline pos-publicacao e ajuste cirurgico posterior de B3
- Natureza: documental, tecnica e reversivel
- Regra de execucao: nao reabrir arquitetura, taxonomia, rotas, paginacao, score da B1, readiness, interlinking, instrumentacao, visual amplo, QA aceito, regime de CTA ou funcao dominante das superficies

## Resumo executivo

O blog da PAVIE esta consolidado como sistema editorial de descoberta, maturacao e reconducao institucional. A estrutura publica aceita permanece limitada a B1, B2, B3 e B4, com S2 como destino institucional correspondente. O front-end nao cria taxonomia; areas, categorias, slugs e vinculos continuam derivados do registry canonico.

O estado tecnico atual preserva as rotas publicas, a taxonomia de 8 categorias, a paginacao canonica de B2, a governanca editorial da B1, a regra de readiness por categoria, a malha de interlinking, a camada neutra de instrumentacao e a documentacao de QA/publicacao. O baseline pos-publicacao ja existe em `docs/baseline-pos-publicacao-blog.md` e serve para orientar a leitura operacional inicial sem transformar metricas brutas em governo editorial prematuro.

## Escopo efetivamente entregue

- B1 `/blog/` como home editorial curada, sem paginacao estrutural e sem voltar a operar como feed cronologico dominante.
- B2 `/blog/categoria/[slug]/[...page].astro` como categoria canonica paginada, com pagina 1 em `/blog/categoria/[slug]/` e paginas 2+ em `/blog/categoria/[slug]/2/`, `/3/` etc.
- B3 `/blog/[slug]/` como pagina de artigo, com breadcrumbs, titulo, metadados, corpo editorial e sidebar de apoio.
- B4 `/blog/autor/[slug]/` como superficie de autoria editorial.
- S2 `/areas/[slug]/` como destino institucional correspondente a cada categoria canonica.
- Registry canonico preservado como fonte de verdade para categorias, slugs, areas e vinculos.
- B1 governada por matriz editorial propria, com selecao por valor editorial, cobertura e progressao de jornada, nao por recencia pura.
- Readiness editorial documentado, sem publicacao artificial de categorias sem massa real.
- Interlinking estrutural documentado e preparado para mensuracao futura.
- Instrumentacao editorial neutra criada, sem dashboard, ranking ou simulacao de popularidade.
- QA tecnico/editorial/publicacao documentado na Fase 8.
- Baseline pos-publicacao criado para leitura inicial de sinais reais.

## Superficies publicas validas

| Codigo | Superficie | Funcao dominante |
|---|---|---|
| B1 | `/blog/` | Home editorial curada, com destaques e recentes subordinados |
| B2 | `/blog/categoria/[slug]/` | Categoria canonica tematica, paginada e pronta para escalar |
| B3 | `/blog/[slug]/` | Artigo individual de leitura editorial |
| B4 | `/blog/autor/[slug]/` | Autoria editorial controlada |
| S2 | `/areas/[slug]/` | Area institucional correspondente e destino de reconducao |

Superficies removidas ou vedadas permanecem fora do mapa: indice publico `/blog/categoria/`, rota legada `/autor/[slug]/`, contato forte dentro do blog, arquivo cronologico dominante e blocos de popularidade sem metrica real.

## Taxonomia publica vigente

O registry canonico mantem 8 categorias publicas controladas:

- CAT-01: Sucessoes, Inventarios e Partilha Patrimonial
- CAT-02: Planejamento Patrimonial, Sucessorio e Arranjos Preventivos
- CAT-03: Familia Patrimonial e Dissolucoes
- CAT-04: Familia Binacional, Sucessoes Internacionais e Cooperacao Documental
- CAT-05: Imoveis, Registro, Regularizacoes e Litigios Patrimoniais
- CAT-06: Cobranca, Execucao, Contratos e Recuperacao de Credito Seletiva
- CAT-07: Tributacao Patrimonial e Recuperacao Tributaria Seletiva
- CAT-08: Direito do Consumidor e Responsabilidade Civil

Nao ha CAT-09, tags promovidas a categoria, rotulos concorrentes ou taxonomia derivada do front-end.

## Estado do acervo e readiness

| Categoria | Estado no RC |
|---|---|
| CAT-01 | Acervo em preparacao |
| CAT-02 | Acervo em preparacao |
| CAT-03 | Acervo em preparacao |
| CAT-04 | Acervo em preparacao |
| CAT-05 | Acervo em preparacao |
| CAT-06 | Acervo em preparacao |
| CAT-07 | Acervo em preparacao |
| CAT-08 | Acervo minimo real atingido, com 5 posts publicos elegiveis |

A CAT-08 permanece como unica categoria hoje minimamente pronta. CAT-01 a CAT-07 possuem estrutura, registry, B2 e S2 correspondentes, mas seguem honestamente em preparacao ate receberem conteudo revisado, publico, taxonomicamente correto e materialmente suficiente.

## Estado da paginacao

- `CATEGORY_PAGE_SIZE`: 9
- Pagina 1 canonica: `/blog/categoria/[slug]/`
- Paginas subsequentes: `/blog/categoria/[slug]/2/`, `/3/` etc.
- Duplicata `/1` vedada.
- Paginacao permanece dormente enquanto `total <= pageSize` ou enquanto nao houver massa real suficiente.
- Estado atual: categorias geradas sem segunda pagina publica, pois o acervo ainda nao ultrapassa o limiar de paginacao.

## Estado da B1

A B1 esta documentada como home editorial curada, governada por matriz propria e nao por recencia pura, popularidade bruta ou arquivo cronologico. Os blocos editoriais aceitos permanecem subordinados a prioridade editorial, retorno para area correspondente, estagio de jornada, cobertura de categoria, utilidade de leitura, frescor editorial e apoio futuro de performance real.

O baseline pos-publicacao reforca que curtidas, clique bruto, recencia pura e metricas de vaidade nao governam a B1.

## Estado da instrumentacao

A Fase 6 criou uma camada neutra de instrumentacao editorial. Os eventos definidos permanecem como nomenclatura estavel para medicao futura:

- `editorial_b1_category_click`
- `editorial_b1_article_click`
- `editorial_b2_s2_click`
- `editorial_b3_s2_final_cta_click`
- `editorial_b3_related_read_click`
- `editorial_b4_site_click`
- `editorial_s2_blog_bridge_click`
- `editorial_s2_site_contact_click`

A camada nao simula metricas, nao calcula popularidade e nao altera a governanca da B1 sem dados reais.

## Estado do QA da Fase 8

A Fase 8 registrou QA editorial, tecnico e de publicacao como aprovado, com integridade de rotas, taxonomia, interlinking, contagem publica, breadcrumbs, ausencia de rotas legadas e readiness do acervo.

Nesta etapa de RC, foi executado `npm run qa:blog` para conferir aderencia entre documentacao antiga e estado atual do codigo. O script encontrou links internos validos e contagem publica correta, mas falhou em dois eventos de B3:

- `editorial_b3_s2_final_cta_click=0`
- `editorial_b3_related_read_click=0`

Essa falha nao foi corrigida nesta etapa porque a tarefa de RC nao autoriza alterar templates, eventos ou QA. Ela registra uma divergencia documental/operacional gerada pelo ajuste cirurgico posterior de B3, que removeu do corpo do artigo o CTA final, o bloco de autoria e o bloco final de leituras relacionadas, mantendo a leitura mais limpa e a navegacao de apoio na sidebar.

## Divergencias documentais encontradas

Existe divergencia relevante entre notas anteriores e o estado atual da B3:

- As notas da Fase 5, Fase 6 e Fase 8 ainda descrevem B3 com CTA final para S2 e leituras relacionadas instrumentadas no corpo/final do artigo.
- O estado atual do codigo, apos ajuste cirurgico de B3, remove esses blocos do corpo principal e reorganiza a sidebar em: `Neste artigo`, `Categorias`, `Leituras da mesma categoria`.
- O script `qa:blog` ainda espera os eventos de B3 ligados aos blocos removidos e, por isso, falha no estado atual.

Decisao documental aplicada: registrar a divergencia no RC sem reabrir estrutura, sem reinstalar os blocos removidos e sem alterar a instrumentacao nesta etapa.

## Baseline pos-publicacao

O baseline pos-publicacao ja foi criado em `docs/baseline-pos-publicacao-blog.md` e nao foi refeito neste RC.

Funcao do baseline:

- orientar o que observar na primeira semana e no primeiro mes;
- separar metricas fortes de metricas auxiliares;
- impedir que ausencia inicial de dados seja interpretada como falha;
- impedir que clique bruto, curtida, recencia ou popularidade governem a B1;
- preparar leitura futura dos eventos da Fase 6 sem simular dashboard final.

## Condicao de GO/HOLD

### GO tecnico

O blog tem GO tecnico para build estatico e manutencao controlada se `npm run check` e `npm run build` permanecerem verdes no pacote de publicacao.

### HOLD operacional

Recomenda-se HOLD operacional para publicacao final ate que duas pendencias sejam explicitamente saneadas ou aceitas:

- QA visual humana em navegador real, especialmente desktop/mobile.
- Ratificacao documental do ajuste cirurgico de B3 ou atualizacao do script/documentacao de QA para refletir que os eventos `editorial_b3_s2_final_cta_click` e `editorial_b3_related_read_click` nao possuem mais ponto de disparo no corpo atual da B3.

## Rollback logico

Aplicar rollback logico se qualquer uma das condicoes abaixo ocorrer:

- rotas B1, B2, B3, B4 ou S2 deixarem de gerar;
- B2 criar duplicata `/1` ou paginacao artificial;
- registry canonico divergir das 8 categorias aceitas;
- posts draft/noindex entrarem indevidamente no acervo publico;
- links internos estrategicos gerarem 404;
- B1 voltar a operar como feed cronologico dominante;
- B3 ficar desalinhada com a decisao final sobre CTA/related reads/instrumentacao;
- QA visual humana identificar regressao material de leitura em desktop ou mobile.

Como registrar rollback:

- apontar data, ambiente, rota afetada e evidencia minima;
- registrar se o rollback foi tecnico, editorial, documental ou operacional;
- restaurar o ultimo estado aprovado sem reabrir taxonomia ou arquitetura;
- documentar a decisao antes de nova tentativa de publicacao.

## Decisao sugerida

Decisao sugerida: `GO tecnico / HOLD operacional`.

Racional: o blog esta estruturalmente consolidado e tecnicamente apto a gerar build, mas o RC encontrou uma divergencia operacional relevante entre QA/documentacao da Fase 6/Fase 8 e o ajuste posterior de B3. A publicacao controlada deve aguardar QA visual humana e ratificacao documental dessa mudanca de B3 ou atualizacao do QA automatizado para o novo comportamento aceito.
