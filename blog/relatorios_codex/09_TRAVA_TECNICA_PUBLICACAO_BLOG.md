# RELATÓRIO — TRAVA TÉCNICA DE PUBLICAÇÃO DO BLOG

## 1. Síntese executiva

Status geral: **HOLD**.

Subdecisão sobre CAT-08: **DEVOLVER À CAMADA DOCUMENTAL**.

O blog passa tecnicamente nas validações conhecidas, mas não deve ser publicado enquanto houver divergência entre o executável e `C:\dev\PRODUÇÃO`. O executável trata CAT-08 como categoria canônica obrigatória, pública e indexável; a documentação de PRODUÇÃO trata CAT-08 como HOLD/DEVOLVER e condiciona qualquer uso a decisão formal.

Esta auditoria não aplica patch. Ela define travas técnicas e um plano futuro para impedir publicação indevida, separando o que é correção técnica neutra do que depende de decisão documental.

## 2. Estado técnico atual

| Item | Estado |
|---|---|
| Workspace auditado | `C:\dev\PAVIE-091025\blog` |
| Git root | `C:\dev\PAVIE-091025` |
| Branch | `main` |
| Stack | Astro, TypeScript, content collections MD/MDX, Decap CMS, RSS, sitemap |
| Scripts disponíveis | `dev`, `prebuild`, `build`, `precheck`, `check`, `audit:pre-sprint-2`, `qa:blog`, `validate:content`, `preview`, `astro` |
| Estado Git inicial | limpo no repositório executável antes da criação deste relatório |
| Validações conhecidas | `validate:content`, `qa:blog`, `check` e `build` passam tecnicamente |
| Validações neste prompt | não reexecutadas para evitar regeneração de artefatos; este prompt é de contenção e relatório |

Scripts relevantes:

- `npm run validate:content` executa `scripts/validate-content-model.mjs`.
- `npm run qa:blog` executa `scripts/qa-blog-publication.mjs`.
- `npm run check` executa `astro check` após `validate:content`.
- `npm run build` executa `astro build` após `validate:content`.

## 3. Pontos em que CAT-08 aparece no executável

| Arquivo | Tipo de presença | Função | Risco | Pode mudar sem decisão documental? |
|---|---|---|---|---|
| `src/data/categories.registry.ts` | Direta | Define CAT-08 como categoria canônica com slug de categoria e área | Altíssimo: promove CAT-08 a fonte técnica de verdade | Não |
| `src/lib/canonical-content.ts` | Direta/derivada | Exporta categorias canônicas derivadas do registry e mapeia `consumidor-saude-previdencia` para CAT-08 | Alto: transforma legado/área runtime em correspondência canônica | Não |
| `src/content.config.ts` | Derivada | Aceita CAT-08 porque o enum vem de `CANONICAL_CATEGORY_CODES` | Alto: valida conteúdo CAT-08 como contrato editorial válido | Não |
| `src/content/blog/cat08-checklist.md` | Conteúdo público | Post CAT-08 com `draft: false`, `noindex: false`, revisões `reviewed` | Alto: conteúdo indexável apesar de HOLD documental | Não |
| `src/content/blog/cat08-cornerstone.md` | Conteúdo público | Post cornerstone CAT-08, linka área CAT-08 | Altíssimo: estrutura hub/porta de entrada CAT-08 | Não |
| `src/content/blog/cat08-faq.md` | Conteúdo público | FAQ CAT-08, linka área CAT-08 | Alto | Não |
| `src/content/blog/cat08-guide-documentos.md` | Conteúdo público | Guia CAT-08 com CTA para contato | Alto | Não |
| `src/content/blog/cat08-spoke-negativacao.md` | Conteúdo público | Spoke CAT-08 com CTA para contato | Alto | Não |
| `src/content/areas/direito-do-consumidor-responsabilidade-civil.md` | Área ativa | Página S2 CAT-08 com `isActive: true` e CTA para contato | Altíssimo: cria área pública institucional/editorial | Não |
| `public/admin/config.yml` | CMS/Decap | Oferece CAT-08 em posts e áreas | Alto: permite perpetuar divergência pelo CMS | Não |
| `scripts/validate-content-model.mjs` | QA/validação | Exige CAT-08 no registry e mínimo de 5 posts publicados | Altíssimo: QA técnico bloqueia remoção e incentiva publicação | Não |
| `scripts/qa-blog-publication.mjs` | QA/publicação | Espera CAT-01 a CAT-08, valida rotas B2 e S2 para todas | Alto: dá falso GO governado | Não |
| `src/pages/index.astro` | Superfície institucional | Usa definições canônicas para montar cards de área, incluindo CAT-08 | Alto: CAT-08 aparece como área institucional | Não |
| `src/pages/blog/index.astro` | B1 | Lista categorias; linka só categorias com posts, hoje CAT-08 | Alto: CAT-08 vira eixo dominante do blog por ser a única com acervo | Não |
| `src/pages/blog/categoria/[slug]/[...page].astro` | B2 | Gera rota para todas as categorias do diretório canônico, inclusive vazias e CAT-08 | Alto: indexa categoria bloqueada e categorias sem acervo | Parcialmente: contenção de vazias sim; CAT-08 não |
| `src/pages/blog/[slug].astro` | B3 | Gera posts publicados e usa `noIndex` conforme frontmatter | Alto: CAT-08 fica pública porque os 5 posts têm `noindex: false` | Não |
| `src/pages/areas/[slug].astro` | S2 | Gera área para toda área ativa, inclusive CAT-08 | Alto: cria superfície institucional no build | Não |
| `dist/sitemap-0.xml` | Artefato de build | Inclui rotas CAT-08 de área, categoria e posts | Alto: indexação ativa | Não como decisão de CAT-08; sim como trava geral futura |

