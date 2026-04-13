---
id: pavie-ssot-implementacao-frontend-site-blog
title: "PAVIE — SSOT de Implementação Front-end Site/Blog"
type: ssot_implementacao_frontend
status: extrato_operacional_consolidado
version: "1.1-cat-08"
date: "2026-04-13"
owner: "Fabio Mathias Pavie"
authority_level: derivado_da_cadeia_canonica_existente
parent_documents:
  - "Registro Mestre de Vigência Documental da PAVIE Advocacia"
  - "PAVIE — Cadeia de Granulação Site/Blog"
  - "12.02 — Arquitetura Editorial do Blog Jurídico da PAVIE Advocacia"
  - "12.06 — Governança de Conteúdo, Frontmatter e Migração do Acervo da PAVIE Advocacia"
applies_to:
  - "Astro"
  - "Decap CMS"
  - "registry canônico"
  - "validação de conteúdo"
  - "S1"
  - "S2"
  - "B1"
  - "B2"
  - "B3"
tags:
  - pavie
  - ssot
  - frontend
  - decap
  - cat-08
  - validacao
---

# PAVIE — SSOT de Implementação Front-end Site/Blog

## 1. Objeto

Este SSOT fixa a correspondência operacional mínima entre taxonomia canônica, conteúdo em collections, Decap CMS, rotas Astro e validações de build.

Ele não cria arquitetura nova. Ele registra como o front-end deve projetar a cadeia vigente: site institucional enquadra e converte; blog jurídico amadurece e devolve.

---

## 2. Tabela Mestra Categoria ↔ Área ↔ Rotas

| Código | Título canônico | Título curto | areaSlug | categorySlug | Rota S2 | Rota B2 |
|---|---|---|---|---|---|---|
| CAT-01 | Sucessões, Inventários e Partilha Patrimonial | Sucessões e Inventários | `sucessoes-inventarios-partilha-patrimonial` | `sucessoes-inventarios-partilha-patrimonial` | `/areas/sucessoes-inventarios-partilha-patrimonial/` | `/blog/categoria/sucessoes-inventarios-partilha-patrimonial/` |
| CAT-02 | Planejamento Patrimonial, Sucessório e Arranjos Preventivos | Planejamento Patrimonial | `planejamento-patrimonial-sucessorio-arranjos-preventivos` | `planejamento-patrimonial-sucessorio-arranjos-preventivos` | `/areas/planejamento-patrimonial-sucessorio-arranjos-preventivos/` | `/blog/categoria/planejamento-patrimonial-sucessorio-arranjos-preventivos/` |
| CAT-03 | Família Patrimonial e Dissoluções | Família Patrimonial | `familia-patrimonial-dissolucoes` | `familia-patrimonial-dissolucoes` | `/areas/familia-patrimonial-dissolucoes/` | `/blog/categoria/familia-patrimonial-dissolucoes/` |
| CAT-04 | Família Binacional, Sucessões Internacionais e Cooperação Documental | Família Binacional | `familia-binacional-sucessoes-internacionais-cooperacao-documental` | `familia-binacional-sucessoes-internacionais-cooperacao-documental` | `/areas/familia-binacional-sucessoes-internacionais-cooperacao-documental/` | `/blog/categoria/familia-binacional-sucessoes-internacionais-cooperacao-documental/` |
| CAT-05 | Imóveis, Registro, Regularizações e Litígios Patrimoniais | Imóveis e Regularizações | `imoveis-registro-regularizacoes-litigios-patrimoniais` | `imoveis-registro-regularizacoes-litigios-patrimoniais` | `/areas/imoveis-registro-regularizacoes-litigios-patrimoniais/` | `/blog/categoria/imoveis-registro-regularizacoes-litigios-patrimoniais/` |
| CAT-06 | Cobrança, Execução, Contratos e Recuperação de Crédito Seletiva | Cobrança e Contratos | `cobranca-execucao-contratos-recuperacao-credito-seletiva` | `cobranca-execucao-contratos-recuperacao-credito-seletiva` | `/areas/cobranca-execucao-contratos-recuperacao-credito-seletiva/` | `/blog/categoria/cobranca-execucao-contratos-recuperacao-credito-seletiva/` |
| CAT-07 | Tributação Patrimonial e Recuperação Tributária Seletiva | Tributação Patrimonial | `tributacao-patrimonial-recuperacao-tributaria-seletiva` | `tributacao-patrimonial-recuperacao-tributaria-seletiva` | `/areas/tributacao-patrimonial-recuperacao-tributaria-seletiva/` | `/blog/categoria/tributacao-patrimonial-recuperacao-tributaria-seletiva/` |
| CAT-08 | Direito do Consumidor e Responsabilidade Civil | Consumidor e Responsabilidade Civil | `direito-do-consumidor-responsabilidade-civil` | `direito-do-consumidor-responsabilidade-civil` | `/areas/direito-do-consumidor-responsabilidade-civil/` | `/blog/categoria/direito-do-consumidor-responsabilidade-civil/` |

