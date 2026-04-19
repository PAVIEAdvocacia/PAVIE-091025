# Release candidate final do blog PAVIE

## Metadados

- Versao: `RC-BLOG-FINAL-2026-04-19`
- Data: 2026-04-19
- Escopo: fechamento final pos-ajuste cirurgico de B3
- Natureza: documental, tecnica e reversivel
- Regra de execucao: consolidar o estado final aceito sem reabrir arquitetura, taxonomia, rotas, paginacao, governanca da B1, readiness, interlinking estrutural, instrumentacao da Fase 6, refinamento visual global da Fase 7, QA da Fase 8, regime de CTA ou funcao dominante das superficies

## Resumo executivo

O blog da PAVIE chegou a um release candidate final tecnicamente geravel e documentalmente rastreavel. As Fases 1 a 8 permanecem aceitas, e o ajuste cirurgico posterior de B3 foi incorporado como estado final da pagina de leitura.

O sistema preserva a regra central: descobrir, amadurecer e devolver ao site institucional, sem transformar o blog em feed cronologico, superficie comercial paralela ou expansao artificial de taxonomia.

## Superficies publicas validas

| Codigo | Rota | Funcao dominante |
|---|---|---|
| B1 | `/blog/` | Home editorial curada, governada por matriz propria e recentes subordinados |
| B2 | `/blog/categoria/[slug]/` | Categoria canonica paginada, pronta para escalar quando houver massa real |
| B3 | `/blog/[slug]/` | Pagina de leitura do artigo, limpa e editorial |
| B4 | `/blog/autor/[slug]/` | Autoria editorial controlada |
| S2 | `/areas/[slug]/` | Area institucional correspondente e destino de reconducao |

Continuam vedadas fora do mapa aceito:

- indice publico `/blog/categoria/`;
- rota legada `/autor/[slug]/` fora de `/blog/autor/[slug]/`;
- contato forte dentro do blog;
- arquivo cronologico principal;
- blocos de "mais lidos", "mais populares" ou rankings sem metrica real;
- taxonomia criada pelo front-end.

## Taxonomia publica vigente

O registry canonico permanece como fonte unica de verdade para categorias, slugs, areas e vinculos.

Categorias publicas vigentes:

- CAT-01: Sucessoes, Inventarios e Partilha Patrimonial
- CAT-02: Planejamento Patrimonial, Sucessorio e Arranjos Preventivos
- CAT-03: Familia Patrimonial e Dissolucoes
- CAT-04: Familia Binacional, Sucessoes Internacionais e Cooperacao Documental
- CAT-05: Imoveis, Registro, Regularizacoes e Litigios Patrimoniais
- CAT-06: Cobranca, Execucao, Contratos e Recuperacao de Credito Seletiva
- CAT-07: Tributacao Patrimonial e Recuperacao Tributaria Seletiva
- CAT-08: Direito do Consumidor e Responsabilidade Civil

Nao ha CAT-09, categoria derivada por tag, rotulo concorrente ou slug paralelo.

## Estado da B1

A B1 permanece como home editorial curada, governada por matriz editorial propria. A selecao editorial nao e governada por recencia pura, curtidas, clique bruto, popularidade simulada ou arquivo cronologico.

Estado final:

- destaques principais preservados como bloco soberano;
- leituras uteis preservadas como bloco de apoio;
- recentes permanecem limitados e subordinados;
- categorias e retorno institucional seguem como eixos de progressao;
- performance futura permanece apenas como apoio, quando houver dado real.

## Estado da B2

A B2 permanece como categoria canonica paginada obrigatoria.

Regra final:

- pagina 1: `/blog/categoria/[slug]/`;
- paginas 2+: `/blog/categoria/[slug]/2/`, `/3/` etc.;
- duplicata `/1` vedada;
- `CATEGORY_PAGE_SIZE`: 9;
- paginacao fica dormente enquanto nao houver massa real suficiente.

Estado atual: nenhuma categoria abre segunda pagina publica, pois o acervo ainda nao excede o limiar efetivo.

## Estado do acervo por categoria