## 4. Hipóteses de decisão sobre CAT-08

### Hipótese A — CAT-08 aprovada formalmente

Se CAT-08 for aprovada formalmente, a PRODUÇÃO precisa ser atualizada antes ou junto do executável. A implementação atual pode ser aproveitada, mas não deve governar a decisão.

Arquivos/documentos prováveis em PRODUÇÃO:

- `C:\dev\PRODUÇÃO\00_CANONICO\00_NUCLEO_MAE\00.08_Registro_Mestre_de_Vigencia_Documental_da_PAVIE.md`
- matriz canônica de superfícies públicas vigente;
- norma de compatibilização portfólio × taxonomia;
- documentos de cadeia editorial do bloco 13;
- `95_RELATORIOS_AUDITORIA_PRODUCAO/04_ecossistema_site_blog_instagram.md`;
- `95_RELATORIOS_AUDITORIA_PRODUCAO/07_matriz_dominios_rotas.md`;
- `95_RELATORIOS_AUDITORIA_PRODUCAO/08_backlog_execucao_site_blog_instagram.csv`.

Arquivos prováveis no executável:

- `src/data/categories.registry.ts`: manter CAT-08, mas confirmar título, slug, ordem e função.
- `src/lib/canonical-content.ts`: manter matriz de correspondência se aprovada.
- `src/content.config.ts`: manter enum derivado.
- `public/admin/config.yml`: manter CAT-08 no CMS.
- `scripts/validate-content-model.mjs`: manter CAT-08, mas trocar regra rígida de “mínimo de 5 posts CAT-08” por regra editorial geral se o blog não deve nascer concentrado em uma categoria.
- `scripts/qa-blog-publication.mjs`: manter CAT-08, mas validar também categorias vazias, noindex e coerência com PRODUÇÃO.
- `src/content/blog/cat08-*.md`: revisar conteúdo e status público.
- `src/content/areas/direito-do-consumidor-responsabilidade-civil.md`: revisar status, copy e relação com site institucional.
- `astro.config.mjs`, `src/consts.ts`, `public/robots.txt`: resolver domínio/sitemap/robots.

Critério de aceite da hipótese A: CAT-08 aprovada em PRODUÇÃO, registrada como categoria pública, com rotas, CMS, QA e sitemap coerentes.

