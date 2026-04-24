# RELATÓRIO DE AUDITORIA — BLOG PAVIE NO WORKSPACE ATUAL

Data da auditoria: 2026-04-24  
Diretório de trabalho auditado: `C:\dev\PAVIE-091025\blog`  
Raiz Git detectada: `C:\dev\PAVIE-091025`  
Branch no momento da auditoria: `codex/sprint-testes-condicionados`

Observação operacional: o relatório foi produzido sem alterar código de produção, conteúdo, registry, rotas, CMS, deploy, dependências, commits ou push. Foram criados apenas `relatorios_codex/` e este arquivo.

## 1. Diretório auditado

O diretório auditado é `C:\dev\PAVIE-091025\blog`.

Estrutura principal encontrada no diretório atual:

- `.astro/` — cache/tipos gerados do Astro já existentes.
- `.vscode/` — arquivos de configuração local.
- `analysis/` — inventários e documentos auxiliares históricos.
- `artifacts/` — evidências visuais/logs de rodadas anteriores.
- `book-visual-pavie-2026-03-08/` — book visual legado.
- `dist/` — build estático já existente, datado de 2026-04-20.
- `docs/` — documentos canônicos e de implantação do blog/site.
- `functions/` — Cloudflare Pages Functions para Decap OAuth (`api/auth.ts`, `api/callback.ts`).
- `legal-copy/` — instruções sensíveis para copy pública.
- `node_modules/` — dependências já instaladas.
- `public/` — assets, Decap CMS, uploads, headers, redirects, robots, scripts públicos.
- `scripts/` — validadores e QA do blog.
- `site/` — apenas `AGENTS.md` de escopo institucional; não contém implementação do site.
- `src/` — implementação Astro.
- `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`.

O workspace atual não é apenas um blog puro. Dentro de `blog/` há:

- superfícies editoriais do blog: `/blog/`, `/blog/categoria/[slug]/`, `/blog/[slug]/`, `/blog/autor/[slug]/`;
- superfícies institucionais no mesmo app Astro: `/`, `/sobre/`, `/areas/[slug]/`, `/contato/`;
- CMS Decap em `/admin/`;
- funções de autenticação do CMS.

Também existe, fora do diretório atual, conteúdo institucional na raiz do repositório (`C:\dev\PAVIE-091025`), incluindo `index.html`, `_redirects`, `_headers`, `robots.txt`, `sitemap.xml`, `functions/api/contato.js` e pastas `site/`, `src/`, `contato/`, `privacidade/`, `termos/`. Esses arquivos não foram tratados como parte do diretório auditado, mas são dependência externa relevante para domínio/deploy.

Lacunas de localização documental:

- Os caminhos literais exigidos por `blog/AGENTS.md` (`../12.02...`, `../12.06...`, `../13.05...`) não existem no parent direto.
- Os documentos correspondentes foram encontrados em `docs/`.
- A Constituição 00.00 existe em `analysis/pavie_docs/`, mas a auditoria usou principalmente o Registro Mestre, a Matriz Canônica, `12.02`, `12.06`, `13.05`, `AGENTS.md` raiz e `legal-copy/AGENTS.md`, todos presentes no workspace.

## 2. Síntese executiva

Status geral: **HOLD**.

O blog tem uma base técnica consistente: Astro 5, content collections, registry canônico com 8 categorias, páginas B1/B2/B3/B4 implementadas, Decap CMS configurado, scripts de validação e acervo público mínimo de 5 posts em `CAT-08`.

Mesmo assim, não está pronto para publicação/divulgação ampla sem correções. Os bloqueios principais são:

1. `npm run qa:blog` falha porque a B3 reintroduz elementos que o próprio QA considera removidos ou não aceitos: CTA final de transição, bloco de autor e evento antigo `editorial_b3_s2_final_cta_click`.
2. Sete categorias canônicas (`CAT-01` a `CAT-07`) existem como rotas B2 indexáveis, mas estão vazias.
3. O sitemap inclui categorias vazias, páginas institucionais no domínio do blog, `/contato/`, `/sobre/`, `/areas/...` e o post `hello-blog`, apesar de `hello-blog` estar com `noindex: true`.
4. `public/robots.txt` aponta o sitemap para `https://pavieadvocacia.com.br/sitemap-index.xml`, enquanto o build gera sitemap em `https://blog.pavieadvocacia.com.br/sitemap-0.xml`.
5. `public/_redirects` redireciona `/contato/` para `/#contato`, mas o app gera uma página `/contato/` e o footer/header apontam para contato institucional.
6. O app atual contém formulário institucional robusto em `/contato/`, mas dentro do diretório do blog não existe `functions/api/contato`; a função aparece apenas fora do diretório atual.
7. B4 usa autor com `reviewStatus: pending`, embora bio/autoria sejam copy pública sensível.

