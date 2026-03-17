# Sprint S1 — Modelo de Conteúdo, Collections e Contrato Editorial

## Objetivo

Estabilizar a camada que governa o conteúdo antes de mexer em layout, navegação pública e migração pesada. O repositório deve sair desta sprint com um contrato editorial executável em Astro/Decap.

---

## Resultado esperado

Ao fim da S1, o projeto deve possuir:

1. collections centrais definidas e validadas;
2. enums controlados para categorias, autor, estágio do leitor, tipo de conteúdo e CTA;
3. frontmatter canônico com chaves mínimas e alto valor;
4. exemplo funcional de `post`, `area` e `author` já compatíveis com o render;
5. mapa de compatibilização entre conteúdo atual e conteúdo futuro.

---

## Escopo obrigatório

### 1. Criar ou refatorar `src/content/config.ts`
Implementar schemas para, no mínimo:

- `posts`
- `areas`
- `authors`

Opcional apenas se agregar valor real nesta fase:
- `settings`
- `taxonomy`

### 2. Definir enums centrais
No mínimo:

- `categoryCode`
- `contentType`
- `readerStage`
- `ctaType`
- `reviewStatus`
- `authorId`

### 3. Normalizar frontmatter de `posts`
Campos mínimos obrigatórios sugeridos:

- `title`
- `seoTitle`
- `description`
- `excerpt`
- `slug`
- `publishDate`
- `authorId`
- `categoryCode`
- `contentType`
- `readerStage`
- `ctaType`
- `ctaTarget`
- `reviewStatus`

Campos opcionais controlados:

- `legacySlug`
- `updatedDate`
- `coverImage`
- `coverAlt`
- `noindex`
- `relatedAreas`
- `relatedPosts`
- `keywords`
- `canonicalUrl`

### 4. Normalizar frontmatter de `areas`
Cada área canônica deve possuir registro próprio com:

- `title`
- `slug`
- `categoryCode`
- `shortDescription`
- `headline`
- `ctaType`
- `ctaTarget`
- `seoTitle`
- `description`
- `order`
- `isActive`

### 5. Normalizar frontmatter de `authors`
Ao menos um autor inicial:

- `id: fabio-pavie`
- `name`
- `slug`
- `shortBio`
- `extendedBio`
- `oab`
- `image`
- `imageAlt`
- `reviewStatus`

Sem inventar qualquer dado biográfico novo.

---

## Adaptação ao repositório real

Considere que o domínio em produção já exibe blog público em `/blog/` e acervo existente. Portanto:

1. não force renomeação prematura de arquivos do legado nesta sprint;
2. crie camada de compatibilização para absorver o legado aos poucos;
3. se hoje já houver conteúdo em formato diferente, introduza adaptadores ou campo `legacySlug` em vez de migração destrutiva imediata.

Se o repositório já usar padrão de slug com data, preserve a capacidade de ler isso.

---

## Entregáveis obrigatórios

1. `src/content/config.ts` funcional;
2. mapas centrais de categoria/label/slug, preferencialmente em `src/data/` ou `src/lib/`;
3. um `author` válido;
4. sete arquivos `areas` válidos;
5. ao menos um `post` de exemplo totalmente compatível com o novo schema;
6. documento curto `CONTENT_MODEL_DECISIONS.md` ou equivalente, explicando decisões.

---

## Restrições

Você **não pode**:

1. criar categoria fora das 7 canônicas;
2. deixar campo livre onde enum resolveria melhor;
3. usar tags soltas como substitutas de categoria;
4. acoplar a renderização a um único formato legado;
5. introduzir chaves “bonitas” sem função real.

---

## Critérios de aceite

- [ ] `astro check` ou validação equivalente sem erro de schema
- [ ] todas as 7 categorias canônicas mapeadas
- [ ] `posts`, `areas` e `authors` renderizáveis pelo novo contrato
- [ ] suporte explícito ao legado via compatibilização documentada
- [ ] nenhuma ampliação indevida do portfólio público

---

## Prompt pronto para Codex

```text
Sprint S1. Leia AGENTS.md raiz, blog/AGENTS.md, legal-copy/AGENTS.md, 12.02, 12.06 e 13.05. Audite o contrato de conteúdo atual do repositório real do blog.pavieadvocacia.com.br e implemente a camada canônica de content collections em Astro. Crie ou refatore `src/content/config.ts`, normalize `posts`, `areas` e `authors`, preserve compatibilidade com slugs legados atuais, introduza enums estáveis para as 7 categorias canônicas da PAVIE e entregue um diff mínimo, validável e documentado. Não mexa ainda em layout amplo, nem reescreva o acervo inteiro.
```