### Hipótese B — CAT-08 experimental/noindex

Se CAT-08 permanecer experimental, o objetivo é impedir indexação e evitar que ela vire eixo público dominante sem remover trabalho já implementado.

Arquivos prováveis:

- `src/content/blog/cat08-*.md`: mudar `noindex` para `true` e possivelmente `draft` para `true` ou status equivalente, conforme política escolhida.
- `src/content/areas/direito-do-consumidor-responsabilidade-civil.md`: marcar como não ativa, experimental ou noindex se o modelo passar a suportar isso.
- `src/content.config.ts`: se necessário, permitir um campo de status público/experimental em áreas.
- `src/pages/blog/[slug].astro`: respeitar status experimental e não gerar rotas públicas indexáveis, ou gerar com `noIndex`.
- `src/pages/blog/categoria/[slug]/[...page].astro`: aplicar `noIndex` para categoria experimental e excluir do sitemap.
- `src/pages/areas/[slug].astro`: aplicar `noIndex` ou não gerar S2 experimental.
- `astro.config.mjs`: filtrar sitemap para excluir rotas experimentais.
- `scripts/validate-content-model.mjs`: parar de exigir mínimo de 5 posts publicados CAT-08 e criar regra de contenção experimental.
- `scripts/qa-blog-publication.mjs`: validar que CAT-08 experimental não aparece como indexável, não entra em sitemap e não tem CTA dominante.
- `public/admin/config.yml`: se Decap continuar permitindo CAT-08, adicionar campo/status editorial que impeça publicação acidental.

Critério de aceite da hipótese B: CAT-08 pode existir no repositório, mas não aparece em sitemap, não é indexável, não é dominante na home/blog, e o QA falha se ela for publicada sem decisão documental.

### Hipótese C — CAT-08 removida/rebaixada

Se CAT-08 for rejeitada como categoria ou rebaixada para repertório/satélite, a remoção precisa ser coordenada para não quebrar build, Decap e QA.

Arquivos prováveis:

- `src/data/categories.registry.ts`: remover CAT-08 ou rebaixá-la para registry não público/experimental.
- `src/lib/canonical-content.ts`: remover `targetCategoryCodes: ['CAT-08']` da matriz de legado ou reclassificar como sem correspondência canônica aprovada.
- `src/content.config.ts`: ajustar enum derivado se CAT-08 sair do registry público.
- `src/content/blog/cat08-*.md`: arquivar, reclassificar, migrar para categoria aprovada ou mover para acervo experimental.
- `src/content/areas/direito-do-consumidor-responsabilidade-civil.md`: remover, desativar ou reclassificar como não pública.
- `public/admin/config.yml`: remover CAT-08 das opções públicas ou mover para opção bloqueada.
- `scripts/validate-content-model.mjs`: remover exigência de CAT-08 e de 5 posts publicados.
- `scripts/qa-blog-publication.mjs`: alterar expectativa para CAT-01 a CAT-07 ou para registry público dinâmico.
- `src/pages/index.astro`: garantir que área rebaixada não apareça como card institucional.
- `src/pages/blog/index.astro`: garantir que categoria rebaixada não apareça como categoria pública.
- `src/pages/blog/categoria/[slug]/[...page].astro`: não gerar rota pública rebaixada.
- `src/pages/blog/[slug].astro`: redirecionar, arquivar ou noindexar posts rebaixados.
- `astro.config.mjs`: excluir rotas removidas do sitemap.

Critério de aceite da hipótese C: build e QA passam sem CAT-08 pública, sem links quebrados, sem opção ativa no CMS e sem rotas indexáveis remanescentes.

## 5. Categorias vazias CAT-01 a CAT-07

Estado observado: CAT-01 a CAT-07 têm 0 posts públicos, mas todas geram rota B2 e aparecem no sitemap existente em `dist/sitemap-0.xml`.