Decisão executiva: **HOLD para publicação; preservar a base; corrigir domínio/SEO/rotas e alinhar B3 antes de divulgar.**

## 3. Estrutura técnica encontrada

Stack real:

- Astro `^5.15.8`.
- TypeScript com `astro/tsconfigs/strict`.
- MDX habilitado.
- `@astrojs/rss`.
- `@astrojs/sitemap`.
- `sharp`.
- Decap CMS via CDN em `public/admin/index.html`.
- Cloudflare Pages Functions para OAuth do Decap em `functions/api/auth.ts` e `functions/api/callback.ts`.

Scripts em `package.json`:

- `dev`: `astro dev`
- `prebuild`: `npm run validate:content`
- `build`: `astro build`
- `precheck`: `npm run validate:content`
- `check`: `astro check`
- `audit:pre-sprint-2`: `node scripts/pre-sprint-2-audit.mjs`
- `qa:blog`: `node scripts/qa-blog-publication.mjs`
- `validate:content`: `node scripts/validate-content-model.mjs`
- `preview`: `astro preview`

Rotas Astro encontradas:

- `/` em `src/pages/index.astro`
- `/sobre/` em `src/pages/sobre.astro`
- `/contato/` em `src/pages/contato/index.astro`
- `/areas/[slug]/` em `src/pages/areas/[slug].astro`
- `/blog/` em `src/pages/blog/index.astro`
- `/blog/[slug]/` em `src/pages/blog/[slug].astro`
- `/blog/autor/[slug]/` em `src/pages/blog/autor/[slug].astro`
- `/blog/categoria/[slug]/[...page]` em `src/pages/blog/categoria/[slug]/[...page].astro`
- `/rss.xml` em `src/pages/rss.xml.js`

Collections encontradas em `src/content.config.ts`:

- `posts` com loader em `src/content/blog`.
- `areas` com loader em `src/content/areas`.
- `authors` com loader em `src/content/authors`.

Componentes/layouts relevantes:

- `BaseLayout.astro`, `BlogLayout.astro`, `PostLayout.astro`, `ReadingLayout.astro`.
- `BaseHead.astro` para SEO básico.
- `components/blog/*` para cards, breadcrumbs, hero, CTA, autor, sidebar e analytics.
- `components/site/Header.astro` e `components/site/Footer.astro`.
- `styles/blog.css`, `styles/reading.css`, `styles/site-home.css`, `styles/institutional-pages.css`, `styles/contact-page.css`.

Arquivos de deploy/config no diretório atual:

- `astro.config.mjs`: `site` default `https://blog.pavieadvocacia.com.br`.
- `public/_headers`: CSP, noindex para `/admin/*`, cache/control headers.
- `public/_redirects`: redirects de `/about`, `/areas`, `/contato`.
- `public/robots.txt`: permite indexação geral, bloqueia `/admin/`, mas aponta sitemap para o domínio institucional.
- `public/admin/config.yml`: Decap CMS.
- Não há `wrangler.toml`, `netlify.toml`, `vercel.json` ou `.github/` dentro de `blog/`.

Validações executadas:

- `npm run validate:content` — **OK**, com mensagem: `OK 8 categorias canonicas validadas`.
- `npm run qa:blog` — **FALHOU**, embora tenha verificado 28 HTMLs sem links internos ausentes. A falha veio da B3, com reentrada de CTA/autor/evento antigo.

Não foram executados `npm run build` nem `npm run check`, para evitar geração/alteração de arquivos fora de `relatorios_codex/` durante esta auditoria. O diretório `dist/` existente foi inspecionado como evidência já gerada.

## 4. Estrutura editorial encontrada

Categorias canônicas no registry (`src/data/categories.registry.ts`):

