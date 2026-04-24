# RELATÓRIO — ORQUESTRAÇÃO SITE/BLOG E PATCHES

## 1. Síntese executiva

Classificação do repositório: **HOLD**.

O repositório `C:\dev\PAVIE-091025` não é um blog isolado puro. Ele contém uma raiz estática/institucional legada, uma aplicação Astro executável em `blog/`, um diretório `site/` e uma cópia histórica em `blog-main-audit/`. A aplicação Astro em `blog/` mistura rotas institucionais e editoriais no mesmo build.

O relatório 09 continua coerente com os arquivos atuais: CAT-08 permanece pública no executável; CAT-01 a CAT-07 seguem sem posts públicos; o sitemap existente em `blog/dist` inclui categorias vazias e CAT-08; o `blog/public/robots.txt` aponta para sitemap no domínio raiz; e a configuração de domínio usa fallback para `blog.pavieadvocacia.com.br` quando variáveis `PUBLIC_*` não existem.

Nenhum patch deve ser aplicado antes da decisão P0 sobre CAT-08 e antes da decisão de arquitetura de host/base path para site e blog.

## 2. Estrutura real do repositório

| Item | Estado |
|---|---|
| Git root | `C:\dev\PAVIE-091025` |
| Branch | `main` |
| Remotes | `origin` e `upstream` apontam para `https://github.com/PAVIEAdvocacia/PAVIE-091025.git` |
| Status inicial | limpo: `git status --short --untracked-files=all` sem saída |
| Diff inicial | limpo: `git diff --name-status` sem saída |
| Aplicação Astro principal | `blog/` |
| Package executável principal | `blog/package.json` |
| Astro config principal | `blog/astro.config.mjs` |
| Pages reais | `blog/src/pages/` |
| Content real | `blog/src/content/` |
| Decap principal | `blog/public/admin/config.yml` |
| Robots do build Astro | `blog/public/robots.txt` |
| Redirects do build Astro | `blog/public/_redirects` |
| Relatório 09 | `blog/relatorios_codex/09_TRAVA_TECNICA_PUBLICACAO_BLOG.md` |

Outros artefatos relevantes no root:

- `index.html`, `robots.txt`, `sitemap.xml`, `_redirects` e `_headers`: raiz estática/institucional legada.
- `src/content/authors/fabio-pavie.md`: conteúdo solto no root, fora do Astro principal.
- `blog-main-audit/blog/`: cópia/auditoria histórica, não tratada como executável principal.
- `site/`: diretório presente, mas a aplicação Astro auditada roda em `blog/`.

## 3. Relação entre site e blog

O estado real é **estrutura híbrida temporária**:

- O root contém arquivos estáticos de site institucional e redirects que enviam `/blog` para `https://blog.pavieadvocacia.com.br/`.
- O diretório `blog/` contém uma aplicação Astro completa que gera tanto superfícies institucionais quanto editoriais.
- Dentro de `blog/src/pages/`, a rota `/` é uma home institucional, `/sobre/` é institucional/autoral, `/areas/[slug]/` é institucional, e `/blog/*` concentra o blog.
- A configuração do Astro usa `https://blog.pavieadvocacia.com.br` como fallback geral de `site`, o que faz o build do blog carregar canonicals institucionais no subdomínio do blog quando não há env explícita.

Classificação estrutural: **site + blog misturados no mesmo Astro, dentro de um repositório híbrido com raiz estática legada**.

## 4. Conferência do relatório 09

