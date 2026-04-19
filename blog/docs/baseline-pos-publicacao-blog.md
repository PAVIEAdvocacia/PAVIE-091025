# Baseline pos-publicacao e monitoramento inicial do blog PAVIE

## Escopo

Este documento define a leitura operacional inicial do blog da PAVIE apos publicacao. Ele nao altera arquitetura, taxonomia, rotas, paginacao, governanca editorial da B1, readiness do acervo, interlinking, instrumentacao, refinamento visual, QA, copy, componentes ou eventos.

A finalidade e impedir duas distorcoes comuns no inicio da publicacao:

- tratar ausencia inicial de dados como falha do blog;
- transformar metricas brutas em criterio editorial prematuro.

## Estado de partida

- B1 esta governada por matriz editorial propria.
- B2 esta pronta para escalar como categoria canonica paginada.
- CAT-08 e a unica categoria com acervo minimo real no momento.
- CAT-01 a CAT-07 permanecem em preparacao.
- A instrumentacao neutra da Fase 6 esta pronta para capturar eventos reais.
- O QA tecnico, editorial e de publicacao da Fase 8 foi aprovado.

## O que observar na primeira semana

Na primeira semana, a leitura deve ser operacional, nao conclusiva.

Observar:

- se as rotas publicas principais estao acessiveis;
- se eventos editoriais chegam ao provedor de analytics quando ele estiver conectado;
- se cliques B1 -> B2 ocorrem sem erro de destino;
- se cliques B1/B2/B3 -> S2 ocorrem nos caminhos previstos;
- se o CTA final de B3 registra clique quando acionado;
- se related reads de B3 recebem cliques reais quando existem;
- se B4 gera retorno institucional sem competir com o site;
- se nao surgem 404, canonical divergente, pagina duplicada ou rota legada acessivel.

Nao concluir na primeira semana:

- que uma categoria e fraca por ter baixo volume inicial;
- que um artigo deve sair da B1 apenas por baixo clique inicial;
- que um bloco deve ser redesenhado por oscilacao pequena;
- que ausencia de clique em categoria sem acervo e problema editorial.

## O que observar no primeiro mes

No primeiro mes, a leitura pode comecar a comparar padroes, ainda sem automatizar decisao editorial.

Observar:

- proporcao de cliques B1 -> B2 por categoria com acervo real;
- proporcao de cliques B1 -> B3 por bloco da home;
- recorrencia de B2 -> S2;
- recorrencia de B3 -> S2 no CTA final;
- consumo de related reads em B3;
- retorno institucional via B4;
- artigos que ajudam o leitor a continuar jornada, mesmo sem alta recencia;
- ausencia de rotas quebradas ou comportamento inesperado apos indexacao.

Comparar apenas quando houver base minima:

- dias uteis versus fins de semana;
- artigos de tipos editoriais diferentes;
- blocos da B1 com funcoes distintas;
- categoria com acervo real versus categoria em preparacao.

## Metricas fortes

Metricas fortes sao sinais diretamente ligados a progressao editorial e institucional.

| Metrica | Uso adequado |
|---|---|
| B1 -> B2 | Mede interesse em aprofundar por categoria canonica |
| B1 -> B3 | Mede entrada em leitura editorial curada |
| B2 -> S2 | Mede reconducao da categoria para area institucional |
| B3 -> S2 | Mede eficacia do CTA final como ponte para o site |
| Related reads de B3 | Mede continuidade de leitura dentro do mesmo eixo |
| S2 -> B2/B3 | Mede ponte reversa do site para aprofundamento editorial |
| B4 -> site institucional | Mede retorno institucional a partir da autoria |

Essas metricas podem apoiar diagnostico, mas ainda exigem contexto editorial.

## Metricas auxiliares

Metricas auxiliares ajudam a interpretar comportamento, mas nao devem decidir sozinhas.

| Metrica | Cautela |
|---|---|
| Pageviews | Pode refletir distribuicao, indexacao ou curiosidade, nao necessariamente maturacao |
| Tempo de permanencia | Pode variar por tamanho do texto, dispositivo e tipo de pergunta |
| Scroll depth | Ajuda a medir consumo, mas nao prova compreensao ou qualificacao |
| Origem de trafego | Ajuda a entender aquisicao, mas nao substitui qualidade editorial |
| Taxa de saida | Pode ser natural quando o leitor foi reconduzido ao site |
| Cliques em links internos | Precisam ser lidos por superficie e funcao, nao em agregado bruto |

