# RELATÓRIO — RECONCILIAÇÃO B3 × QA

## 1. Síntese executiva

A reconciliação adotou a **Via A — QA desatualizado**, com ajuste pontual de microcopy e marcação semântica da B3.

O bloqueio estava na leitura anterior do QA de publicação, que tratava a cauda da B3 como algo necessariamente removido e mantinha eventos antigos de B3 como sinais que não poderiam reaparecer. A documentação canônica e a premissa operacional deste BKL-01, porém, preservam artigo-padrão com breadcrumbs, corpo principal, interlinks seletivos, **autor** e **CTA final único e disciplinado**.

Resultado: a B3 voltou a renderizar autor e CTA final controlado, sem cauda comercial, sem evento antigo `editorial_b3_s2_final_cta_click`, sem microcopies legadas bloqueadas e com `npm run qa:blog` aprovado.

## 2. Arquivos auditados

- `src/pages/blog/[slug].astro`: auditado; não alterado. A rota B3 usa `ReadingLayout`.
- `src/layouts/ReadingLayout.astro`: auditado e alterado.
- `src/layouts/PostLayout.astro`: não existe no workspace atual; registrado como lacuna/arquivo não aplicável para esta B3.
- `src/components/blog/ArticleFooterCTA.astro`: auditado e alterado.
- `src/components/blog/AuthorBox.astro`: auditado e alterado.
- `scripts/qa-blog-publication.mjs`: auditado e alterado.
- `src/content/blog/*.md`: auditado quanto a `ctaType`, `ctaTarget`, autor e categorias; não alterado.
- `docs/12.02_Arquitetura_Editorial_do_Blog_Juridico_da_PAVIE_Advocacia.md`: auditado.
- `docs/12.06_Governanca_de_Conteudo_Frontmatter_e_Migracao_do_Acervo_da_PAVIE_Advocacia.md`: auditado.
- `docs/13.05_Politica_de_Controle_de_Qualidade_Testes_e_Validacao_de_Entregas_da_PAVIE_Advocacia.md`: auditado.
- `docs/Matriz_Canonica_Final_de_Superficies_Publi.md`: auditado.
- `docs/release-candidate-blog.md`: auditado como evidência de decisão anterior restritiva.
- `analysis/handoff-final-pavie-2026-04-11.md` e `analysis/rodada-final-conformidade-publica-2026-04-12.md`: auditados como histórico operacional sobre B3.
- `legal-copy/AGENTS.md`: auditado para limites de CTA.

## 3. Regra do QA que bloqueava a B3

A regra exata estava em `scripts/qa-blog-publication.mjs`, principalmente em dois pontos:

- Lista `FORBIDDEN_B3_TAIL_STRINGS`, que reprovava a presença das microcopies antigas:
  - `Transição para o site`
  - `Conheça a área correspondente`
  - `Conteúdo informativo. Cada caso exige análise técnica individual.`
  - `Responsável pelo conteúdo`
  - `Leituras relacionadas da categoria`
- Lista antes chamada `ACCEPTED_DORMANT_B3_EVENTS`, que reprovava qualquer reaparecimento dos eventos:
  - `editorial_b3_s2_final_cta_click`
  - `editorial_b3_related_read_click`

O QA também validava `data-b3-reading-clean="true"` e a ordem da sidebar, mas não possuía critério positivo para aceitar a B3 canônica atual com autor e CTA final disciplinado.

## 4. Evidência documental sobre B3, autor e CTA final

A documentação local aprova a existência de autor e CTA final em B3, desde que a superfície continue editorial:

- `docs/12.02_Arquitetura_Editorial_do_Blog_Juridico_da_PAVIE_Advocacia.md` define que cada post deve ter encaminhamento ético para página de área, leitura correlata ou contato qualificado, e prevê `1 CTA compatível com o estágio do leitor`.
- O mesmo documento inclui, na fase de autoridade e navegação, `bloco de autor`.
- `docs/13.05_Politica_de_Controle_de_Qualidade_Testes_e_Validacao_de_Entregas_da_PAVIE_Advocacia.md` exige `ctaType`, `ctaTarget`, autor definido, correspondência entre post, área e autor, e relacionados funcionais.
- `docs/Matriz_Canonica_Final_de_Superficies_Publi.md` autoriza para blog post a microcopy: `Este conteúdo tem caráter informativo. Para o caso concreto, é preciso avaliar fatos, documentos, contexto e estratégia.`
- `legal-copy/AGENTS.md` permite CTA voltado a análise responsável do caso concreto e organização documental, proibindo urgência artificial, promessa de ganho e pressão comercial.

Há divergência histórica em `docs/release-candidate-blog.md`, que registrou uma B3 “limpa” com remoção dos blocos finais e eventos B3 dormentes. Esse documento foi tratado como histórico de hotfix/fechamento anterior, não como regra superior à premissa atual do BKL-01 nem à documentação canônica mais ampla.

## 5. Decisão adotada: Via A, B ou C

**Via A — QA desatualizado.**

Preservar B3 com autor e CTA final único. Atualizar o QA para aceitar a B3 canônica atual e manter como legados apenas os eventos antigos incompatíveis.