| Achado do relatório 09 | Confirmado? | Evidência | Implicação |
|---|---|---|---|
| CAT-08 aparece como obrigatória/publicável | Sim | `blog/src/data/categories.registry.ts`, `blog/src/content/blog/cat08-*.md`, `scripts/validate-content-model.mjs` | Não publicar sem decisão documental |
| PRODUÇÃO trata CAT-08 como HOLD/DEVOLVER | Sim | Relatórios anteriores em `C:\dev\PRODUÇÃO` e síntese do relatório 09 | Divergência de governança permanece |
| CAT-01 a CAT-07 têm 0 posts públicos | Sim | Parse de `blog/src/content/blog/*.md`: só há 5 posts CAT-08 públicos | Categorias vazias não devem indexar |
| Categorias vazias aparecem no sitemap | Sim | `blog/dist/sitemap-0.xml` contém as 8 rotas B2 e 8 rotas S2 | Sitemap precisa filtro por status público |
| `robots.txt` aponta sitemap no domínio raiz | Sim | `blog/public/robots.txt`: `Sitemap: https://pavieadvocacia.com.br/sitemap-index.xml` | Diverge do sitemap Astro em `blog.pavieadvocacia.com.br` |
| Build mistura rotas institucionais e editoriais | Sim | `blog/src/pages/index.astro`, `/areas/[slug]`, `/blog/*` | Depende de decisão de arquitetura |
| QA técnico pode dar falso GO | Sim | QA espera CAT-01 a CAT-08 e valida implementação, não PRODUÇÃO | Precisa trava de governança no QA |

## 5. Rotas institucionais e editoriais

| Rota | Tipo | Arquivo provável | Host esperado | Risco | Decisão necessária |
|---|---|---|---|---|---|
| `/` | Institucional | `blog/src/pages/index.astro` e também root `index.html` | `pavieadvocacia.com.br` se site raiz for sede | Pode sair no subdomínio do blog no build Astro | Definir se root institucional fica fora ou dentro do Astro |
| `/sobre/` | Institucional/autoral | `blog/src/pages/sobre.astro` | Provável domínio institucional ou rota autoral controlada | Pode duplicar B4/autor | Decidir função: site, blog ou noindex |
| `/areas/` | Índice/âncora | `blog/public/_redirects` redireciona para `/#areas` | Domínio institucional | Não há rota Astro `/areas/`; há redirect para âncora | Decidir se haverá índice real de áreas |
| `/areas/[slug]/` | Institucional S2 | `blog/src/pages/areas/[slug].astro` | `pavieadvocacia.com.br` se áreas forem sede institucional | Hoje pode ser canonizado no subdomínio se env faltar | Definir host das áreas |
| `/#contato` | Contato por âncora | `blog/src/pages/index.astro` e `_redirects` | Domínio institucional | Blog vira canal de contato institucional se host errado | Definir rota/âncora oficial |
| `/blog/` | Editorial B1 | `blog/src/pages/blog/index.astro` | `blog.pavieadvocacia.com.br` ou `/blog/` no site, conforme arquitetura | Diverge da matriz que esperava índice direto no subdomínio | Decidir base path do blog |
| `/blog/categoria/[slug]/` | Editorial B2 | `blog/src/pages/blog/categoria/[slug]/[...page].astro` | Blog | Categorias vazias e CAT-08 indexáveis | Trava por postCount/status documental |
| `/blog/[slug]/` | Editorial B3 | `blog/src/pages/blog/[slug].astro` | Blog | Só CAT-08 está público | Decidir CAT-08 antes de divulgar |
| `/blog/autor/fabio-pavie/` | Autoria B4 | `blog/src/pages/blog/autor/[slug].astro` | Blog ou site, conforme autoria | Pode concorrer com `/sobre/` | Harmonizar B4 e `/sobre/` |
| `/admin/` | CMS | `blog/public/admin/index.html` | Blog/admin protegido | Decap pode publicar CAT-08 | Definir bloqueios editoriais |

## 6. Taxonomia e CAT-08

| Item | Estado no executável | Estado documental | Risco | Pode alterar agora? |
|---|---|---|---|---|
| Registry | CAT-08 em `categories.registry.ts` | CAT-08 em HOLD/DEVOLVER | Altíssimo | Não |
| Content config | Enum deriva CAT-08 do registry | Sem aprovação documental | Alto | Não |
| Decap | CAT-08 selecionável em posts e áreas | Bloqueada para uso operacional | Alto | Não |
| Posts | 5 posts CAT-08 públicos, `noindex: false` | Não publicável sem decisão | Altíssimo | Não |
| Área | S2 CAT-08 ativa | Área não aprovada como pública | Altíssimo | Não |
| QA conteúdo | Exige CAT-08 e 5 posts | Contraria HOLD documental | Altíssimo | Não |
| QA publicação | Espera 8 categorias | Contraria matriz CAT-01 a CAT-07 | Alto | Não |
| Sitemap | Inclui CAT-08 | CAT-08 bloqueada | Alto | Não, salvo trava geral após decisão |

