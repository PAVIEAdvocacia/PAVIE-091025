# 09 - Sprint tecnica controlada de alinhamento do executavel a PRODUCAO saneada

Data: 2026-04-26  
Workspace: `C:\dev\PAVIE-091025`  
Escopo executavel: `blog/`

## 1. Sintese executiva

Status da sprint: concluida tecnicamente, sem `git add`, sem commit e sem alteracao em `C:\dev\PRODUCAO`.

Fato verificado: a PRODUCAO saneada foi recebida como contexto do prompt, e os documentos locais do blog ja tratam CAT-08 como categoria canonica. A leitura de `blog/AGENTS.md`, `blog/docs/12.02...`, `blog/docs/12.06...` e `blog/docs/13.05...` confirmou CAT-01 a CAT-08 como categorias canonicas, com CAT-08 equivalente.

Alteracoes executadas: `robots.txt` do blog passou a apontar para o sitemap do subdominio do blog; redirects raiz de `/blog` passaram a apontar explicitamente para `/blog/`; a validacao deixou de exigir minimo fixo de 5 posts CAT-08 e passou a exigir prontidao proporcional para qualquer categoria com acervo publico; a auditoria antiga nao rastreada `08_auditoria_readonly_CAT08_pos_P0.md` foi removida.

Nao executado: build nao foi rodado para evitar regravacao de `dist/`. O `dist/` atual permanece artefato ignorado e pode estar defasado em relacao a `blog/public/robots.txt` ate o proximo build controlado.

## 2. Estado Git inicial

Comandos iniciais executados em `C:\dev\PAVIE-091025`:

```text
git log -1 --oneline
f5738c5 Update blog governance instructions
```

```text
git status -sb
## main...origin/main
?? blog/docs/auditoria_blog/
```

```text
git diff --stat
sem saida
```

```text
git diff --cached --stat
sem saida
```

```text
git ls-files --others --exclude-standard
blog/docs/auditoria_blog/08_auditoria_readonly_CAT08_pos_P0.md
```

Fato verificado: o unico arquivo nao rastreado inicial era a auditoria `08` antiga. Nao havia diff tracked nem staged no inicio.

## 3. Divergencias da auditoria 42 tratadas

1. Robots/sitemap: confirmado que `blog/public/robots.txt` apontava para `https://pavieadvocacia.com.br/sitemap-index.xml`, enquanto `blog/astro.config.mjs` e `blog/dist/sitemap-index.xml` usam `https://blog.pavieadvocacia.com.br`.
2. Redirect raiz `/blog`: confirmado em `_redirects` que `/blog` e `/blog/` apontavam para `https://blog.pavieadvocacia.com.br/`.
3. Auditoria antiga nao rastreada: confirmado que `blog/docs/auditoria_blog/08_auditoria_readonly_CAT08_pos_P0.md` existia, nao era rastreada e continha premissa superada de CAT-08 como cluster/HOLD.
4. Residuos historicos rastreados: confirmado que `blog/relatorios_codex/09_TRAVA_TECNICA_PUBLICACAO_BLOG.md`, `relatorios_codex/10_ORQUESTRACAO_SITE_BLOG_PATCHES.md`, `relatorios_codex/10_MATRIZ_ORQUESTRACAO_SITE_BLOG_PATCHES.csv` e `blog-main-audit/` existem como historico rastreado. Foram preservados.
5. Rigidez de QA: confirmado em `blog/scripts/validate-content-model.mjs` que havia regra fixa: `CAT-08 exige acervo minimo de 5 artigos publicados.`

## 4. Alteracoes executadas

Alteracao executada: `blog/public/robots.txt` foi alinhado ao host do sitemap gerado pelo Astro:

```text
antes: Sitemap: https://pavieadvocacia.com.br/sitemap-index.xml
depois: Sitemap: https://blog.pavieadvocacia.com.br/sitemap-index.xml
```

Alteracao executada: redirects raiz de `/blog` em `_redirects` agora preservam explicitamente o prefixo editorial `/blog/` no subdominio:

```text
antes: /blog   https://blog.pavieadvocacia.com.br/        301
depois: /blog  https://blog.pavieadvocacia.com.br/blog/   301
```

