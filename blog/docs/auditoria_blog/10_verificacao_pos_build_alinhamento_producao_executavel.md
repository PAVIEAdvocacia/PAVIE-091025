# 10 - Verificacao pos-build do alinhamento PRODUCAO x executavel

Data: 2026-04-26  
Workspace: `C:\dev\PAVIE-091025`  
Escopo executavel: `blog/`

## 1. Sintese executiva

Status: verificacao pos-build concluida com sucesso.

Fato verificado: `npm run validate:content`, `npm run qa:blog`, `npm run check`, `npm run build` e novo `npm run qa:blog` pos-build passaram sem erro.

Fato verificado: o build regenerou `blog/dist/` e o `blog/dist/robots.txt` passou a refletir a fonte corrigida, apontando para `https://blog.pavieadvocacia.com.br/sitemap-index.xml`.

Fato verificado: sitemap, RSS e canonicals gerados usam `https://blog.pavieadvocacia.com.br` como host tecnico. O runtime gerado nao trouxe a premissa antiga de CAT-08 como cluster/HOLD.

Fato verificado: nenhum `git add`, nenhum commit, nenhum `git clean`, nenhuma remocao de `dist/` e nenhuma alteracao em `C:\dev\PRODUCAO` foi executada.

Inferencia: a divergencia residual do `dist/robots.txt` foi sanada pelo build controlado. A camada gerada esta aderente ao host tecnico atual do blog.

## 2. Estado Git inicial

Comandos executados em `C:\dev\PAVIE-091025`:

```text
git log -1 --oneline
f5738c5 Update blog governance instructions
```

```text
git status -sb
## main...origin/main
 M _redirects
 M blog/public/robots.txt
 M blog/scripts/validate-content-model.mjs
?? blog/docs/auditoria_blog/
```

```text
git diff --stat
 _redirects                              |  8 ++++----
 blog/public/robots.txt                  |  2 +-
 blog/scripts/validate-content-model.mjs | 25 +++++++++++++++++++++++--
 3 files changed, 28 insertions(+), 7 deletions(-)
```

```text
git diff --cached --stat
sem saida
```

```text
git ls-files --others --exclude-standard
blog/docs/auditoria_blog/09_sprint_alinhamento_producao_executavel.md
```

Fato verificado: no inicio desta verificacao, nao havia arquivo staged. O relatorio `09` era o unico arquivo nao rastreado.

## 3. Comandos executados

Leitura e mapeamento:

```text
Get-Content -Raw AGENTS.md
Get-Content -Raw blog\AGENTS.md
Get-Content -Raw blog\docs\12.02_Arquitetura_Editorial_do_Blog_Juridico_da_PAVIE_Advocacia.md
Get-Content -Raw blog\docs\12.06_Governanca_de_Conteudo_Frontmatter_e_Migracao_do_Acervo_da_PAVIE_Advocacia.md
Get-Content -Raw blog\docs\13.05_Politica_de_Controle_de_Qualidade_Testes_e_Validacao_de_Entregas_da_PAVIE_Advocacia.md
Get-Content -Raw blog\package.json
Get-Content -Raw blog\astro.config.mjs
Get-Content -Raw blog\src\consts.ts
Get-Content -Raw blog\public\robots.txt
Get-Content -Raw blog\src\pages\rss.xml.js
Get-Content -Raw blog\src\components\BaseHead.astro
Get-Content -Raw _redirects
Get-Content -Raw blog\public\_redirects
```

Gates e build:

```text
npm run validate:content
npm run qa:blog
npm run check
npm run build
npm run qa:blog
```

Verificacoes pos-build:

```text
Get-Content -Raw blog\dist\robots.txt
Get-Content -Raw blog\dist\sitemap-index.xml
Get-Content -Raw blog\dist\sitemap-0.xml
Get-Content -Raw blog\dist\rss.xml
Get-Content -Raw blog\dist\_redirects
Select-String / regex checks em blog\dist para host, canonical, RSS, sitemap, CAT-08 e sinais de HOLD/cluster.
git check-ignore -v blog/dist/... blog/.astro/...
git status -sb
git diff --stat
git diff --cached --stat
git ls-files --others --exclude-standard
```

Comandos proibidos nao executados:

```text
git add
git add .
git add -A
git commit
git clean
```

## 4. Resultado do build

Fato verificado: `npm run build` passou.

Trechos relevantes:

```text
[content-model] OK 8 categorias canonicas validadas.
[build] output: "static"
[build] directory: C:\dev\PAVIE-091025\blog\dist\
[@astrojs/sitemap] `sitemap-index.xml` created at `dist`
[build] 25 page(s) built in 2.04s
[build] Complete!
```

Fato verificado: o build gerou rotas para:

- 8 paginas de area;
- 8 paginas de categoria;
- 5 posts CAT-08;
- `/blog/`;
- `/blog/autor/fabio-pavie/`;
- `/rss.xml`;
- `/sobre/`;
- `/`.