## 7. Categorias vazias e sitemap

| Categoria | Posts públicos | Link público | Sitemap | Indexação | Recomendação |
|---|---:|---|---|---|---|
| CAT-01 | 0 | B1 mostra estado “em preparação”; B2 existe | Sim | Indexável no sitemap atual | Noindex e excluir do sitemap até acervo mínimo |
| CAT-02 | 0 | B1 mostra estado “em preparação”; B2 existe | Sim | Indexável no sitemap atual | Noindex e excluir do sitemap até acervo mínimo |
| CAT-03 | 0 | B1 mostra estado “em preparação”; B2 existe | Sim | Indexável no sitemap atual | Noindex e excluir do sitemap até acervo mínimo |
| CAT-04 | 0 | B1 mostra estado “em preparação”; B2 existe | Sim | Indexável no sitemap atual | Noindex e excluir do sitemap até acervo mínimo |
| CAT-05 | 0 | B1 mostra estado “em preparação”; B2 existe | Sim | Indexável no sitemap atual | Noindex e excluir do sitemap até acervo mínimo |
| CAT-06 | 0 | B1 mostra estado “em preparação”; B2 existe | Sim | Indexável no sitemap atual | Noindex e excluir do sitemap até acervo mínimo |
| CAT-07 | 0 | B1 mostra estado “em preparação”; B2 existe | Sim | Indexável no sitemap atual | Noindex e excluir do sitemap até acervo mínimo |
| CAT-08 | 5 | Linkada como categoria com acervo | Sim | Indexável | Bloqueada por decisão documental P0 |

## 8. Domínio, canonical, robots e sitemap

| Item | Estado observado | Estado esperado | Risco | Patch futuro |
|---|---|---|---|---|
| Root estático | `robots.txt`, `sitemap.xml`, `_redirects` no root apontam domínio raiz | Site institucional raiz controlado | Pode coexistir com Astro institucional duplicado | Decidir fonte executável do site |
| `blog/astro.config.mjs` | `site` usa `PUBLIC_SITE_ORIGIN` ou fallback `blog.pavieadvocacia.com.br` | Host do build deve ser explícito | Canonical/sitemap errado por fallback | Exigir env no deploy e QA de host |
| `SITE_ORIGIN` | Fallback para `blog.pavieadvocacia.com.br` | Origem técnica controlada | Fallback vira verdade pública | Remover fallback ambíguo ou travar QA |
| `MAIN_SITE_URL` | Fallback para `SITE_ORIGIN` | `https://pavieadvocacia.com.br` se site separado | Áreas e home podem canonizar no blog | Definir env/fallback institucional |
| `BLOG_SITE_URL` | Fallback para `SITE_ORIGIN` | `https://blog.pavieadvocacia.com.br` | Blog fica correto por acaso | Definir env explicitamente |
| `blog/public/robots.txt` | Sitemap raiz `https://pavieadvocacia.com.br/sitemap-index.xml` | Sitemap do host servindo robots | Robôs recebem mapa errado | Corrigir após decisão de host |
| `blog/dist/sitemap-0.xml` | Inclui 8 áreas, 8 categorias, 5 posts CAT-08 | Só rotas aprovadas/indexáveis | Indexação indevida | Filtro por status/categoria/postCount |
| `blog/public/_redirects` | `/areas` e `/contato` vão para âncoras | Depende de arquitetura | Pode esconder rotas institucionais reais | Revisar após decisão site/blog |

## 9. Classes de intervenção

### Decisão documental

- CAT-08: aprovar, manter experimental/noindex ou remover/rebaixar.
- Definir se consumidor/responsabilidade civil vira categoria pública, área pública, satélite ou repertório.
- Definir se `/sobre/` e B4 coexistem e em qual host.
- Definir se áreas institucionais ficam no domínio raiz ou no build do blog.

### Correção técnica segura

- Criar QA que detecte divergência `robots.txt` × sitemap gerado.
- Criar QA que verifique `PUBLIC_MAIN_SITE_URL` e `PUBLIC_BLOG_SITE_URL` quando em modo publicação.
- Noindex/excluir do sitemap categorias com `postCount === 0`.
- Fazer `qa:blog` relatar explicitamente que é QA técnico, não GO documental.