| Código | Categoria | Slug de categoria/área | Estado de acervo público |
|---|---|---|---|
| CAT-01 | Sucessões, Inventários e Partilha Patrimonial | `sucessoes-inventarios-partilha-patrimonial` | vazia |
| CAT-02 | Planejamento Patrimonial, Sucessório e Arranjos Preventivos | `planejamento-patrimonial-sucessorio-arranjos-preventivos` | vazia |
| CAT-03 | Família Patrimonial e Dissoluções | `familia-patrimonial-dissolucoes` | vazia |
| CAT-04 | Família Binacional, Sucessões Internacionais e Cooperação Documental | `familia-binacional-sucessoes-internacionais-cooperacao-documental` | vazia |
| CAT-05 | Imóveis, Registro, Regularizações e Litígios Patrimoniais | `imoveis-registro-regularizacoes-litigios-patrimoniais` | vazia |
| CAT-06 | Cobrança, Execução, Contratos e Recuperação de Crédito Seletiva | `cobranca-execucao-contratos-recuperacao-credito-seletiva` | vazia |
| CAT-07 | Tributação Patrimonial e Recuperação Tributária Seletiva | `tributacao-patrimonial-recuperacao-tributaria-seletiva` | vazia |
| CAT-08 | Direito do Consumidor e Responsabilidade Civil | `direito-do-consumidor-responsabilidade-civil` | 5 posts públicos |

Posts encontrados em `src/content/blog`:

| Arquivo | Slug | Categoria | Tipo | Publicável |
|---|---|---|---|---|
| `cat08-cornerstone.md` | `direito-consumidor-situacoes-documentaveis-organizar-problema-analise-juridica` | CAT-08 | `cornerstone` | sim |
| `cat08-guide-documentos.md` | `documentos-casos-voo-cobranca-negativacao-compras-online` | CAT-08 | `guide` | sim |
| `cat08-checklist.md` | `documentos-minimos-analise-juridica-consumo-responsabilidade-civil` | CAT-08 | `checklist` | sim |
| `cat08-faq.md` | `perguntas-voo-atrasado-nome-negativado-cobranca-compra-nao-entregue` | CAT-08 | `faq` | sim |
| `cat08-spoke-negativacao.md` | `nome-negativado-indevidamente-organizar-situacao-analise-caso` | CAT-08 | `spoke` | sim |
| `hello-blog.md` | `hello-blog` | CAT-08 | `guide` | não deve ser divulgado; `noindex: true` |

Todos os 5 posts públicos de `CAT-08` têm:

- `draft: false`;
- `noindex: false`;
- `authorId: fabio-pavie`;
- `categoryCode: CAT-08`;
- `legalReview: reviewed`;
- `editorialReview: reviewed`;
- `relatedPosts`;
- `relatedAreas`.

O post `hello-blog.md` está com `draft: false`, `noindex: true`, `migrationStatus: migrated`, e é renderizado como rota acessível. O sitemap gerado inclui `hello-blog`, o que conflita com o `noindex`.

Autor:

- Arquivo: `src/content/authors/fabio-mathias-pavie.md`
- ID: `fabio-pavie`
- Slug: `fabio-pavie`
- OAB: `OAB/RJ 134.947`
- `reviewStatus: pending`

Áreas:

- Há 8 arquivos em `src/content/areas`, um por categoria.
- Todos estão `isActive: true`.
- Todos estão com `reviewStatus: pending`.
- As páginas são geradas e indexáveis mesmo com revisão pendente.

## 5. Auditoria da B1 — Home do blog

Decisão: **GO condicionado / HOLD para publicação ampla**.  
Ação: **preservar + adaptar + validar**.

Pontos fortes:

- B1 existe em `src/pages/blog/index.astro`.
- Usa `isPublicPost`, portanto só seleciona posts com `draft: false`, `noindex: false`, taxonomia resolvida e data.
- Não é arquivo cronológico puro: usa seleção editorial (`buildB1Selection`) com destaques, leituras úteis e recentes subordinadas.
- Mostra categorias a partir do registry central.
- Não transforma categorias vazias em links clicáveis na faixa da home; mostra `Em preparacao`.
- Tem bloco de autoria e retorno ao site institucional.
- Schema `CollectionPage` usa `BLOG_SITE_URL`.

Gargalos:

- B1 depende de acervo real em apenas uma categoria (`CAT-08`). Isso é aceitável para fase controlada, mas não para divulgação ampla do blog como ecossistema completo.
- A home do blog está pronta para ser uma camada editorial inicial, mas não para sugerir maturidade de todas as 8 categorias.
- Deve ser validada visualmente após a correção da B3 e do sitemap.

## 6. Auditoria da B2 — Categorias

Decisão: **HOLD / REFAZER parcialmente**.  
Ação: **adaptar + validar + documentar**.

Pontos fortes:

- B2 existe em `src/pages/blog/categoria/[slug]/[...page].astro`.
- As categorias são geradas a partir de `buildCanonicalAreaDirectory`.
- Cada B2 tem breadcrumb, hero, contagem, relação área-categoria, leitura em destaque, lista paginada, CTA final para a área institucional e bloco de autor.
- A relação categoria -> área está tecnicamente resolvida pelo registry.

