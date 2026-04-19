# Fase 8 - QA editorial, tecnico e de publicacao do blog

## Escopo

Esta nota fecha a camada de QA do blog da PAVIE para publicacao e manutencao controlada. A fase nao altera arquitetura, taxonomia, rotas, paginacao da B2, governanca da B1, readiness do acervo, interlinking, instrumentacao da Fase 6, refinamento visual da Fase 7, regime de CTA ou funcao dominante das superficies.

## Diagnostico de QA

| Eixo | Resultado |
|---|---|
| Integridade de rota | B1, B2, B3, B4 e S2 geram rotas esperadas; nao ha duplicata `/1` para B2 |
| Integridade taxonomica | Registry mantem 8 categorias canonicas; areas e categorias preservam vinculo 1:1 |
| Integridade de interlinking | Links internos renderizados foram verificados no build; nenhum destino interno ausente |
| Integridade editorial minima | 5 posts publicos resolvidos, todos com autor, categoria, area, revisoes e CTA canonico |
| Integridade visual/estrutural | Classes e componentes da Fase 7 permanecem presentes no HTML/CSS |
| Instrumentacao editorial | Eventos criticos da Fase 6 permanecem presentes no build |

## Checklist por superficie

### B1 `/blog/`

- [x] Rota gerada.
- [x] Blocos A, B e C presentes.
- [x] Sem paginacao estrutural.
- [x] Sem regressao para feed cronologico dominante.
- [x] Links para B2 e B3 instrumentados.
- [x] Classes de refinamento visual presentes.

### B2 `/blog/categoria/[slug]/`

- [x] Uma rota canonica gerada para cada categoria do registry.
- [x] Nenhuma duplicata `/1` gerada.
- [x] Categorias sem acervo exibem estado honesto de preparacao.
- [x] Categoria com acervo exibe contagem publica coerente.
- [x] Paginacao permanece ausente quando nao ha massa publica suficiente.
- [x] Saida para S2 preservada e instrumentada.

### B3 `/blog/[slug]/`

- [x] Rotas geradas apenas para posts publicos.
- [x] Todo artigo publico resolve autor, categoria e area correspondente.
- [x] Breadcrumb de retorno para B1 preservado.
- [x] CTA final para S2 preservado e instrumentado.
- [x] Leituras relacionadas presentes e instrumentadas quando ha acervo correlato.
- [x] Blocos de leitura, autoria e relacionados mantem refinamento visual.

### B4 `/blog/autor/[slug]/`

- [x] Rota canonica de autoria gerada.
- [x] Autor resolvido a partir da collection.
- [x] Breadcrumb de retorno para B1 preservado.
- [x] Retorno para o site institucional presente e instrumentado.
- [x] Pagina permanece editorial, sem virar superficie institucional paralela.

### S2 `/areas/[slug]/`

- [x] Uma rota gerada para cada area correspondente a categoria canonica.
- [x] Slugs de area e categoria preservam correspondencia 1:1.
- [x] Ponte para B2 presente.
- [x] Ponte para B3 aparece apenas quando ha acervo publico real.
- [x] Contato institucional segue na superficie correta.

## Verificacoes registradas

- Links internos: `missing=0`.
- Contagem publica atual: `CAT-01=0`, `CAT-02=0`, `CAT-03=0`, `CAT-04=0`, `CAT-05=0`, `CAT-06=0`, `CAT-07=0`, `CAT-08=5`.
- Eventos criticos presentes: `editorial_b1_category_click`, `editorial_b1_article_click`, `editorial_b2_s2_click`, `editorial_b3_s2_final_cta_click`, `editorial_b3_related_read_click`, `editorial_b4_site_click`, `editorial_s2_blog_bridge_click`, `editorial_s2_site_contact_click`.
- Rotas vedadas nao foram geradas: `/blog/categoria/` e `/autor/fabio-pavie/`.
- Rotulo vedado de performance nao retornou como bloco publico.

## Falhas encontradas e correcoes aplicadas

Nao foram encontradas falhas relevantes no blog renderizado.

Durante a criacao do script de QA, houve um falso positivo interno ao procurar a substring `/autor/fabio-pavie/`, pois ela tambem aparece dentro da rota canonica `/blog/autor/fabio-pavie/`. A regra foi corrigida para validar a rota legada pela lista de rotas geradas, nao por substring solta.

## Pendencias residuais

- QA visual humano em navegador real ainda e recomendado antes da publicacao final.
- Validacao analitica real dependera da conexao futura de provider de analytics.
- Crescimento de CAT-01 a CAT-07 deve seguir a regua de readiness, sem publicacao artificial.

## Condicao de publicacao segura

O blog esta apto para publicacao e manutencao disciplinada quando os comandos abaixo passarem:

- `npm run check`
- `npm run build`
- `npm run qa:blog`

O comando `qa:blog` pressupoe que `dist` tenha sido gerado pelo build mais recente.