Fato verificado: o `qa:blog` pos-build tambem passou:

```text
[qa-blog] links internos verificados: 26 HTMLs, missing=0
[qa-blog] contagem publica por categoria: CAT-01=0, CAT-02=0, CAT-03=0, CAT-04=0, CAT-05=0, CAT-06=0, CAT-07=0, CAT-08=5
[qa-blog] OK 8 categorias, 5 posts publicos e 26 HTMLs validados.
```

## 5. Robots

Fonte: `blog/public/robots.txt`.

Artefato gerado: `blog/dist/robots.txt`.

Fato verificado no artefato:

```text
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://blog.pavieadvocacia.com.br/sitemap-index.xml
```

Fato verificado: nao ha mais referencia a `https://pavieadvocacia.com.br/sitemap-index.xml` nos arquivos textuais verificados do `blog/dist`.

Inferencia: a divergencia pos-sprint do robots foi resolvida pelo build controlado.

## 6. Sitemap

Fonte tecnica: `@astrojs/sitemap` configurado em `blog/astro.config.mjs`.

Fato verificado: `blog/astro.config.mjs` define:

```text
PUBLIC_SITE_ORIGIN ou fallback https://blog.pavieadvocacia.com.br
```

Artefatos gerados:

```text
blog/dist/sitemap-index.xml
blog/dist/sitemap-0.xml
```

Fato verificado em `sitemap-index.xml`:

```text
https://blog.pavieadvocacia.com.br/sitemap-0.xml
```

Fato verificado em `sitemap-0.xml`: todas as URLs usam `https://blog.pavieadvocacia.com.br`.

Fato verificado: CAT-08 aparece no sitemap como area e categoria:

```text
https://blog.pavieadvocacia.com.br/areas/direito-do-consumidor-responsabilidade-civil/
https://blog.pavieadvocacia.com.br/blog/categoria/direito-do-consumidor-responsabilidade-civil/
```

Fato verificado: os 5 posts publicos CAT-08 aparecem no sitemap.

## 7. RSS

Fonte tecnica: `blog/src/pages/rss.xml.js`, usando `BLOG_SITE_URL`.

Fato verificado: `blog/dist/rss.xml` usa:

```text
<link>https://blog.pavieadvocacia.com.br/</link>
```

Fato verificado: os links e GUIDs dos 5 itens do RSS usam `https://blog.pavieadvocacia.com.br/blog/...`.

Fato verificado: a contagem regex de links de item em host do blog no RSS retornou 10 ocorrencias, correspondendo a `link` e `guid` dos 5 posts.

Inferencia: RSS esta coerente com o host tecnico atual do blog.

## 8. Canonicals

Fonte tecnica: `BaseHead.astro` e `BaseLayout.astro`, com canonical explicito por pagina ou `Astro.site`.

Fato verificado: foram encontrados 25 canonicals nos HTMLs gerados e nenhum canonical fora de `https://blog.pavieadvocacia.com.br/...`.

```text
canonical_total=25
canonical_non_blog=0
```

Exemplos verificados:

```text
CAT-08 categoria:
https://blog.pavieadvocacia.com.br/blog/categoria/direito-do-consumidor-responsabilidade-civil/

CAT-08 area:
https://blog.pavieadvocacia.com.br/areas/direito-do-consumidor-responsabilidade-civil/

CAT-08 post:
https://blog.pavieadvocacia.com.br/blog/direito-consumidor-situacoes-documentaveis-organizar-problema-analise-juridica/
```

Fato verificado: a categoria CAT-08 e o post CAT-08 testado possuem `index,follow` e nao possuem `noindex`.

Hipotese nao aplicada: caso a arquitetura futura separe canonicals institucionais no dominio raiz, `MAIN_SITE_URL` e `BLOG_SITE_URL` podem precisar de env explicita. Esta verificacao nao alterou arquitetura site/blog.

## 9. Redirects

Fato verificado: redirects raiz em `_redirects` estao coerentes com a decisao da sprint:

```text
/blog          https://blog.pavieadvocacia.com.br/blog/        301
/blog/         https://blog.pavieadvocacia.com.br/blog/        301
/blog/*        https://blog.pavieadvocacia.com.br/blog/:splat  301
```

Fato verificado: `blog/dist/_redirects` e derivado de `blog/public/_redirects` e contem apenas:

```text
/about /sobre/ 301
/about/ /sobre/ 301
/areas /#areas 301
/areas/ /#areas 301
/contato /#contato 301
/contato/ /#contato 301
```

Inferencia: a regra de `/blog` pertence ao deploy da raiz `pavieadvocacia.com.br`, nao ao build do subdominio do blog. A fonte raiz esta ajustada, mas o artefato `blog/dist/_redirects` nao deveria conter essa regra no desenho atual.

## 10. CAT-08