| Categoria | Posts públicos | Rota B2 | Está no sitemap? | Risco | Opção de contenção |
|---|---:|---|---|---|---|
| CAT-01 | 0 | `/blog/categoria/sucessoes-inventarios-partilha-patrimonial/` | Sim | Categoria vazia indexável | Noindex temporário e exclusão do sitemap até acervo mínimo |
| CAT-02 | 0 | `/blog/categoria/planejamento-patrimonial-sucessorio-arranjos-preventivos/` | Sim | Categoria vazia indexável | Noindex temporário e exclusão do sitemap até acervo mínimo |
| CAT-03 | 0 | `/blog/categoria/familia-patrimonial-dissolucoes/` | Sim | Categoria vazia indexável | Noindex temporário e exclusão do sitemap até acervo mínimo |
| CAT-04 | 0 | `/blog/categoria/familia-binacional-sucessoes-internacionais-cooperacao-documental/` | Sim | Categoria vazia indexável | Noindex temporário e exclusão do sitemap até acervo mínimo |
| CAT-05 | 0 | `/blog/categoria/imoveis-registro-regularizacoes-litigios-patrimoniais/` | Sim | Categoria vazia indexável | Noindex temporário e exclusão do sitemap até acervo mínimo |
| CAT-06 | 0 | `/blog/categoria/cobranca-execucao-contratos-recuperacao-credito-seletiva/` | Sim | Categoria vazia indexável | Noindex temporário e exclusão do sitemap até acervo mínimo |
| CAT-07 | 0 | `/blog/categoria/tributacao-patrimonial-recuperacao-tributaria-seletiva/` | Sim | Categoria vazia indexável | Noindex temporário e exclusão do sitemap até acervo mínimo |

Opções de contenção:

- Manter rotas B2 geradas, mas com `noindex` enquanto `postCount === 0`.
- Excluir B2 vazia do sitemap.
- Manter visualmente na B1 como “em preparação”, sem link dominante.
- Exigir acervo mínimo antes de indexar categoria, por exemplo 1 cornerstone ou 3 posts revisados.
- Fazer `qa:blog` falhar se categoria vazia estiver indexável ou no sitemap.

## 6. Domínio, canonical, sitemap e robots

| Item | Estado observado | Estado esperado | Risco | Patch futuro |
|---|---|---|---|---|
| `pavieadvocacia.com.br` | PRODUÇÃO trata como sede institucional; executável usa fallback do blog como `MAIN_SITE_URL` se env não existir | Domínio raiz deve ser site institucional, se essa arquitetura for confirmada | Site institucional pode sair canônico no subdomínio do blog | Definir `PUBLIC_MAIN_SITE_URL=https://pavieadvocacia.com.br` no ambiente e/ou fallback correto |
| `blog.pavieadvocacia.com.br` | `astro.config.mjs` usa como fallback de `site`; Decap também usa esse domínio | Blog deve ser camada editorial | Raiz do subdomínio contém home institucional no build atual | Decidir se blog vive em `/blog/` no subdomínio ou se subdomínio deve apontar direto para B1 |
| `PUBLIC_SITE_ORIGIN` | Não encontrado no ambiente local; fallback é blog | Deve ser definido por deploy conforme domínio real do build | Canonicals mudam por ausência de env | Documentar e validar env de deploy |
| `PUBLIC_MAIN_SITE_URL` | Não encontrado; fallback vira `SITE_ORIGIN` | Deve apontar para domínio institucional se site e blog forem separados | Links “Ir ao site”, áreas e contato ficam no blog | Definir env e ajustar fallbacks |
| `PUBLIC_BLOG_SITE_URL` | Não encontrado; fallback vira `SITE_ORIGIN` | Deve apontar para domínio/subdomínio do blog | B1/B2/B3 podem ficar corretos por acaso, mas sem controle | Definir env e usar QA para conferir |
| `astro.config.mjs` | `site` deriva de `PUBLIC_SITE_ORIGIN` ou blog fallback | Deve representar o domínio do build que gera sitemap | Sitemap pode publicar domínio errado | Separar origem principal do build ou tornar sitemap consciente de site/blog |
| `public/robots.txt` | Aponta `Sitemap: https://pavieadvocacia.com.br/sitemap-index.xml` | Deve apontar para o sitemap realmente servido pelo mesmo host, ou estratégia multi-host documentada | Robôs recebem sitemap divergente | Atualizar apenas após decisão de domínio |
| `dist/sitemap-0.xml` | Inclui rotas institucionais, categorias vazias e CAT-08 | Deve conter só rotas indexáveis aprovadas | Indexação de superfícies em HOLD | Filtrar sitemap por status público, postCount e decisão CAT-08 |
| Canonicals | Build observado usa `blog.pavieadvocacia.com.br` inclusive em `/` e `/areas/` | Canonicals devem refletir separação site/blog decidida | Duplicidade e colisão entre site e blog | Corrigir env/fallbacks e validar HTML gerado |
| Redirects | `/areas` → `/#areas`, `/contato` → `/#contato` | Depende se haverá rota institucional própria | Pode conflitar com expectativa de páginas de área/lista | Revisar depois da arquitetura site/blog |