Problema bloqueador:

- Sete categorias (`CAT-01` a `CAT-07`) estão vazias, mas são geradas como páginas indexáveis e entram no sitemap.
- Isso conflita com a premissa operacional de que categoria não pode ficar vazia.

Evidência:

- `npm run qa:blog`: `CAT-01=0`, `CAT-02=0`, `CAT-03=0`, `CAT-04=0`, `CAT-05=0`, `CAT-06=0`, `CAT-07=0`, `CAT-08=5`.
- `dist/blog/categoria/sucessoes-inventarios-partilha-patrimonial/index.html` contém estado `Acervo em preparacao`, mas `robots` está `index,follow`.

Encaminhamento:

- Antes de publicar, escolher uma das duas vias:
  - criar ao menos um texto revisado por categoria que será indexada; ou
  - manter categorias vazias sem link dominante, `noindex` e fora do sitemap até receberem acervo mínimo.

## 7. Auditoria da B3 — Artigos

Decisão: **REFAZER parcialmente antes de publicar**.  
Ação: **adaptar + testar + validar**.

Pontos fortes:

- B3 existe em `src/pages/blog/[slug].astro`.
- O template usa `PostLayout`/`ReadingLayout`.
- Há breadcrumb, hero, metadata de artigo, schema `BlogPosting`, sumário, sidebar de categorias e leituras da mesma categoria.
- Os posts têm boa estrutura editorial: dor concreta, critérios, limites, encaminhamento prudente e interlinks internos.
- O tom dos textos de `CAT-08` evita promessa de resultado e reforça prova/documentação.

Problemas bloqueadores:

1. O QA local falha por reentrada da "cauda" da B3:
   - `Transição para o site`;
   - `Conheça a área correspondente`;
   - `Conteúdo informativo. Cada caso exige análise técnica individual.`;
   - `Responsável pelo conteúdo`.
2. O evento `editorial_b3_s2_final_cta_click` reapareceu no HTML final, mas o script o trata como evento antigo não aceito.
3. `ReadingLayout.astro` sempre prioriza `post.areaUrl` para o CTA final. Assim, posts com `ctaType: document-review` e `ctaTarget: /contato/` acabam renderizando CTA para área institucional, não para o destino declarado no frontmatter.
4. O post `hello-blog` está `noindex`, mas é gerado e entrou no sitemap.

Evidência:

- `npm run qa:blog` falhou com erros nas cinco rotas públicas de `CAT-08`.
- `src/layouts/ReadingLayout.astro` importa e renderiza `AuthorBox` e `ArticleFooterCTA`.
- `src/components/blog/ArticleFooterCTA.astro` contém `Transição para o site`.
- `src/components/blog/AuthorBox.astro` contém `Responsável pelo conteúdo`.

Encaminhamento:

- Alinhar código e QA: ou a B3 aceita formalmente esses blocos, com o QA atualizado e validação documental, ou os blocos devem sair do template B3.
- Ajustar renderização para respeitar `ctaType`/`ctaTarget`, ou revisar o contrato do frontmatter se a decisão canônica for sempre reconduzir à área.
- Excluir `noindex` do sitemap.

## 8. Auditoria da B4 — Autor

Decisão: **HOLD**.  
Ação: **validar + adaptar**.

Pontos fortes:

- B4 existe em `src/pages/blog/autor/[slug].astro`.
- A página é claramente editorial, não uma mini página institucional paralela.
- Contém breadcrumb, schema `Person`, textos do autor e ponte para o site institucional.
- A copy delimita que a página sustenta autoria e que o site concentra relação institucional.

Gargalo:

- O autor está com `reviewStatus: pending`, mas a página é pública/indexável.
- Bio e autoria são copy pública sensível pelas normas de `legal-copy/AGENTS.md`; devem ser tratadas como dependentes de revisão humana até homologação.

Encaminhamento:

- Validar/homologar a bio do autor antes de divulgação.
- Se a bio permanecer pendente, considerar `noindex` temporário ou bloqueio de publicação pública da B4.

## 9. Auditoria do R1 — Rodapé

Decisão: **GO condicionado**.  
Ação: **preservar + validar links**.

Pontos fortes:

- R1 existe em `src/components/site/Footer.astro`.
- Distingue assinatura textual em superfície de blog versus superfície institucional.
- Faz ponte site-blog sem CTA agressivo.
- Inclui links institucionais, editoriais, contato e base legal.
- O aviso do blog reforça que o conteúdo é público/informativo e que a análise individual ocorre na camada institucional.