## Metricas que nao devem governar a B1

Estas metricas nao devem governar a B1, especialmente no inicio:

- curtidas;
- impressoes brutas;
- clique bruto isolado;
- recencia pura;
- ranking de popularidade sem contexto;
- post que viraliza fora da jornada qualificada;
- performance de rede social desconectada do site;
- metricas de vaidade sem progressao para B2, B3 ou S2.

A B1 continua subordinada a matriz editorial ja aceita: prioridade editorial, reconducao para area correspondente, adequacao ao estagio de jornada, cobertura de categoria, utilidade de leitura, frescor editorial e apoio de performance real apenas como sinal auxiliar.

## Uso dos eventos da Fase 6

| Evento | Leitura futura |
|---|---|
| `editorial_b1_category_click` | Avaliar progressao B1 -> B2 por categoria |
| `editorial_b1_article_click` | Avaliar entrada em B3 a partir da home curada |
| `editorial_b2_s2_click` | Avaliar reconducao de categoria para area institucional |
| `editorial_b3_s2_final_cta_click` | Avaliar eficacia do CTA final de artigo |
| `editorial_b3_related_read_click` | Avaliar continuidade de leitura em B3 |
| `editorial_b4_site_click` | Avaliar retorno institucional via autoria |
| `editorial_s2_blog_bridge_click` | Avaliar ponte S2 -> B2/B3 quando houver acervo real |
| `editorial_s2_site_contact_click` | Avaliar contato institucional a partir de S2 |

## Protocolo de leitura inicial

### Periodicidade

- Semana 1: leitura leve a cada 48 horas, apenas para detectar falhas tecnicas, ausencia de eventos ou comportamento anomalo.
- Semanas 2 a 4: leitura semanal, comparando padroes sem alterar governanca editorial.
- Apos 30 dias: consolidar primeira nota de aprendizado, sem automatizar score editorial apenas com metricas iniciais.

### Responsavel

Responsavel editorial ou pessoa designada pela PAVIE para acompanhar o blog. A leitura deve cruzar dados tecnicos com criterio editorial, nao ser delegada integralmente a dashboard.

### Criterio de interpretacao

Interpretar cada sinal pela funcao da superficie:

- B1 deve descobrir e orientar jornada, nao maximizar clique bruto.
- B2 deve organizar tema e reconduzir a S2 quando fizer sentido.
- B3 deve amadurecer leitura e oferecer CTA final unico.
- B4 deve sustentar autoria e retorno institucional sem competir com o site.
- S2 deve concentrar enquadramento institucional e contato.

### Cautelas metodologicas

- Nao comparar CAT-08 com CAT-01 a CAT-07 enquanto apenas CAT-08 tiver acervo minimo real.
- Nao interpretar ausencia de dados iniciais como falha de arquitetura.
- Nao transformar clique bruto em criterio editorial soberano.
- Nao substituir revisao editorial por performance.
- Nao ajustar B1 por recencia pura.
- Nao criar bloco de "mais lidos" sem base analitica e decisao posterior.
- Nao simular dashboard, ranking ou popularidade.

## Evidencias minimas a registrar

Em cada leitura inicial, registrar:

- data da leitura;
- periodo analisado;
- rotas com maior atencao;
- eventos recebidos ou ausentes;
- eventuais erros tecnicos observados;
- interpretacao editorial curta;
- decisao: observar, corrigir falha tecnica, ou aguardar mais dados.

## Condicao de estabilidade inicial

O blog permanece em estado operacional saudavel quando:

- rotas publicas continuam acessiveis;
- eventos criticos chegam ao provedor conectado;
- nao ha 404 em links internos estrategicos;
- nao ha rota legada removida acessivel;
- B1 nao volta a operar como feed cronologico;
- B2 nao cria paginacao sem massa real;
- B3 mantem CTA final unico e related reads coerentes;
- metricas seguem como apoio, nao como governo editorial automatico.