### Patch reversível

- Adicionar modo `PUBLICATION_LOCK=true` ou equivalente para impedir sitemap/indexação de superfícies em HOLD.
- Criar whitelist/manifest de rotas indexáveis para build de pré-publicação.
- Aplicar `noIndex` temporário a B2 vazias.
- Adicionar filtro de sitemap por categoria e postCount.

### Bloqueado

- Remover ou promover CAT-08.
- Alterar registry e Decap para decidir CAT-08 por código.
- Reclassificar os cinco posts CAT-08.
- Alterar área CAT-08.
- Redefinir base path do blog sem decisão de host.
- Publicar deploy ou sitemap público.

## 10. Patch futuro recomendado

| Patch | Arquivos prováveis | Objetivo | Risco | Depende de CAT-08? | Ordem |
|---|---|---|---|---|---:|
| Decisão documental CAT-08 | PRODUÇÃO, sem executável | Resolver P0 de governança | Alto se ignorada | Sim | 1 |
| Trava de QA contra falso GO | `blog/scripts/qa-blog-publication.mjs`, possível manifesto de governança | Impedir aprovação técnica contra documentação | Médio | Sim | 2 |
| Política de categorias vazias | `blog/src/pages/blog/categoria/[slug]/[...page].astro`, `blog/astro.config.mjs`, QA | Noindex/excluir B2 vazias | Baixo/médio | Não | 3 |
| Separação de hosts | `blog/src/consts.ts`, `blog/astro.config.mjs`, env de deploy | Corrigir canonical/site/blog | Médio | Não | 4 |
| Robots/sitemap coerentes | `blog/public/robots.txt`, `blog/astro.config.mjs`, QA | Alinhar robots ao sitemap gerado | Médio | Não, mas depende de host | 5 |
| Rotas institucionais | root estático, `blog/src/pages/index.astro`, `blog/src/pages/areas/[slug].astro` | Definir se site vive no root ou no Astro | Alto | Não | 6 |
| Decap seguro | `blog/public/admin/config.yml` | Evitar publicação acidental de categoria em HOLD | Médio | Sim | 7 |
| QA visual/publicação final | scripts de QA + browser depois | Validar HTML, sitemap, noindex e links | Médio | Sim | 8 |

## 11. Orquestração de execução

Ordem recomendada dos próximos prompts:

1. **Prompt P0 documental CAT-08 em PRODUÇÃO**: escolher Hipótese A, B ou C sem alterar executável.
2. **Prompt de trava QA governança**: implementar falha técnica quando o executável contrariar status documental escolhido.
3. **Prompt de categorias vazias**: noindex/excluir do sitemap CAT-01 a CAT-07 enquanto `postCount === 0`.
4. **Prompt de domínio/host**: definir `PUBLIC_MAIN_SITE_URL`, `PUBLIC_BLOG_SITE_URL`, `PUBLIC_SITE_ORIGIN` e política de canonical.
5. **Prompt robots/sitemap**: alinhar `robots.txt`, sitemap e filtros.
6. **Prompt arquitetura site/blog**: decidir se o Astro em `blog/` hospeda também `/`, `/sobre/` e `/areas/[slug]/` ou se o root estático/site separado governa o domínio principal.
7. **Prompt Decap seguro**: ajustar CMS conforme decisão CAT-08 e status de publicação.
8. **Prompt QA final de publicação**: rodar build, check, qa, inspeção de sitemap/robots/canonical e validação visual.

## 12. Recomendação de commit

Os relatórios podem ser commitados separadamente como documentação, desde que nenhum código seja incluído no mesmo commit.

Recomendação:

- Commit 1: `blog/relatorios_codex/09_TRAVA_TECNICA_PUBLICACAO_BLOG.md`, se ainda não estiver versionado.
- Commit 2: `relatorios_codex/10_ORQUESTRACAO_SITE_BLOG_PATCHES.md` e `relatorios_codex/10_MATRIZ_ORQUESTRACAO_SITE_BLOG_PATCHES.csv`.

Não commitar patches técnicos junto com estes relatórios. Não commitar alterações em `dist`, registry, conteúdo, Decap, scripts, robots ou domínio antes da decisão P0 sobre CAT-08.