| Categoria | Estado |
|---|---|
| CAT-01 | Acervo em preparacao |
| CAT-02 | Acervo em preparacao |
| CAT-03 | Acervo em preparacao |
| CAT-04 | Acervo em preparacao |
| CAT-05 | Acervo em preparacao |
| CAT-06 | Acervo em preparacao |
| CAT-07 | Acervo em preparacao |
| CAT-08 | Acervo minimo real atingido, com 5 posts publicos elegiveis |

Nao houve publicacao artificial para preencher arquitetura. CAT-01 a CAT-07 permanecem em preparacao ate haver conteudo revisado, publico, taxonomicamente correto e materialmente suficiente.

## Estado do interlinking

A malha estrutural entre B1, B2, B3, B4 e S2 permanece consolidada:

- B1 aponta para categorias e artigos curados;
- B2 aponta para artigos publicos quando houver e para S2 correspondente;
- B3 preserva breadcrumb, categoria, sidebar e links uteis;
- B4 reforca autoria sem virar pagina institucional paralela;
- S2 aponta para B2 e B3 quando houver acervo real;
- links legados e superficies removidas permanecem fora do mapa aceito.

## Estado da instrumentacao da Fase 6

A camada neutra de instrumentacao editorial permanece definida e disponivel, sem simular metricas, rankings ou popularidade.

Eventos nomeados na Fase 6:

- `editorial_b1_category_click`
- `editorial_b1_article_click`
- `editorial_b2_s2_click`
- `editorial_b3_s2_final_cta_click`
- `editorial_b3_related_read_click`
- `editorial_b4_site_click`
- `editorial_s2_blog_bridge_click`
- `editorial_s2_site_contact_click`

Observacao operacional: apos o ajuste final de B3, os eventos `editorial_b3_s2_final_cta_click` e `editorial_b3_related_read_click` continuam nomeados na camada de instrumentacao, mas nao possuem ponto de disparo na B3 atual porque os blocos finais correspondentes foram removidos por decisao editorial. Essa documentacao nao altera a Fase 6; apenas registra o efeito do hotfix aceito em B3.

## Estado do QA da Fase 8

A Fase 8 permanece como QA aprovado para arquitetura, taxonomia, rotas, contagem publica, breadcrumbs, ausencia de rotas legadas e readiness. O ajuste final de B3 foi validado adicionalmente por `npm run check`, `npm run build` e inspecao do HTML renderizado.

O script `npm run qa:blog` foi executado nesta etapa final. Ele confirmou:

- links internos verificados: `26 HTMLs, missing=0`;
- contagem publica: `CAT-01=0`, `CAT-02=0`, `CAT-03=0`, `CAT-04=0`, `CAT-05=0`, `CAT-06=0`, `CAT-07=0`, `CAT-08=5`;
- eventos B1, B2, B4 e S2 presentes.

O mesmo script falhou em dois pontos esperados pelo QA antigo:

- `editorial_b3_s2_final_cta_click=0`;
- `editorial_b3_related_read_click=0`.

Leitura executiva: a falha do `qa:blog` nao indica regressao de rota ou build; indica desalinhamento do script de QA com o novo estado aceito da B3, que removeu os blocos finais onde esses eventos eram disparados. Como esta etapa nao reabre QA nem instrumentacao, o resultado foi registrado como pendencia operacional de alinhamento futuro.

## Estado final ajustado da B3

O hotfix/refino final da B3 foi incorporado ao RC.

Estado aceito:

- sidebar na ordem final: `Neste artigo`, `Categorias`, `Leituras da mesma categoria`;
- corpo final sem cauda promocional ou institucional;
- removidos do corpo principal: `Transicao para o site`, botao `Conheca a area correspondente`, aviso `Conteudo informativo...`, bloco `Responsavel pelo conteudo / Fabio Mathias Pavie` e bloco `Leituras relacionadas da categoria`;
- hero image mais baixa, silenciosa e editorial, com imagem recuada, overlay controlado e titulo como protagonista;
- nenhum novo CTA dominante foi criado;
- nenhum bloco removido foi reinstalado em outro ponto do corpo.

Evidencia de HTML renderizado, apos build:

- `B3 HTML files: 5`;
- `Transicao para o site`: `filesWithMatch=0`;
- `Conheca a area correspondente`: `filesWithMatch=0`;
- `Conteudo informativo. Cada caso exige analise tecnica individual.`: `filesWithMatch=0`;
- `Responsavel pelo conteudo`: `filesWithMatch=0`;
- `Leituras relacionadas da categoria`: `filesWithMatch=0`;
- `reading-footer`: `filesWithMatch=0`;
- `reading-next-step`: `filesWithMatch=0`;
- `author-card`: `filesWithMatch=0`;
- `related-posts`: `filesWithMatch=0`;
- ordem da sidebar validada nos 5 HTMLs de B3 com `ok=True`.

## Baseline pos-publicacao

O baseline pos-publicacao ja existe em `docs/baseline-pos-publicacao-blog.md` e nao foi refeito nesta etapa.

Funcao:

- orientar primeira semana e primeiro mes;
- separar metricas fortes de metricas auxiliares;
- impedir que ausencia inicial de dados seja tratada como falha;
- impedir que recencia, clique bruto ou curtidas governem a B1;
- preparar leitura futura dos eventos reais sem simular dashboard.

## Validacao final

Comandos executados em 2026-04-19:

| Comando | Resultado |
|---|---|
| `npm run check` | OK: `0 errors`, `0 warnings`, `0 hints` |
| `npm run build` | OK: `25 page(s) built` |
| `npm run qa:blog` | Falha conhecida: eventos antigos de B3 sem ponto de disparo apos hotfix |

Observacao: `npm run check` e `npm run build` foram executados fora do sandbox por bloqueio local `spawn EPERM` do Astro neste ambiente.

## O que esta pronto

- Build estatico do blog.
- B1 curada e governada por matriz editorial.
- B2 canonica, paginada e pronta para escalar.
- B3 limpa, editorial e comprovada no HTML final.
- B4 de autoria editorial.
- S2 vinculada as categorias canonicas.
- Registry canonico preservado.
- CAT-08 com acervo minimo real.
- CAT-01 a CAT-07 honestamente em preparacao.
- Baseline pos-publicacao existente.
- Checklist de publicacao controlada documentado em `docs/checklist-publicacao-controlada-blog.md`.

## Pendencias residuais

- QA visual humana em navegador real, especialmente desktop/mobile.
- Alinhamento futuro do script `qa:blog` ao novo estado aceito da B3, caso ele continue sendo gate obrigatorio no pipeline.
- Conexao futura de provider analitico real para transformar a camada neutra de eventos em medicao persistente.

## Condicao de GO/HOLD

### GO tecnico

Ha GO tecnico para o pacote estatico quando o gate de publicacao considerar `npm run check`, `npm run build` e a inspecao HTML de B3 como validacoes suficientes para este hotfix.

### HOLD operacional

Ha HOLD operacional se o processo de deploy exigir `npm run qa:blog` verde como gate obrigatorio sem aceitar a excecao documentada da B3. Nesse caso, sera necessario atualizar o QA automatizado em etapa propria ou ratificar formalmente a excecao antes do deploy.

## Decisao sugerida

Decisao sugerida: `GO tecnico com pendencia humana final`.

Principal cautela antes da publicacao final: executar QA visual humana em navegador real e decidir operacionalmente se o `qa:blog` antigo sera ajustado ou se a excecao dos eventos removidos de B3 sera aceita no pacote de publicacao controlada.

## Rollback logico

Aplicar rollback logico se houver regressao visivel ou tecnica em qualquer destes pontos:

- B1, B2, B3, B4 ou S2 deixam de gerar;
- B2 gera duplicata `/1` ou paginacao artificial;
- registry deixa de refletir as 8 categorias canonicas;
- posts `draft` ou `noindex` entram no acervo publico;
- links internos estrategicos passam a gerar 404;
- B1 volta a parecer feed cronologico dominante;
- B3 volta a renderizar cauda promocional, bloco de autoria ou leituras relacionadas no corpo final;
- sidebar de B3 deixa de seguir a ordem `Neste artigo`, `Categorias`, `Leituras da mesma categoria`;
- QA visual humana identificar regressao material de leitura em desktop ou mobile.

Registro minimo de rollback:

- data e ambiente;
- rota afetada;
- evidencia da regressao;
- decisao aplicada;
- responsavel pela liberacao do novo pacote.