Foi aplicada também uma redução pontual de microcopy, sem transformar a B3 em página comercial:

- `Transição para o site` foi substituído por `Próximo passo`.
- `Conheça a área correspondente` deixou de ser label final obrigatório renderizado na B3; quando vier do modelo de CTA de área, é normalizado em `ReadingLayout` para `Ver área correspondente`.
- A nota ética antiga foi substituída pela fórmula canônica da Matriz.
- `Responsável pelo conteúdo` foi substituído por `Autoria editorial`.

## 6. Alterações realizadas

- `ReadingLayout.astro` voltou a renderizar a cauda editorial da B3 com `AuthorBox` e `ArticleFooterCTA`.
- O CTA final agora prioriza `post.cta?.href`, derivado de `ctaType`/`ctaTarget`, antes de cair em `post.ctaTarget` ou `areaHref`.
- A label final é normalizada quando o modelo antigo de área traz `Conheça a área correspondente`.
- O CTA final só aparece para posts com `publicSurfaceStatus === 'allowed'`.
- `ArticleFooterCTA.astro` passou a expor `data-b3-final-cta="true"` e usar microcopy editorial enxuta.
- `ArticleFooterCTA.astro` passou a marcar `data-link-target` conforme destino real: `area`, `site-contact` ou `site`.
- `AuthorBox.astro` passou a expor `data-b3-author-box="true"` e usar a microcopy `Autoria editorial`.
- `qa-blog-publication.mjs` passou a tratar os eventos B3 antigos como `LEGACY_B3_EVENTS`.
- `qa-blog-publication.mjs` passou a exigir exatamente um CTA final canônico e exatamente um bloco de autor canônico em cada B3 pública.
- O QA continua reprovando as microcopies antigas e continua exigindo que os eventos legados permaneçam sem ponto de disparo.

## 7. Arquivos modificados

- `src/layouts/ReadingLayout.astro`
- `src/components/blog/ArticleFooterCTA.astro`
- `src/components/blog/AuthorBox.astro`
- `scripts/qa-blog-publication.mjs`
- `relatorios_codex/08_RECONCILIACAO_B3_QA.md`

Nenhum artigo, taxonomia, registry, categoria, rota, sitemap, robots, redirect, domínio, commit, push ou deploy foi alterado.

## 8. Validações executadas

- `npm run validate:content`
- `npm run qa:blog`
- `npm run check`
- `npm run build`
- `npm run qa:blog` novamente após o build

## 9. Resultado dos comandos

### `npm run validate:content`

Resultado: **PASSOU**.

Saída relevante:

```text
[content-model] OK 8 categorias canonicas validadas.
```

### `npm run qa:blog`

Resultado: **PASSOU**.

Saída relevante:

```text
[qa-blog] links internos verificados: 26 HTMLs, missing=0
[qa-blog] contagem publica por categoria: CAT-01=0, CAT-02=0, CAT-03=0, CAT-04=0, CAT-05=0, CAT-06=0, CAT-07=0, CAT-08=5
[qa-blog] editorial_b3_s2_final_cta_click=0 (legado, sem ponto de disparo na B3 canonica)
[qa-blog] editorial_b3_related_read_click=0 (legado, sem ponto de disparo na B3 canonica)
[qa-blog] OK 8 categorias, 5 posts publicos e 26 HTMLs validados.
```

### `npm run check`

Resultado: **PASSOU**.

Saída relevante:

```text
Result (62 files):
- 0 errors
- 0 warnings
- 0 hints
```

### `npm run build`

Resultado: **PASSOU**.

Saída relevante:

```text
25 page(s) built
[@astrojs/sitemap] `sitemap-index.xml` created at `dist`
[build] Complete!
```

## 10. Riscos remanescentes

- `docs/release-candidate-blog.md` ainda registra a B3 anterior como “limpa” sem cauda, bloco de autoria ou relacionados no corpo final. Isso pode induzir futuras regressões se não for reconciliado documentalmente.
- `src/lib/posts.ts` ainda contém a label de modelo `Conheça a área correspondente` para CTA de área. O patch permitido não incluía esse arquivo; por isso a normalização foi feita em `ReadingLayout.astro`.
- O QA aponta CAT-01 a CAT-07 com `0` posts públicos e CAT-08 com `5`. Isso não bloqueia o QA atual, mas permanece como risco editorial/operacional para publicação ampla de categorias vazias.
- O arquivo `src/layouts/PostLayout.astro` solicitado para auditoria não existe no workspace atual; a B3 real usa `ReadingLayout`.
- Domínio, redirects, robots e deploy não foram alterados nem revalidados neste BKL-01 por restrição expressa do prompt.

## 11. Próxima ação recomendada

**P0 recomendado:** reconciliar a camada documental de fechamento da B3, especialmente `docs/release-candidate-blog.md`, para registrar expressamente o estado atual aceito: B3 editorial com autor, CTA final único, microcopy canônica e eventos antigos sem ponto de disparo.

Depois disso, a próxima frente operacional segura é tratar as categorias vazias e a camada de publicação/domínio antes de divulgar o blog.