---

## 3. Enum Canônico De Categoria No CMS

O CMS deve aceitar apenas:

```yaml
categoryCode:
  - CAT-01
  - CAT-02
  - CAT-03
  - CAT-04
  - CAT-05
  - CAT-06
  - CAT-07
  - CAT-08
```

Não há autorização para `CAT-09`, categoria-mãe temporária, tag substitutiva ou rótulo concorrente.

---

## 4. Campos Estruturais Obrigatórios

### 4.1 Áreas

Cada área institucional deve conter:

- `title`
- `canonicalTitle`
- `displayTitle`
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
- `reviewStatus`

### 4.2 Posts

Cada post editorial deve conter, no mínimo:

- `title`
- `slug`
- `description`
- `pubDate`
- `authorId`
- `categoryCode`
- `contentType`
- `readerStage`
- `ctaType`
- `ctaTarget`
- `reviewStatus`
- `migrationStatus`

---

## 5. Tipos E Estados Controlados

### 5.1 contentType

- `cornerstone`
- `guide`
- `spoke`
- `faq`
- `checklist`
- `case-note`
- `institutional`

### 5.2 readerStage

- `discover`
- `clarify`
- `compare`
- `decide`

### 5.3 ctaType

- `area`
- `contact`
- `article-series`
- `document-review`

Regra de superfície:

- site: `Conhecer área` e `Solicitar análise inicial`;
- blog: `Explorar categoria` como CTA editorial e `Conhecer área` como devolução institucional subordinada.

---

## 6. Pressupostos De Validação Estrutural

O build e a validação de conteúdo devem falhar quando houver:

1. `categoryCode` fora do enum canônico;
2. área ativa sem correspondência no registry canônico;
3. slug de área divergente do registry;
4. `canonicalTitle` divergente do título canônico do registry;
5. `displayTitle` divergente do título curto do registry;
6. rota S2 ou B2 derivada de slug não homologado;
7. post com categoria inexistente;
8. CTA ou tipo de conteúdo fora dos enums controlados.

Estado vazio editorial:

- categorias sem posts podem existir como transição controlada;
- a tela pública deve usar "acervo em preparação" ou equivalente;
- não usar "0 artigos publicados" como framing final.

---

## 7. Projeção Front-end Da CAT-08

### 7.1 Registry

- `categoryCode`: `CAT-08`
- `canonicalTitle`: Direito do Consumidor e Responsabilidade Civil
- `displayTitle`: Consumidor e Responsabilidade Civil
- `areaSlug`: `direito-do-consumidor-responsabilidade-civil`
- `categorySlug`: `direito-do-consumidor-responsabilidade-civil`

### 7.2 S1

O card institucional da home deve apontar para:

- `/areas/direito-do-consumidor-responsabilidade-civil/`
- rótulo de CTA: Conhecer área
- descrição curta: Passagens aéreas, cobranças indevidas e negativação indevida com base em documentos.

### 7.3 S2

A página institucional da área deve preservar:

- breadcrumbs: Início > Áreas > Consumidor e Responsabilidade Civil;
- CTA principal: Solicitar análise inicial;
- CTA secundário/ponte: Explorar categoria;
- leitura útil antes do contato apontando para a B2 correspondente.

### 7.4 B1

A home editorial deve listar a categoria CAT-08 a partir do registry e manter:

- CTA editorial: Explorar categoria;
- CTA subordinado para o site: Conhecer área.

### 7.5 B2

A categoria editorial deve preservar:

- breadcrumbs: Início > Publicações > Categorias > Direito do Consumidor e Responsabilidade Civil;
- introdução curta;
- listagem de artigos quando houver;
- estado vazio controlado quando não houver posts;
- relação explícita com a área correspondente;
- CTA editorial dominante e CTA institucional subordinado.

---

## 8. Checklist Final

- [x] CAT-08 é frente independente.
- [x] CAT-08 tem vínculo 1:1 entre área e categoria.
- [x] Slug institucional e editorial são idênticos.
- [x] CMS aceita `CAT-08`.
- [x] Validação deve confrontar registry, frontmatter e rotas.
- [x] Site não recebe CTA editorial como CTA dominante.
- [x] Blog não recebe captura comercial pesada.
- [x] Não há cadeia paralela, rota paralela ou taxonomia concorrente.