## 7. Rotas institucionais dentro do build do blog

O build atual contém rotas institucionais e editoriais no mesmo projeto:

- `/`
- `/sobre/`
- `/areas/[slug]/`
- `/#contato`
- `/blog/`
- `/blog/categoria/[slug]/`
- `/blog/[slug]/`
- `/blog/autor/fabio-pavie/`

Isso pode ser aceitável se o projeto for um build único do ecossistema inteiro. Mas conflita com a matriz da PRODUÇÃO se a arquitetura esperada for:

- site institucional em `https://pavieadvocacia.com.br/`;
- blog em `https://blog.pavieadvocacia.com.br/`;
- categorias/artigos como superfícies editoriais subordinadas;
- áreas institucionais no domínio principal.

Avaliação:

- `/` não deve ser publicado no subdomínio do blog como sede institucional sem decisão de arquitetura.
- `/sobre/` pode ser institucional ou autoral; precisa decisão se pertence ao site raiz ou ao blog.
- `/areas/[slug]/` tende a ser institucional; publicar no subdomínio do blog pode inverter a hierarquia site/blog.
- `/#contato` como contato institucional dentro do build do blog pode ser aceitável como fallback, mas não substitui decisão sobre rota/âncora oficial de contato.
- `/blog/`, `/blog/categoria/`, `/blog/[slug]/` são coerentes como blog, mas divergem da matriz que apontava blog em `https://blog.pavieadvocacia.com.br/[slug]` sem prefixo `/blog/`.

Decisão: manter em HOLD até definição explícita de arquitetura de build, domínio e base path.

## 8. Plano de patch futuro

