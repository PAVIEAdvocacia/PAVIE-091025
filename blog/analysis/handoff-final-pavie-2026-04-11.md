# Handoff final — ecossistema PAVIE | Advocacia

## 1. Objeto

Auditoria tecnica e execucao controlada de correcoes no ecossistema Astro/Decap da PAVIE, com foco em arquitetura de superficies, interlinking site/blog, estados editoriais vazios, template B3, SSOT/Decap, LGPD publica, acessibilidade operacional e seguranca de borda compatível com Cloudflare Pages.

## 2. Premissas vinculantes

- S1 e sede institucional: identidade, proposta de valor, areas, metodo, FAQ curta, contato e ponte editorial.
- S2 e pagina individual de area, preservada em `/areas/[slug]`.
- B1 e superficie editorial de descoberta, nao segunda home comercial.
- B2 e categoria editorial vinculada 1:1 a area institucional.
- B3 e artigo informativo com CTA final disciplinado.
- B4 e autoria editorial controlada.
- R1 e apoio de distribuicao/SEO, sem governar a taxonomia.
- O front-end deve renderizar registry/CMS, nao criar taxonomia.
- CAT-08 esta homologada no estado operacional atual como oitava frente canonica.

## 3. Estado atual comprovado

- Build Astro gera S1, 8 rotas S2, B1, indice de categorias, 8 rotas B2, B4, RSS e sitemap.
- Decap lista CAT-01 a CAT-08 e opcoes canonicas de `contentType`, `ctaType`, `readerStage`, `reviewStatus` e `migrationStatus`.
- `src/content/blog` nao contem posts neste momento.
- Politica de privacidade e termos oficiais foram incorporados como PDFs estaticos.
- Header e footer agora separam host institucional e host editorial por variaveis publicas.

## 4. Estado transitorio controlado

- O acervo editorial vazio e permitido como transicao, pois a alimentacao futura via Decap ainda nao ocorreu.
- O fallback de host permanece em `https://blog.pavieadvocacia.com.br`; o estado-alvo exige definir `PUBLIC_MAIN_SITE_URL` e `PUBLIC_BLOG_SITE_URL` no deploy final.
- Documentos historicos em `docs/` e `analysis/` ainda possuem mencoes legadas a 7 categorias; existe adendo documental que reconhece a prevalencia da atualizacao, mas a reconciliacao textual completa permanece pendente.
- A rota `/admin` continua publica como interface Decap; recebeu noindex/no-store/CSP, mas Cloudflare Access ou equivalente depende de configuracao externa ao repo.

## 5. Nao conformidades reais encontradas

- NC-01: links institucionais e editoriais nao distinguiam claramente dominio principal e subdominio em todos os pontos globais.
- NC-02: estados vazios do blog podiam comunicar ausencia como falha editorial em vez de acervo em preparacao.
- NC-03: B3 tinha captura comercial lateral e chamada final duplicada, competindo com a funcao editorial.
- NC-04: build/check nao executavam validacao estrutural entre registry, Decap e frontmatter.
- NC-05: callback OAuth do Decap emitia headers de debug com dados operacionais sensiveis.
- NC-06: politicas legais oficiais nao estavam publicadas como ativos permanentes do rodape.

## 6. Correcoes implementadas

- Lote arquitetura/interlinking: criadas constantes `SITE_ORIGIN`, `MAIN_SITE_URL` e `BLOG_SITE_URL`; `astro.config.mjs` passou a usar `PUBLIC_SITE_ORIGIN`; header/footer usam links absolutos disciplinados para site e blog.
- Lote estados vazios: B1, indice B2, B2 individual e `BlogGrid` passaram a usar copy de acervo em preparacao, sem expor "0 artigos" como experiencia oca.
- Lote B3: removida captura lateral, removida chamada final duplicada, mantidos breadcrumbs, corpo, relacionados, autor, nota etica e CTA final unico.
- Lote SSOT/Decap: criado `scripts/validate-content-model.mjs`; `precheck` e `prebuild` agora executam validacao estrutural.
- Lote LGPD/publico: PDFs oficiais publicados em `public/legal/` e rodape passou a apontar para eles.
- Lote seguranca: criado `public/_headers`; removidos headers de debug do OAuth callback; `/admin`, `/api` e `/legal` receberam regras de noindex/no-store onde cabivel.

## 7. Correcoes pendentes

- Configurar no deploy final: `PUBLIC_SITE_ORIGIN`, `PUBLIC_MAIN_SITE_URL` e `PUBLIC_BLOG_SITE_URL`.
- Avaliar Cloudflare Access, allowlist ou protecao equivalente para `/admin`.
- Reconciliar mencoes historicas a "7 categorias" em documentos legados, sem apagar o historico de migracao.
- Popular `src/content/blog` via Decap conforme plano editorial minimo por categoria.
- Revisar CSP apos qualquer novo script de analytics, consentimento, CMS ou captcha.

## 8. Riscos residuais

- Se as variaveis de host nao forem definidas no ambiente final, links globais podem manter fallback de staging.
- CSP conservadora pode exigir ajuste se Decap, Turnstile ou analytics mudarem de origem.
- O estado vazio do blog esta controlado, mas ainda nao valida massa critica editorial por categoria porque nao ha posts publicados.
- Politicas oficiais foram publicadas como PDFs; qualquer atualizacao juridica exige substituicao controlada dos arquivos.

## 9. Arquivos impactados

- `astro.config.mjs`
- `functions/api/callback.ts`
- `package.json`
- `public/_headers`
- `public/legal/politica-de-privacidade-pavie-advocacia.pdf`
- `public/legal/termos-de-servico-pavie-advocacia.pdf`
- `scripts/validate-content-model.mjs`
- `site/AGENTS.md`
- `src/components/blog/BlogGrid.astro`
- `src/components/blog/ReadingSidebar.astro`
- `src/components/site/Footer.astro`
- `src/components/site/Header.astro`
- `src/consts.ts`
- `src/layouts/ReadingLayout.astro`
- `src/lib/canonical-content.ts`
- `src/pages/blog/categoria/[category].astro`
- `src/pages/blog/categoria/index.astro`
- `src/pages/blog/index.astro`

## 10. Dependencias documentais remanescentes

- Definicao operacional final de host principal e subdominio em ambiente de deploy.
- Politica externa para protecao administrativa do Decap.
- Plano editorial de preenchimento do acervo com massa minima por categoria.
- Reconciliacao fina dos documentos historicos que ainda narram a fase de 7 categorias.

## 11. Checklist final de aderencia ao metodo

- Separacao site/blog preservada: sim.
- CAT-08 mantida como frente homologada: sim.
- S2 e B2 preservadas como superficies distintas: sim.
- Blog sem captura comercial pesada no B3: sim.
- Estados vazios tratados como transicao controlada: sim.
- Validacao estrutural vinculada ao build/check: sim.
- Politica de privacidade e termos publicados no rodape: sim.
- Build e check executados: sim.

## 12. Recomendacao executiva

GO tecnico para o estado atual de staging, com HOLD operacional apenas para deploy final enquanto faltarem variaveis de host, protecao externa de `/admin` e alimentacao editorial inicial.