Riscos:

- Em superfície de blog, o footer exibe e-mail e telefone diretamente. Isso não é necessariamente indevido, mas deve ser validado para não funcionar como CTA concorrente ao CTA final disciplinado.
- Links legais são relativos (`/legal/...`) e funcionam se os PDFs estiverem no mesmo deploy do blog; se o site institucional for outro deploy, a política pública precisa confirmar qual domínio hospeda os documentos.

## 10. Decap CMS e fluxo editorial

Decisão: **HOLD operacional**.  
Ação: **validar + adaptar + documentar**.

Configuração encontrada:

- `backend.name: github`
- `repo: PAVIEAdvocacia/PAVIE-091025`
- `branch: main`
- `base_url: https://blog.pavieadvocacia.com.br`
- `auth_endpoint: /api/auth`
- `local_backend: true`
- `publish_mode: simple`
- `media_folder: blog/public/uploads`
- `public_folder: /uploads`
- Collections: `posts`, `areas`, `authors`.

Pontos fortes:

- O CMS usa campos canônicos para posts: `categoryCode`, `contentType`, `readerStage`, `ctaType`, `ctaTarget`, `authorId`, `legalReview`, `editorialReview`, `migrationStatus`, `draft`, `noindex`.
- `areas` e `authors` estão controlados e `delete: false`.
- `posts` usa relation para autores, áreas e posts relacionados.
- A autenticação GitHub via Cloudflare Pages Functions está presente no diretório atual.

Riscos:

- `publish_mode: simple` publica direto na branch configurada; não há fluxo editorial de branch/editorial workflow no Decap.
- `posts.delete: true` permite apagar conteúdo pelo CMS; isso pode ser aceitável, mas deve ser governado.
- A função `/api/contato` não existe dentro de `blog/functions`; existe apenas fora do diretório atual, em `C:\dev\PAVIE-091025\functions\api\contato.js`.
- A configuração do Decap pressupõe repo root com subpasta `blog/`, o que é coerente com o Git root detectado, mas precisa ser validado no Cloudflare Pages.

## 11. Taxonomia e registry

Decisão: **GO para registry; HOLD para publicação das categorias vazias**.  
Ação: **preservar + validar**.

Pontos fortes:

- `src/data/categories.registry.ts` contém exatamente as 8 categorias canônicas.
- `categorySlug` e `areaSlug` preservam vínculo 1:1.
- `CAT-08` está independente e com slug correto `direito-do-consumidor-responsabilidade-civil`.
- `src/data/areas.registry.ts` deriva do registry de categorias.
- `src/content.config.ts` valida `categoryCode`, `contentType`, `readerStage`, `ctaType`, revisão e migração.
- `npm run validate:content` confirmou `OK 8 categorias canonicas validadas`.

Riscos:

- Há campos legados tolerados no schema (`area`, `legacyAreaKey`, `primary_cta`, `funnel_stage`, `status`, etc.). Isso é útil para migração, mas deve continuar subordinado ao modelo canônico.
- As categorias vazias aparecem como páginas e URLs indexáveis no build.
- Todas as áreas estão `reviewStatus: pending` e ainda assim geram páginas públicas.

## 12. Domínio, rotas e deploy

Decisão: **HOLD / REFAZER antes de publicar**.  
Ação: **adaptar + testar + validar externamente**.

Indícios positivos:

- `astro.config.mjs` define `site` default como `https://blog.pavieadvocacia.com.br`.
- `src/consts.ts` separa `MAIN_SITE_URL` (`https://pavieadvocacia.com.br`) e `BLOG_SITE_URL` (`https://blog.pavieadvocacia.com.br`).
- B1 e B4 apontam explicitamente o retorno ao site via `MAIN_SITE_URL`.
- S2 aponta leituras para o blog via `BLOG_SITE_URL`.
- Sitemap gerado em `dist/sitemap-index.xml` aponta para `https://blog.pavieadvocacia.com.br/sitemap-0.xml`.

Problemas:

- `public/robots.txt` aponta para `https://pavieadvocacia.com.br/sitemap-index.xml`, divergindo do sitemap gerado para o blog.
- `dist/sitemap-0.xml` inclui:
  - `/`;
  - `/sobre/`;
  - `/contato/`;
  - `/areas/...`;
  - categorias vazias;
  - `hello-blog`, embora `hello-blog` esteja com meta `noindex`.