Alteracao executada: o wildcard `/blog/*` tambem passou a preservar o prefixo `/blog/:splat`, evitando que URLs antigas do dominio raiz criem destino paralelo na raiz do subdominio.

Alteracao executada: `validate-content-model.mjs` deixou de aplicar minimo fixo apenas para CAT-08 e passou a exigir, para qualquer categoria com posts publicos indexaveis, prontidao proporcional minima: ao menos 1 `cornerstone`/`guide` e 1 `faq`/`checklist`/`spoke`.

Alteracao executada: arquivo antigo nao rastreado `blog/docs/auditoria_blog/08_auditoria_readonly_CAT08_pos_P0.md` removido.

## 5. Arquivos alterados

- `_redirects`
- `blog/public/robots.txt`
- `blog/scripts/validate-content-model.mjs`
- `blog/docs/auditoria_blog/09_sprint_alinhamento_producao_executavel.md`

## 6. Arquivos removidos, se houver

- `blog/docs/auditoria_blog/08_auditoria_readonly_CAT08_pos_P0.md`

Fato verificado: o arquivo removido nao era rastreado por Git no estado inicial.

## 7. Robots/sitemap/canonical/host

Fato verificado:

- `blog/astro.config.mjs` define `site` por `PUBLIC_SITE_ORIGIN` ou fallback `https://blog.pavieadvocacia.com.br`.
- `blog/dist/sitemap-index.xml` aponta para `https://blog.pavieadvocacia.com.br/sitemap-0.xml`.
- `blog/dist/sitemap-0.xml` usa URLs em `https://blog.pavieadvocacia.com.br/...`.
- `blog/src/pages/rss.xml.js` usa `BLOG_SITE_URL`.
- `blog/src/consts.ts` define `SITE_ORIGIN` com fallback `https://blog.pavieadvocacia.com.br`, e `BLOG_SITE_URL` herda `SITE_ORIGIN` se `PUBLIC_BLOG_SITE_URL` nao existir.
- `BaseHead.astro` e `BaseLayout.astro` montam canonical com prop explicita ou `Astro.site`.

Alteracao executada: `blog/public/robots.txt` agora aponta para `https://blog.pavieadvocacia.com.br/sitemap-index.xml`.

Inferencia: para as superficies editoriais do blog, sitemap, RSS e canonical estao coerentes com o subdominio do blog quando o build roda com o fallback atual ou com env equivalente.

Hipotese nao aplicada: separar `PUBLIC_MAIN_SITE_URL` e `PUBLIC_BLOG_SITE_URL` por fallback de codigo poderia melhorar a camada de host institucional, mas isso reabriria arquitetura site/blog e nao foi feito nesta sprint.

Risco documentado: `blog/dist/robots.txt` ainda mostra o valor antigo porque `dist/` e ignorado e build nao foi executado por restricao expressa.

## 8. Redirects

Fato verificado: a regra raiz estava em `_redirects`, nao em `blog/public/_redirects`.

Antes:

```text
/blog          https://blog.pavieadvocacia.com.br/        301
/blog/         https://blog.pavieadvocacia.com.br/        301
/blog/*        https://blog.pavieadvocacia.com.br/:splat  301
```

Depois:

```text
/blog          https://blog.pavieadvocacia.com.br/blog/        301
/blog/         https://blog.pavieadvocacia.com.br/blog/        301
/blog/*        https://blog.pavieadvocacia.com.br/blog/:splat  301
```

Alteracao executada: nao foi criada rota paralela; o redirect passou a reforcar a rota editorial ja existente no executavel Astro.

## 9. CAT-08

Status final: CAT-08 continua categoria canonica equivalente.

Fato verificado:

- `blog/src/data/categories.registry.ts` continua com `CAT-08`.
- `categorySlug` e `areaSlug` da CAT-08 continuam `direito-do-consumidor-responsabilidade-civil`.
- a area CAT-08 continua existente e ativa em `blog/src/content/areas/direito-do-consumidor-responsabilidade-civil.md`.
- os 5 posts CAT-08 nao foram alterados materialmente.
- RSS, sitemap existente e QA continuam reconhecendo os 5 posts publicos CAT-08.

