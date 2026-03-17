# Sprint S5 — Migração do Acervo e Saneamento das Superfícies Públicas

## Objetivo

Executar a parte mais sensível da transição: compatibilizar o que já está publicado com a nova governança da PAVIE, preservando valor editorial e SEO sem perpetuar copy ou arquitetura inadequadas.

---

## Resultado esperado

Ao fim da S5, o domínio deve estar com:

1. superfícies públicas principais saneadas;
2. acervo legado classificado e tratado;
3. roteamento/redirects preparados para o que mudou;
4. copy pública reconciliada com a matriz canônica.

---

## Escopo obrigatório

### 1. Classificar cada ativo legado relevante
Para cada página/post relevante, decidir e registrar:

- `manter`
- `migrar`
- `reescrever`
- `fundir`
- `arquivar`
- `redirecionar`

### 2. Saneamento das superfícies públicas centrais
Revisar, à luz da matriz canônica:

- home
- `/sobre/`
- `/areas/`
- páginas de área
- assinatura de autor
- página do autor
- blocos de CTA institucionais

### 3. Saneamento do acervo do blog
Para cada post legado:

- adequar frontmatter;
- ajustar categoria;
- revisar CTA;
- revisar metadata;
- preservar ou mapear slug;
- indicar se necessita reescrita integral ou apenas normalização.

### 4. Estratégia de redirects
Gerar mapa claro para:

- URLs alteradas;
- slugs antigos preservados por redirect;
- páginas fundidas;
- páginas arquivadas que ainda merecem resposta 301.

### 5. Estratégia de canonical
Se coexistirem versões antigas e novas, definir canonical correta e evitar competição interna.

---

## Adaptação ao repositório real

O site/blog hoje publicado já exibe mensagens e rótulos de uma fase intermediária. A própria home e o blog home sinalizam um estado funcional, porém ainda não totalmente alinhado à nova matriz. Portanto:

1. trate o conteúdo atual como **legado útil, não lixo**;
2. trate a matriz canônica como **destino normativo**;
3. faça a travessia com cuidado especial nas superfícies mais visíveis;
4. evite reescrever tudo se a estrutura atual puder ser saneada com menos risco.

---

## Entregáveis obrigatórios

1. `MIGRATION_MAP.md` com decisão item a item;
2. superfícies institucionais principais já saneadas no código;
3. frontmatter do acervo principal normalizado;
4. redirects definidos;
5. nota curta dos ativos que ainda exigem revisão humana de texto.

---

## Restrições

Você **não pode**:

1. apagar acervo sem classificar;
2. manter copy incompatível com a matriz canônica por comodidade;
3. usar o repertório biográfico amplo como copy final de home e assinatura;
4. alterar slug público sem indicar redirect e impacto;
5. transformar a migração em mass rewrite descontrolado.

---

## Critérios de aceite

- [ ] home, `/sobre/`, `/areas/` e autor compatibilizados
- [ ] posts principais classificados e normalizados
- [ ] redirects mapeados
- [ ] canonicals coerentes com a nova estrutura
- [ ] legado tratado com critério, sem destruição cega

---

## Prompt pronto para Codex

```text
Sprint S5. Leia AGENTS.md raiz, site/AGENTS.md, blog/AGENTS.md, legal-copy/AGENTS.md, a matriz canônica de superfícies e 12.06/13.05. Execute a migração controlada do acervo e o saneamento das superfícies públicas do repositório real do blog.pavieadvocacia.com.br. Classifique cada ativo relevante como manter, migrar, reescrever, fundir, arquivar ou redirecionar. Reconcile a home, `/sobre/`, `/areas/`, autor e posts com a taxonomia canônica da PAVIE, preserve o valor SEO quando houver, e documente redirects, canonicals e pendências de revisão humana.
```