- `public/_redirects` redireciona `/contato/` para `/#contato`, mas existe página `/contato/` no app e ela entra no sitemap.
- `README-PAGES.md` na raiz fala em build unificado com output `pages_out`, mas não há `package.json` nem `pages_out` na raiz atual.
- Não há `.github/` no diretório atual nem na raiz detectada.
- Não há `wrangler.toml` ou arquivo explícito de Cloudflare Pages no diretório atual.
- `src/lib/seo.ts` resolve URLs relativas com base em `MAIN_SITE_URL`; isso pode gerar schema de breadcrumb/imagem apontando para o domínio institucional em páginas do blog, quando o item relativo deveria pertencer ao blog.

Dependências externas:

- Confirmar se o Cloudflare Pages build root é `blog/` ou a raiz do repo.
- Confirmar se o deploy do blog deve publicar apenas o subdomínio `blog.pavieadvocacia.com.br` ou também páginas institucionais.
- Confirmar se `/contato/` deve existir no blog, no site institucional, ou apenas no site.
- Confirmar variáveis de ambiente do Decap OAuth (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`) e do formulário (`TURNSTILE_SECRET`, `APP_SCRIPT_WEBAPP_URL` etc.) no projeto correto.

## 13. Instagram como camada futura

Decisão: **GO condicionado para reaproveitamento editorial de CAT-08; HOLD para campanha ampla**.  
Ação: **adaptar + validar + documentar**.

Conteúdos que já podem alimentar Instagram após revisão de copy derivada:

- `direito-consumidor-situacoes-documentaveis-organizar-problema-analise-juridica`
- `documentos-casos-voo-cobranca-negativacao-compras-online`
- `documentos-minimos-analise-juridica-consumo-responsabilidade-civil`
- `perguntas-voo-atrasado-nome-negativado-cobranca-compra-nao-entregue`
- `nome-negativado-indevidamente-organizar-situacao-analise-caso`

Por quê:

- São textos revisados no frontmatter.
- Têm dor clara, utilidade prática e limites éticos.
- Servem bem para carrosséis de checklist, FAQ, documentação mínima e critérios de triagem.

Conteúdo que não deve alimentar Instagram:

- `hello-blog`, por ser post piloto/migrado, `noindex: true`, e não adequado para divulgação pública.

Limites:

- Instagram deve apontar para o artigo ou categoria do blog e, quando necessário, reconduzir ao site institucional.
- Instagram não deve criar nova taxonomia, novo CTA comercial ou terceira sede de conversão.
- Antes de campanha ampla, corrigir B3, sitemap/robots e categorias vazias.

## 14. Matriz de gargalos

| ID | Frente | Arquivo/rota | Achado | Evidência | Risco | Decisão | Ação | Prioridade |
|---|---|---|---|---|---|---|---|---|
| G01 | QA B3 | `src/layouts/ReadingLayout.astro`, `ArticleFooterCTA.astro`, `AuthorBox.astro` | QA reprova cauda da B3 e evento antigo | `npm run qa:blog` falhou | Publicar artigo com template em desacordo com QA interno | REFAZER | adaptar/testar | P0 |
| G02 | Categorias | `/blog/categoria/*` | CAT-01 a CAT-07 estão vazias e indexáveis | QA: contagem 0; dist contém páginas | Categoria vazia publicada | HOLD | adaptar/validar | P0 |
| G03 | Sitemap | `dist/sitemap-0.xml`, `astro.config.mjs` | Sitemap inclui `hello-blog` noindex e categorias vazias | `hello-blog` presente no sitemap e meta `noindex` | Sinal SEO contraditório | REFAZER | adaptar/testar | P0 |
| G04 | Robots | `public/robots.txt` | Sitemap declarado aponta domínio institucional | Linha `Sitemap: https://pavieadvocacia.com.br/sitemap-index.xml` | Search engines podem consumir sitemap errado | REFAZER | adaptar/validar | P0 |
| G05 | Redirect contato | `public/_redirects`, `/contato/` | `/contato/` gerado, mas redirect envia para `/#contato` | `_redirects` linhas `/contato` | Página de contato pode ficar inacessível | REFAZER | adaptar/testar | P0 |
| G06 | Função contato | `src/pages/contato/index.astro`, `functions/` | Form aponta `/api/contato`, mas função não está no diretório atual | `blog/functions` só tem auth/callback | Formulário quebrado se deploy root for `blog/` | HOLD | validar/documentar | P0 |
| G07 | Domínio | `src/pages/index.astro`, `/sobre/`, `/areas/`, `/contato/` | App do blog também publica superfícies institucionais | Sitemap inclui rotas institucionais em blog domain | Blog virar segunda sede comercial | HOLD | validar/adaptar | P0 |
| G08 | Autor | `src/content/authors/fabio-mathias-pavie.md` | `reviewStatus: pending` em autor público | frontmatter do autor | Bio sensível sem homologação final | HOLD | validar | P1 |
| G09 | Áreas | `src/content/areas/*.md` | 8 áreas com `reviewStatus: pending`, mas páginas públicas | frontmatter das áreas | Copy institucional sensível publicada sem revisão | HOLD | validar | P1 |
| G10 | CTA B3 | `ReadingLayout.astro` | `ctaType: document-review` não governa destino final; área ganha prioridade | `areaHref = post.areaUrl ?? ...` | Frontmatter não reflete render real | REFAZER | adaptar | P1 |
| G11 | Decap workflow | `public/admin/config.yml` | `publish_mode: simple` em `main` | config do CMS | Publicação direta sem workflow editorial | HOLD | documentar/validar | P1 |
| G12 | Schema URLs | `src/lib/seo.ts` | `toAbsoluteUrl` usa `MAIN_SITE_URL` para relativos | função `toAbsoluteUrl` | Breadcrumb/schema do blog pode apontar domínio errado | HOLD | adaptar/testar | P1 |
| G13 | Deploy docs | `README-PAGES.md` raiz | Menciona `pages_out`, mas não há build unificado na raiz atual | sem `package.json` raiz e sem `pages_out` | Configuração de Pages ambígua | DEVOLVER À CAMADA DOCUMENTAL | documentar | P1 |
| G14 | Decap repo root | `public/admin/config.yml` | paths `blog/src/...` pressupõem repo root acima do app | config Decap + Git root | Correto se Cloudflare/GitHub usam raiz; frágil se app isolado | HOLD | validar | P2 |
| G15 | Instagram | posts CAT-08 | Conteúdo aproveitável, mas infraestrutura ainda em HOLD | 5 posts revisados | Divulgar URLs antes de SEO/rotas corrigidos | HOLD | validar/adaptar | P2 |

## 15. Backlog operacional

| ID | Item | Arquivo/rota provável | Classe | Prioridade | Dependência | Critério de aceite | Prompt futuro |
|---|---|---|---|---|---|---|---|
| BKL-01 | Corrigir B3 conforme QA ou atualizar QA conforme decisão homologada | `ReadingLayout.astro`, `ArticleFooterCTA.astro`, `AuthorBox.astro`, `qa-blog-publication.mjs` | REFAZER | P0 | Decisão sobre B3 limpa vs B3 com CTA/autor | `npm run qa:blog` passa sem erros | "Ajuste a B3 para passar no QA sem alterar taxonomia nem conteúdo dos posts." |
| BKL-02 | Excluir noindex e categorias vazias do sitemap | `astro.config.mjs`, rotas B2/B3 | REFAZER | P0 | Critério de indexação por superfície | Sitemap não contém `hello-blog` nem categorias vazias indexáveis | "Implemente filtro de sitemap para noindex e categorias sem acervo público." |
| BKL-03 | Resolver destino de `/contato/` | `public/_redirects`, `src/pages/contato/index.astro`, deploy | REFAZER | P0 | Decisão site vs blog para contato | `/contato/` não é simultaneamente rota gerada e redirect conflitante | "Audite e corrija a rota de contato sem criar CTA comercial concorrente no blog." |
| BKL-04 | Validar deploy root e funções | Cloudflare Pages, `functions/`, parent `functions/api/contato.js` | VALIDAR | P0 | Acesso/configuração Cloudflare | `/api/auth`, `/api/callback` e `/api/contato` existem no projeto correto | "Mapeie o deploy Cloudflare e alinhe functions ao root real do projeto." |
| BKL-05 | Corrigir `robots.txt` do blog | `public/robots.txt` | REFAZER | P0 | Domínio final do blog | Robots aponta para sitemap correto do blog | "Ajuste robots do blog para apontar o sitemap correto sem mexer em conteúdo." |
| BKL-06 | Definir se páginas institucionais ficam no app do blog | `/`, `/sobre/`, `/areas/*`, `/contato/` | DEVOLVER À CAMADA DOCUMENTAL | P0 | Arquitetura site x blog | Não há duplicidade entre blog domain e site institucional | "Produza decisão operacional sobre separar ou unificar site e blog no deploy." |
| BKL-07 | Homologar autor B4 | `src/content/authors/fabio-mathias-pavie.md` | VALIDAR | P1 | Revisão humana | `reviewStatus` deixa de estar pendente ou B4 fica noindex temporário | "Validar copy de autor contra matriz canônica e legal-copy." |
| BKL-08 | Homologar áreas S2 | `src/content/areas/*.md` | VALIDAR | P1 | Revisão humana | Áreas públicas com review aprovado ou noindex até aprovação | "Audite as 8 páginas de área contra a Matriz Canônica." |
| BKL-09 | Corrigir renderização de CTA por `ctaType` | `ReadingLayout.astro`, `posts.ts` | ADAPTAR | P1 | Decisão B3 | CTA final ou ausência dele corresponde ao frontmatter | "Faça o template respeitar `ctaType`/`ctaTarget` sem agressividade comercial." |
| BKL-10 | Corrigir base de URLs em schema | `src/lib/seo.ts` | ADAPTAR | P1 | Política de domínios | Breadcrumb/schema usam blog ou site conforme superfície | "Separe helpers de URL absoluta para blog e site institucional." |
| BKL-11 | Criar acervo mínimo para CAT-01 a CAT-07 ou bloquear indexação | `src/content/blog`, rotas B2 | CRIAR/ADAPTAR | P1 | Planejamento editorial e revisão jurídica | Nenhuma categoria indexável fica vazia | "Planeje acervo mínimo por categoria sem criar nova taxonomia." |
| BKL-12 | Consolidar documentação de deploy | README/relatório futuro | DOCUMENTAR | P2 | Confirmação Cloudflare/GitHub | Documento único informa build root, output, domínio e redirects | "Crie nota operacional de deploy do blog atual." |
| BKL-13 | Preparar pacote Instagram CAT-08 | `prompts_codex/` ou relatório social futuro | ADAPTAR | P2 | URLs estáveis após correções | Peças derivadas apontam para artigos corrigidos | "Transforme os 5 artigos CAT-08 em pautas de Instagram sem criar CTA comercial." |

## 16. Conclusão executiva

O que falta para finalizar o blog?

- Fazer `npm run qa:blog` passar.
- Corrigir B3 ou reconciliar o QA com a decisão homologada.
- Resolver sitemap/robots/noindex/categorias vazias.
- Resolver conflito de `/contato/` e confirmar onde o formulário institucional deve viver.
- Homologar autor e áreas, ou bloquear indexação temporária.
- Confirmar deploy root, domínios, functions e redirects no Cloudflare/GitHub.

O que está pronto?

- Stack Astro e content collections.
- Registry com 8 categorias canônicas.
- Decap CMS com campos principais do frontmatter canônico.
- B1, B2, B3, B4 e R1 tecnicamente implementados.
- 5 posts revisados em `CAT-08`.
- Interlinking básico entre blog, categoria, área, autor e site.
- Validador de modelo de conteúdo aprovado.

O que deve ser corrigido antes de publicar?

- B3 reprovada no QA.
- Categorias vazias indexáveis.
- `hello-blog` no sitemap apesar de `noindex`.
- `robots.txt` com sitemap do domínio errado.
- Redirect de `/contato/`.
- Ambiguidade de publicar páginas institucionais no domínio do blog.

O que depende do site institucional?

- A decisão sobre `/`, `/sobre/`, `/areas/` e `/contato/` dentro do app Astro do blog.
- A confirmação de que o site institucional real em `pavieadvocacia.com.br` é a sede de conversão.
- A validação de links blog -> site e site -> blog.
- A função real de `/api/contato`.

O que depende de validação externa de domínio/deploy?

- Cloudflare Pages build root e output directory.
- Domínios finais (`blog.pavieadvocacia.com.br` e `pavieadvocacia.com.br`).
- Variáveis de ambiente do Decap OAuth e do formulário.
- Se `_redirects` do diretório atual ou da raiz prevalecem no deploy.
- Se as functions da raiz e de `blog/functions` são combinadas ou isoladas.

O que já pode ser usado para Instagram?

- Os 5 posts de `CAT-08` podem gerar pautas e carrosséis depois de revisão derivada e depois da estabilização das URLs.
- `hello-blog` não deve ser usado.
- CAT-01 a CAT-07 ainda não devem alimentar Instagram como categorias ativas, pois não têm acervo público.

Qual é a próxima ação mais segura?

Corrigir primeiro a camada de publicação: B3 + sitemap/robots + redirects/domínio. Só depois ampliar acervo, divulgar no Instagram ou tratar o blog como publicável.