| ID | Patch futuro | Arquivos prováveis | Depende de CAT-08? | Prioridade | Critério de aceite |
|---|---|---|---|---|---|
| P-01 | Trava de publicação governada no QA | `scripts/qa-blog-publication.mjs`, possível arquivo de status documental | Sim | P0 | QA falha quando CAT-08 pública estiver em conflito com PRODUÇÃO |
| P-02 | Noindex/sitemap para categorias vazias | `src/pages/blog/categoria/[slug]/[...page].astro`, `astro.config.mjs`, `scripts/qa-blog-publication.mjs` | Não | P0 | CAT-01 a CAT-07 vazias não entram em sitemap e recebem noindex |
| P-03 | Corrigir `robots.txt` conforme domínio real | `public/robots.txt`, documentação de deploy | Não, mas depende de domínio | P0 | Robots aponta para sitemap servido no mesmo host correto |
| P-04 | Separar `MAIN_SITE_URL` e `BLOG_SITE_URL` por ambiente | `src/consts.ts`, `astro.config.mjs`, env de deploy, QA | Não | P0 | Canonicals e links diferenciam site raiz e blog |
| P-05 | Definir arquitetura de raiz do subdomínio do blog | `astro.config.mjs`, `src/pages/index.astro`, `src/pages/blog/index.astro`, deploy | Não | P0 | `blog.pavie.../` e `/blog/` têm função decidida sem duplicidade |
| P-06 | Cenário A CAT-08 aprovada | PRODUÇÃO + registry/conteúdo/CMS/QA | Sim | P0 | CAT-08 aprovada documentalmente e validada tecnicamente |
| P-07 | Cenário B CAT-08 experimental | posts, área, category page, sitemap, QA, Decap status | Sim | P0 | CAT-08 existe, mas não indexa nem domina navegação pública |
| P-08 | Cenário C CAT-08 removida/rebaixada | registry, canonical-content, content, CMS, QA, redirects | Sim | P0 | Build passa sem CAT-08 pública e sem links quebrados |
| P-09 | Ajustar Decap para não publicar divergência | `public/admin/config.yml` | Sim | P1 | CMS impede publicação acidental de categoria em HOLD |
| P-10 | QA de domínio e sitemap pós-build | `scripts/qa-blog-publication.mjs` ou novo script | Não | P1 | QA confere canonical, sitemap, robots e domínios esperados |
| P-11 | Política de acervo mínimo por categoria | `scripts/validate-content-model.mjs`, category page, blog home | Não | P1 | Categoria só indexa quando atinge critério mínimo documentado |
| P-12 | Revisar rotas `/areas`, `/contato`, `/sobre` | `_redirects`, pages institucionais, matriz de rotas | Não, mas depende arquitetura | P1 | Rotas institucionais coerentes com domínio principal |

## 9. Itens que podem ser corrigidos sem decidir CAT-08

Correções seguras, desde que aplicadas em patch futuro e revisadas:

- Definir variáveis de ambiente de domínio para separar `PUBLIC_MAIN_SITE_URL` e `PUBLIC_BLOG_SITE_URL`.
- Ajustar fallback de domínio para evitar que o domínio do blog vire domínio institucional por omissão.
- Corrigir `robots.txt` para apontar ao sitemap certo depois da decisão de host.
- Criar regra geral de noindex para categorias com `postCount === 0`.
- Excluir categorias vazias do sitemap.
- Fazer QA falhar quando rota vazia estiver indexável.
- Fazer QA conferir divergência entre `robots.txt` e sitemap gerado.
- Fazer QA conferir se canonicals usam domínios esperados.
- Documentar explicitamente que `npm run qa:blog` é QA técnico, não aceite documental.
- Manter B1 com categorias vazias em estado “em preparação” sem link dominante.

Esses itens não decidem se CAT-08 é canônica; apenas reduzem risco de indexação indevida e domínio errado.

## 10. Itens bloqueados até decisão documental

Não alterar ainda:

- Remover CAT-08 do registry.
- Promover CAT-08 como canônica na PRODUÇÃO.
- Alterar `src/content/blog/cat08-*.md` para resolver publicação sem decisão.
- Alterar `src/content/areas/direito-do-consumidor-responsabilidade-civil.md` para aprovar ou remover superfície.
- Alterar Decap para apagar CAT-08 sem estratégia de migração.
- Alterar scripts para aceitar ou rejeitar CAT-08 como decisão final.
- Criar redirects de CAT-08.
- Expor CAT-08 no Instagram ou em rota social.
- Criar nova taxonomia, categoria substituta ou reclassificação improvisada.
- Publicar sitemap com CAT-08 indexável.
- Fazer commit de harmonização que misture relatório, registry, conteúdo e domínio.

## 11. Próximo prompt recomendado

Próximo prompt mais seguro:

**“Executar decisão documental P0 sobre CAT-08 na PRODUÇÃO, sem alterar o executável: aprovar formalmente, manter experimental/noindex ou remover/rebaixar, com minuta de impacto sobre registry, conteúdo, CMS, QA, sitemap e rotas.”**

Só depois desse prompt deve vir o patch técnico. O patch mais seguro pós-decisão é implementar uma trava de QA que compare o status documental aprovado com o estado público do executável antes de permitir `qa:blog`/`build` como sinal de publicação.