Alteracao nao executada: CAT-08 nao foi rebaixada, removida, transformada em cluster ou retirada do Decap.

## 10. Decap/registry

Fato verificado:

- `blog/public/admin/config.yml` contem CAT-08 nos selects de posts e areas.
- `blog/src/data/categories.registry.ts` contem 8 categorias canonicas.
- `blog/src/content.config.ts` deriva os codigos canonicos do registry.

Alteracao executada: nenhuma alteracao em Decap, registry ou content config.

Inferencia: o nucleo tecnico da CAT-08 permanece aderente ao contexto da PRODUCAO saneada informado no prompt.

## 11. QA/validate

Fato verificado: `validate-content-model.mjs` tinha minimo fixo de 5 artigos publicados para CAT-08.

Alteracao executada: a validacao passou a seguir criterio proporcional documentado em `blog/docs/fase-4-readiness-acervo-blog.md`: categorias com acervo publico precisam ter pelo menos 1 texto-base (`cornerstone` ou `guide`) e 1 complementar (`faq`, `checklist` ou `spoke`).

Validacoes estruturais preservadas:

- 8 categorias canonicas esperadas;
- CAT-08 obrigatoria no registry;
- slug, label e displayTitle da CAT-08;
- area correspondente por categoria;
- Decap com categorias e enums canonicos;
- frontmatter obrigatorio;
- autoria, CTA, related areas, canonicalCategory e duplicidade de slugs.

Inferencia: a validacao ficou menos arbitraria quanto ao numero fixo de posts e mais aderente a prontidao editorial proporcional, sem enfraquecer a integridade estrutural.

## 12. Residuos historicos

Preservados como historico rastreado:

- `blog/relatorios_codex/09_TRAVA_TECNICA_PUBLICACAO_BLOG.md`
- `relatorios_codex/10_ORQUESTRACAO_SITE_BLOG_PATCHES.md`
- `relatorios_codex/10_MATRIZ_ORQUESTRACAO_SITE_BLOG_PATCHES.csv`
- `blog-main-audit/` (264 arquivos rastreados)

Fato verificado: esses residuos contem linguagem antiga de HOLD/cluster, mas foram preservados por serem historicos rastreados e por nao afetarem runtime, QA ou leitura publica atual.

Removido como resíduo nao rastreado e superado:

- `blog/docs/auditoria_blog/08_auditoria_readonly_CAT08_pos_P0.md`

## 13. Comandos executados

Comandos de estado inicial:

```text
git log -1 --oneline
git status -sb
git diff --stat
git diff --cached --stat
git ls-files --others --exclude-standard
```

Comandos de leitura e localizacao:

```text
Get-Content -Raw -LiteralPath 'AGENTS.md'
Get-Content -Raw -LiteralPath 'blog\AGENTS.md'
Get-Content -Raw -LiteralPath 'blog\docs\12.02_Arquitetura_Editorial_do_Blog_Juridico_da_PAVIE_Advocacia.md'
Get-Content -Raw -LiteralPath 'blog\docs\12.06_Governanca_de_Conteudo_Frontmatter_e_Migracao_do_Acervo_da_PAVIE_Advocacia.md'
Get-Content -Raw -LiteralPath 'blog\docs\13.05_Politica_de_Controle_de_Qualidade_Testes_e_Validacao_de_Entregas_da_PAVIE_Advocacia.md'
Get-Content -Raw -LiteralPath 'blog\package.json'
Get-Content -Raw -LiteralPath 'blog\astro.config.mjs'
Get-Content -Raw -LiteralPath 'blog\public\robots.txt'
Get-Content -Raw -LiteralPath 'blog\public\_redirects'
Get-Content -Raw -LiteralPath '_redirects'
Get-Content -Raw -LiteralPath 'blog\src\consts.ts'
Get-Content -Raw -LiteralPath 'blog\src\pages\rss.xml.js'
Get-Content -Raw -LiteralPath 'blog\src\components\BaseHead.astro'
Get-Content -Raw -LiteralPath 'blog\src\layouts\BaseLayout.astro'
Get-Content -Raw -LiteralPath 'blog\src\data\categories.registry.ts'
Get-Content -Raw -LiteralPath 'blog\public\admin\config.yml'
Get-Content -Raw -LiteralPath 'blog\scripts\validate-content-model.mjs'
Get-Content -Raw -LiteralPath 'blog\scripts\qa-blog-publication.mjs'
Get-Content -Raw -LiteralPath 'blog\docs\fase-4-readiness-acervo-blog.md'
Get-Content -Raw -LiteralPath 'blog\relatorios_codex\09_TRAVA_TECNICA_PUBLICACAO_BLOG.md'
Get-Content -Raw -LiteralPath 'relatorios_codex\10_ORQUESTRACAO_SITE_BLOG_PATCHES.md'
```