Status final: CAT-08 continua categoria canonica equivalente.

Fato verificado:

- CAT-08 permanece no Decap gerado em `blog/dist/admin/config.yml`.
- CAT-08 aparece na area publica correspondente.
- CAT-08 aparece na categoria publica correspondente.
- CAT-08 aparece nos posts publicos e nos atributos de analytics.
- CAT-08 aparece no sitemap e seus 5 posts aparecem no RSS.
- `qa:blog` pos-build contou `CAT-08=5`.

Fato verificado: nao foi encontrada expressao runtime de CAT-08 como cluster/HOLD.

Checagens textuais:

```text
hold_word_count=0
cluster_hold_count=0
cat08_hold_count=0
cat08_como_cluster_count=0
```

Observacao: a busca bruta por `hold` sem fronteira de palavra encontrava ocorrencias dentro de `threshold`; por isso a verificacao relevante foi feita com `\bHOLD\b` e padroes especificos de CAT-08/HOLD.

## 11. Dist e arquivos gerados

Fato verificado:

```text
html_count=26
dist_file_count=54
```

Artefatos principais:

```text
blog/dist/robots.txt           104 bytes
blog/dist/rss.xml             3379 bytes
blog/dist/sitemap-0.xml       3137 bytes
blog/dist/sitemap-index.xml    197 bytes
blog/dist/_redirects           125 bytes
```

Fato verificado: `blog/dist/` e `blog/.astro/` seguem ignorados por `blog/.gitignore`.

```text
blog/.gitignore:2:dist/  blog/dist/robots.txt
blog/.gitignore:2:dist/  blog/dist/sitemap-index.xml
blog/.gitignore:2:dist/  blog/dist/rss.xml
blog/.gitignore:4:.astro/ blog/.astro/types.d.ts
```

Fato verificado: `git status --short --ignored=matching blog/dist blog/.astro` mostrou apenas:

```text
!! blog/.astro/
!! blog/dist/
```

## 12. Arquivos alterados ou gerados

Arquivos tracked ja alterados antes desta verificacao e mantidos:

- `_redirects`
- `blog/public/robots.txt`
- `blog/scripts/validate-content-model.mjs`

Arquivos nao rastreados ja existentes antes desta verificacao:

- `blog/docs/auditoria_blog/09_sprint_alinhamento_producao_executavel.md`

Arquivo criado nesta verificacao:

- `blog/docs/auditoria_blog/10_verificacao_pos_build_alinhamento_producao_executavel.md`

Arquivos gerados/atualizados pelo build, ignorados por Git:

- `blog/dist/`
- `blog/.astro/`

Fato verificado: nada foi staged.

## 13. Riscos residuais

- O build atual usa fallback `https://blog.pavieadvocacia.com.br` quando `PUBLIC_SITE_ORIGIN` nao existe. Isso esta coerente com a verificacao do blog, mas a separacao fina entre dominio institucional e subdominio editorial ainda depende de variaveis de ambiente e decisao de deploy.
- `blog/dist/_redirects` nao inclui a regra raiz `/blog -> https://blog.pavieadvocacia.com.br/blog/` porque essa regra pertence ao `_redirects` da raiz do repositorio, nao ao build do subdominio.
- PDFs legais dentro de `blog/dist/legal/` ainda podem conter links historicos para `https://pavieadvocacia.com.br/blog/`. Eles nao foram tratados nesta sprint porque sao arquivos binarios, juridicamente sensiveis e fora do escopo de runtime/canonical/sitemap/RSS.
- O QA ainda nao possui gate automatico especifico para comparar robots/sitemap/RSS/canonical/host; a verificacao foi manual e documentada.

## 14. Recomendacao sobre commit

Recomendacao: commitar apenas os arquivos fonte e relatorios de auditoria, sem `dist/` e sem `.astro/`.

Escopo sugerido:

- `_redirects`
- `blog/public/robots.txt`
- `blog/scripts/validate-content-model.mjs`
- `blog/docs/auditoria_blog/09_sprint_alinhamento_producao_executavel.md`
- `blog/docs/auditoria_blog/10_verificacao_pos_build_alinhamento_producao_executavel.md`

Nao executar `git add .` nem `git add -A`; se for stagear futuramente, usar paths explicitos.

## 15. Proximo prompt recomendado

Adicionar gate tecnico ao `npm run qa:blog` para validar automaticamente:

- `blog/dist/robots.txt` aponta para o sitemap do host correto;
- `sitemap-index.xml`, `sitemap-0.xml`, RSS e canonicals usam host coerente;
- `/blog`, `/blog/` e `/blog/*` estao coerentes no `_redirects` raiz;
- nao ha retorno de premissas CAT-08/HOLD em HTML, RSS, sitemap ou Decap gerado.

Esse proximo prompt deve continuar sem alterar CAT-08, registry, Decap ou posts juridicos.