Comandos de verificacao:

```text
git ls-files ...
git grep ...
git check-ignore -v ...
Select-String ...
Test-Path ...
npm run validate:content
npm run qa:blog
npm run check
git diff --stat
git diff -- ...
git status -sb
git ls-files --others --exclude-standard
```

Comando nao executado:

```text
npm run build
```

Motivo: evitar regravacao de `dist/` sem necessidade expressa.

## 14. Resultado dos comandos

`npm run validate:content`:

```text
[content-model] OK 8 categorias canonicas validadas.
```

`npm run qa:blog`:

```text
[qa-blog] links internos verificados: 26 HTMLs, missing=0
[qa-blog] contagem publica por categoria: CAT-01=0, CAT-02=0, CAT-03=0, CAT-04=0, CAT-05=0, CAT-06=0, CAT-07=0, CAT-08=5
[qa-blog] OK 8 categorias, 5 posts publicos e 26 HTMLs validados.
```

`npm run check`:

```text
[content-model] OK 8 categorias canonicas validadas.
Result (62 files):
- 0 errors
- 0 warnings
- 0 hints
```

`git diff --stat` apos alteracoes antes deste relatorio:

```text
_redirects                              |  8 ++++----
blog/public/robots.txt                  |  2 +-
blog/scripts/validate-content-model.mjs | 25 +++++++++++++++++++++++--
3 files changed, 28 insertions(+), 7 deletions(-)
```

## 15. Riscos residuais

- `dist/` nao foi regenerado. O `blog/dist/robots.txt` local ainda aponta para o sitemap antigo ate novo build controlado.
- `qa:blog` passa, mas ainda nao valida automaticamente consistencia entre `robots.txt`, sitemap gerado e host. A divergencia foi corrigida na fonte e documentada para possivel gate futuro.
- `MAIN_SITE_URL` e `BLOG_SITE_URL` ainda dependem de env/fallbacks existentes. Nao foram alterados para evitar reabrir arquitetura site/blog.
- Residuos historicos rastreados com linguagem HOLD/cluster permanecem no repositorio como historico. Nao afetam runtime, mas podem confundir leitura humana sem este relatorio.
- O wildcard raiz `/blog/*` foi ajustado para preservar `/blog/:splat`; revisar em deploy se houver URLs historicas que tenham sido publicadas diretamente na raiz do subdominio.

## 16. Proximo prompt recomendado

Executar uma verificacao pos-build controlada, autorizando explicitamente `npm run build`, para confirmar que `blog/dist/robots.txt`, `blog/dist/sitemap-index.xml`, `blog/dist/rss.xml`, canonicals e `_redirects` gerados refletem o estado fonte atual, sem alterar CAT-08 nem arquitetura site/blog.

Opcional em prompt separado: adicionar gate ao `qa:blog` para validar consistencia `robots.txt` x sitemap x host depois que a politica de build/deploy estiver estabilizada.

## 17. Recomendacao sobre commit

Recomendacao: revisar diff humano e commitar em um unico commit tecnico pequeno, sem incluir `dist/` e sem misturar alteracao documental de PRODUCAO.

Escopo sugerido do commit:

- `_redirects`
- `blog/public/robots.txt`
- `blog/scripts/validate-content-model.mjs`
- `blog/docs/auditoria_blog/09_sprint_alinhamento_producao_executavel.md`

Nao foi executado `git add`, `git add .`, `git add -A` ou commit.
