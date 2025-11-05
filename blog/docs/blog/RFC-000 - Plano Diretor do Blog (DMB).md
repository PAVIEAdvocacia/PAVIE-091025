# RFC-000 — Plano Diretor do Blog (DMB)

> Organização: **{{ORG:=PAVIE | Advocacia}}**  
> Domínio: **{{DOMAIN:=https://pavieadvocacia.com.br}}**  
> Escopo: **Brasil e Internacional (PT/EN/DE)**  
> Versão: **1.1**  
> Data: **2025-11-03**  
> Status: **Aprovado para Implementação**

---

## Pré-âmbulo (Conformidade RFC 2119)
As palavras **MUST**, **SHOULD**, **MAY**, **MUST NOT** e **SHOULD NOT** neste documento devem ser interpretadas conforme a [RFC 2119]. Este DMB é **normativo**; exceções exigem ADR específica aprovada.

---

## Sumário
1. [Propósito & Objetivos](#1-propósito--objetivos)  
2. [Requisitos & Restrições](#2-requisitos--restrições)  
3. [Arquitetura & Stack](#3-arquitetura--stack)  
4. [Estrutura de Pastas & Convenções](#4-estrutura-de-pastas--convenções)  
5. [Padrões de Conteúdo](#5-padrões-de-conteúdo)  
6. [SEO & Dados Estruturados](#6-seo--dados-estruturados)  
7. [Acessibilidade & UX](#7-acessibilidade--ux)  
8. [Segurança & Compliance](#8-segurança--compliance)  
9. [Operação Editorial (E2E)](#9-operação-editorial-e2e)  
10. [Medição & Observabilidade](#10-medição--observabilidade)  
11. [Critérios de Aceite](#11-critérios-de-aceite)  
12. [RACI por Fase](#12-raci-por-fase)  
13. [Governança de Mudanças](#13-governança-de-mudanças)  
14. [Riscos & Mitigações](#14-riscos--mitigações)  
15. [Roadmap](#15-roadmap)  
16. [Artefatos de Referência](#16-artefatos-de-referência)

---

### RACI — Papéis Globais
- **PM/Owner do Blog** (Produto/Planejamento)
- **Editor-Chefe** (Governança editorial)
- **UX-Writer** (Arquitetura de informação)
- **SEO Lead** (Crescimento orgânico)
- **IX-UI Designer** (Layout/IA/WCAG)
- **Visual Law** (Suportes visuais)
- **SLD-<Eixo>** (Especialista jurídico)
- **LAW-CIV/INT** (Juridicidade transversal)
- **Compliance/OAB+LGPD** (Ética & privacidade)
- **A11Y** (Acessibilidade)
- **QA-CONT** (Factual/linguagem)
- **FE-Astro** (Frontend/Content Collections)
- **CMS-Admin** (Decap CMS)
- **DevOps/Cloudflare** (Pages/Functions/Access)
- **Security** (CSP/OAuth/segredos)
- **Data/Analytics** (GA4/Consent)
- **CRO** (Conversão/tests)
- **Distribution/PR** (Distribuição)
- **KM/DocOps** (Versionamento/ADRs)

> **RACI consolidado por fase** encontra-se no capítulo 12.

---

## 1) Propósito & Objetivos
**Propósito.** Operar um **/blog** jurídico em **Astro** integrado ao site institucional, com governança normativa, SEO, A11Y e ética OAB/LGPD, para **atrair tráfego qualificado**, **gerar leads** e **consolidar autoridade** em Direito nacional e internacional.

**KPIs (12 meses).**
- **Tráfego orgânico**: +150% (*baseline: GSC*).  
- **CTR hero**: ≥ **2,5%** (home/blog).  
- **CVR total** (leads): **2–5%**.  
- **Leads qualificados**: ≥ **60%**.  
- **Core Web Vitals**: LCP ≤ **2,5s**, CLS ≤ **0,1** (mobile/desktop).  
- **TMA resposta** a contatos: ≤ **2h úteis**.  

**Personas (macro).** Empresas e pessoas físicas com casos de **Sucessões & Inventário**, **Família & Patrimônio**, **Imobiliário & Urbanístico**, **Contratos & Obrigações**, **Consumidor & Danos**, **Compliance & Governança (Lei 14.133/LGPD/LAI/OSC)**, **Tributário & Previdenciário**, **Internacional (Brasil–UE/Alemanha/Portugal)**.

**Escopo.** Conteúdo 100% estático, multilíngue progressivo (PT inicial; EN/DE **MAY**), cobertura BR/INT.

**RACI (Seção 1).** R: PM/Owner. A: Editor‑Chefe. C: SEO Lead, LAW‑CIV/INT. I: Todos.

**Decisões‑chave.** (i) Foco em temas com intenção transacional e informacional; (ii) funil TOFU/MOFU/BOFU; (iii) compliance OAB/LGPD **MUST**.

**Critérios de aceite.** KPIs definidos; personas e escopo documentados; metas CWV definidas.

---

## 2) Requisitos & Restrições
**Requisitos.**
- Ética OAB (Prov. 205/2021) **MUST**; LGPD **MUST**.  
- Manutenção **solo** (git‑based) **MUST**.  
- Baixo custo e pouca dependência de terceiros **SHOULD**.  
- Observabilidade GA4/Consent Mode v2 **MUST**.  

**Restrições.**
- Sem servidor dedicado; sem banco de dados; **Decap CMS** como admin git.  
- Autenticação via **GitHub OAuth** em **Cloudflare Pages Functions**.  

**RACI (Seção 2).** R: Compliance/OAB+LGPD. A: LAW‑CIV/INT. C: PM, Security. I: Todos.  
**Decisões‑chave.** Ética & privacidade por padrão; coleta mínima; logs essenciais apenas.  
**Critérios de aceite.** Políticas publicadas; consentimentos funcionais; revisão legal concluída.

---

## 3) Arquitetura & Stack
**Stack** (detalhada nas ADR‑001..004):
- **Astro** + **Content Collections (Zod)** para tipagem e build estático.  
- **Decap CMS** (git‑based) com **GitHub OAuth** via **Pages Functions** (rota `/api/auth` e `/api/callback`).  
- **Cloudflare Pages** (deploy) + **Access** para proteger `/blog/admin`.  
- **Pagefind** para busca estática unificada (site + blog).  

**RACI (Seção 3).** R: FE‑Astro. A: DevOps/Cloudflare. C: Security, CMS‑Admin. I: Todos.  
**Decisões‑chave.** Build estático; OAuth próprio; Access como segunda camada; Pagefind pós‑build.  
**Critérios de aceite.** Build sem erros; admin acessível e autenticado; busca indexando e retornando resultados.

---

## 4) Estrutura de Pastas & Convenções
```
/blog/
  admin/                 # Decap CMS (config.yml, index.html)
  public/                # estáticos (imagens/pdf, _headers)
  src/
    content/
      posts/             # .md ou .mdx
      pages/
      tags/
      schemas/           # Zod schemas (post.ts)
    components/
    layouts/
  functions/             # Cloudflare Pages Functions (OAuth: api/auth & api/callback)
  docs/
    blog/
      RFC-000 - Plano Diretor do Blog (DMB).md
      adrs/
        ADR-001.md .. ADR-012.md
```
**Convenções.**
- Nome de arquivo: `YYYY-MM-DD-slug.md`.  
- Slug URL: kebab‑case (sem acento).  
- Imagens por post em `/blog/public/uploads/<slug>/`.  

**RACI (Seção 4).** R: KM/DocOps. A: PM. C: FE‑Astro, CMS‑Admin. I: Todos.  
**Decisões‑chave.** Estrutura isolada em `/blog`; Functions no mesmo projeto.  
**Critérios de aceite.** Árvore criada; lints de nomes; schema Zod validando 3 posts exemplo.

---

## 5) Padrões de Conteúdo
**Tipos de post (5):** `autoridade`, `guia`, `jurisprudencia`, `noticia`, `opiniao`.

**Front‑matter MÍNIMO (MUST):**
```
---
title: "..."
description: "..." # ≤ 155 chars
pubDate: "2025-10-31"
author: "{{ORG}}"
tags: ["Sucessões & Inventário", "Internacional"]
cover:
  src: "/blog/uploads/<slug>/cover.jpg"
  alt: "Descrição acessível da imagem"
canonical: "https://pavieadvocacia.com.br/blog/<slug>/" # opcional
noindex: false # opcional
type: autoridade|guia|jurisprudencia|noticia|opiniao
---
```
**Taxonomia base (tags/categorias) alinhada ao site:**
- **Sucessões & Inventário**; **Família & Patrimônio**; **Imobiliário & Urbanístico**; **Contratos & Obrigações**; **Consumidor & Danos**; **Compliance & Governança** (Lei 14.133/LGPD/LAI/OSC); **Tributário & Previdenciário**; **Internacional (Brasil–UE/Alemanha/Portugal)**.

**RACI (Seção 5).** R: Editor‑Chefe. A: PM. C: SLD‑<Eixo>, UX‑Writer, SEO Lead. I: QA‑CONT.  
**Decisões‑chave.** Tipos fixos; front‑matter padronizado; taxonomia controlada.  
**Critérios de aceite.** 5 posts de exemplo validados por Zod; slugs coerentes; imagens com `alt` obrigatório.

---

## 6) SEO & Dados Estruturados
**Obrigatórios.** Canonical; sitemap.xml; RSS; JSON‑LD (`BlogPosting`, `FAQPage`, `BreadcrumbList`, `LegalService`).

**Interlink.** Padrões de links internos por tema/serviço; breadcrumbs.

**RACI (Seção 6).** R: SEO Lead. A: Editor‑Chefe. C: FE‑Astro, LAW‑CIV/INT. I: PM.

**Decisões‑chave.** Integração `@astrojs/sitemap`; JSON‑LD centralizado por layout.

**Checklist (SEO).**
- ▢ `title`/`description` válidos (≤ 155 chars).  
- ▢ Canonical único por página.  
- ▢ Sitemap e RSS publicados.  
- ▢ JSON‑LD válido (BlogPosting/FAQ/Breadcrumb/LegalService).  
- ▢ Interlink coerente; páginas de tag.

---

## 7) Acessibilidade & UX
**WCAG 2.2 AA — MUST.** Foco visível; navegação por teclado; contraste; landmarks; `aria‑*` coerente; TOC opcional.

**RACI (Seção 7).** R: A11Y. A: IX‑UI Designer. C: UX‑Writer, Visual Law. I: PM.

**Decisões‑chave.** Tokens de cor AA; componentes acessíveis; testes axe.

**Checklist (A11Y).**
- ▢ Nenhum erro crítico no axe.  
- ▢ Foco visível e ordem lógica.  
- ▢ Labels/`aria` consistentes.  
- ▢ Contraste AA.  
- ▢ Teclado completo.

---

## 8) Segurança & Compliance
**CSP/HSTS — MUST.** `_headers` por rotas; **Access** em `/blog/admin`; OAuth GitHub em Functions; segredos via variáveis de ambiente.

**RACI (Seção 8).** R: Security. A: DevOps/Cloudflare. C: Compliance, FE‑Astro. I: PM.

**Decisões‑chave.** Admin protegido por Access + OAuth; coleta mínima; consentimentos claros.

**Checklist (Segurança).**
- ▢ `_headers` ativo (CSP/HSTS/Referrer/Permissions).  
- ▢ Access aplicado a `/blog/admin`.  
- ▢ OAuth funcional em `/api/auth` & `/api/callback`.  
- ▢ Segredos fora do repo.  
- ▢ Formulários com validação e anti‑spam.

---

## 9) Operação Editorial (E2E)
**Pipeline.** Pauta → Outline → Rascunho → Revisões (SEO/SLD/QA/A11Y) → Aprovado (Editor‑Chefe) → Merge → Build/Publish → Distribuição (PR).

**Gates obrigatórios.** SLD‑<Eixo>, Compliance, A11Y.

**RACI (Seção 9).** R: Editor‑Chefe. A: PM. C: SEO Lead, QA‑CONT, A11Y, SLD‑<Eixo>. I: Distribution/PR.

**Checklist (Operação).**
- ▢ Checklist editorial cumprido.  
- ▢ Revisões registradas.  
- ▢ Merge por PR revisado.  
- ▢ Publicação verificada.

---

## 10) Medição & Observabilidade
**GA4 + Consent Mode v2 — MUST.** Eventos: `generate_lead`, `click_whatsapp`, `click_phone`, `download_asset`, `view_faq_item`. Parâmetros: `page_category`, `content_type`, `cta_type`, `topic`, `tag`. Dashboards e rotina quinzenal de revisão.

**RACI (Seção 10).** R: Data/Analytics. A: PM. C: CRO, SEO Lead. I: Editor‑Chefe.

**Checklist (Medição).**
- ▢ Consent Mode v2 ativo.  
- ▢ Eventos/params em Tempo Real.  
- ▢ Painel GA4 disponível.  
- ▢ Métricas CWV via Pages/GSC.

---

## 11) Critérios de Aceite
**Por tipo de post.**
- **Autoridade/Guia**: ≥ 1200 palavras; referências; FAQ; schema válido.  
- **Jurisprudencia**: ementas; citação; links; `Legislation`/`BlogPosting` conforme.  
- **Noticia**: data/hora; fonte; atualização.  
- **Opiniao**: tese clara; disclaimers OAB.  

**Técnicos (globais).** LCP/CLS conforme meta; axe sem críticos; sitemap/RSS; eventos GA4 disparando; busca Pagefind retornando.

**RACI (Seção 11).** R: QA‑CONT. A: Editor‑Chefe. C: A11Y, SEO Lead. I: PM.

**Checklist (Aceite).**
- ▢ CWV dentro da meta.  
- ▢ A11Y sem erros críticos.  
- ▢ JSON‑LD válido.  
- ▢ GA4 eventos OK.  
- ▢ Pagefind indexado.

---

## 12) RACI por Fase (Consolidado)
| Fase | R | A | C | I |
|---|---|---|---|---|
| Ideação | PM | Editor‑Chefe | SEO Lead, SLD‑<Eixo> | Todos |
| Rascunho | Autor/UX‑Writer | Editor‑Chefe | QA‑CONT, SEO Lead | SLD‑<Eixo> |
| Revisão | QA‑CONT | Editor‑Chefe | A11Y, LAW‑CIV/INT | PM |
| Build | FE‑Astro | DevOps/Cloudflare | Security, CMS‑Admin | KM/DocOps |
| Publicação | Editor‑Chefe | PM | Distribution/PR | Data/Analytics |
| Distribuição | Distribution/PR | PM | SEO Lead, CRO | Todos |

---

## 13) Governança de Mudanças
**Branches.** `feat/blog-<slug>`, `fix/blog-<slug>`, `ops/blog-<tarefa>`.
**Commits.** Conventional Commits (escopos: `content`, `seo`, `ux`, `a11y`, `cms`, `infra`, `analytics`).
**ADRs.** Toda decisão **MUST** possuir ADR com status e R/A.
**Rollback.** Reverter por PR; redirects 301 quando necessário.

**RACI.** R: KM/DocOps. A: PM. C: DevOps/Cloudflare. I: Todos.

---

## 14) Riscos & Mitigações
- **OAuth falho** → Testes locais + Access; plano B: *Workers* auth.  
- **Vendor lock‑in** → Infra estática; Pagefind OSS; exportável.  
- **SEO/A11Y** → Checklists por PR; ferramentas automatizadas (axe/lighthouse).  
- **Segurança** → CSP estrita; segredos em env; Access + MFA.

**RACI.** R: Security. A: PM. C: DevOps/Cloudflare. I: Todos.

---

## 15) Roadmap
**Curto (0–30d)**: Scaffold Astro; Decap admin; OAuth; Access; `_headers`; Pagefind; 5 posts base.  
**Médio (31–90d)**: i18n básico; páginas de serviço otimizadas; templates visuais; painéis GA4; testes CRO A/B low‑tech.

**RACI.** R: PM. A: Editor‑Chefe. C: FE‑Astro, DevOps, SEO Lead. I: Todos.

---

## 16) Artefatos de Referência (coláveis)

### 16.1 `/blog/public/_headers`
```text
# Segurança global
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()

# Admin (Decap)
/blog/admin/*
  Cache-Control: no-store
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https://api.github.com https://github.com https://raw.githubusercontent.com https://gitlab.com {{DOMAIN}}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'

# Pagefind assets
/_pagefind/*
  Cache-Control: public, max-age=31536000, immutable

```

### 16.2 `/blog/admin/config.yml` (Decap CMS)
```yaml
backend:
  name: github
  repo: PAVIEAdvocacia/PAVIE-091025   # AJUSTE se necessário
  branch: main
  base_url: https://pavieadvocacia.com.br
  auth_endpoint: /api/auth

site_url: https://pavieadvocacia.com.br/blog
logo_url: https://pavieadvocacia.com.br/assets/logo.png
locale: pt
publish_mode: editorial_workflow

media_folder: "blog/public/uploads"
public_folder: "/blog/uploads"

collections:
  - name: posts
    label: Artigos
    folder: "blog/src/content/posts"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    preview_path: "blog/{{slug}}/"
    editor:
      preview: true
    fields:
      - { label: "Título", name: "title", widget: "string" }
      - { label: "Data", name: "pubDate", widget: "datetime", format: "YYYY-MM-DD" }
      - { label: "Resumo", name: "description", widget: "text", hint: "≤ 155 caracteres" }
      - { label: "Autor", name: "author", widget: "string", default: "{{ORG}}" }
      - { label: "Tipo", name: "type", widget: "select", options: ["autoridade","guia","jurisprudencia","noticia","opiniao"] }
      - { label: "Tags", name: "tags", widget: "list", default: ["Sucessões & Inventário"] }
      - label: "Imagem de capa"
        name: "cover"
        widget: "object"
        fields:
          - { label: "Arquivo", name: "src", widget: "image" }
          - { label: "Alt (acessível)", name: "alt", widget: "string" }
      - { label: "Canonical (opcional)", name: "canonical", widget: "string", required: false }
      - { label: "Noindex", name: "noindex", widget: "boolean", default: false, required: false }
      - { label: "Corpo", name: "body", widget: "markdown" }
```

### 16.3 `/blog/src/content/schemas/post.ts` (Zod/Content Collections)
```ts
import { z, defineCollection } from 'astro:content';

export const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(8),
    description: z.string().max(155),
    pubDate: z.coerce.date(),
    author: z.string().default('{{ORG}}'),
    type: z.enum(['autoridade','guia','jurisprudencia','noticia','opiniao']),
    tags: z.array(z.string()).nonempty(),
    cover: z.object({
      src: z.string(),
      alt: z.string().min(10)
    }),
    canonical: z.string().url().optional(),
    noindex: z.boolean().optional().default(false)
  })
});
```

### 16.4 GA4 (Consent Mode v2 + eventos)
```html
<!-- GA4 base -->
<script async src="https://www.googletagmanager.com/gtag/js?id={{GA4_ID}}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  });
  gtag('js', new Date());
  gtag('config', '{{GA4_ID}}', { anonymize_ip: true });
</script>
<!-- Após opt-in -->
<script>
  function grantConsent(){
    gtag('consent', 'update', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'
    });
  }
  // Eventos customizados
  function sendLead(params){ gtag('event', 'generate_lead', params); }
  function clickWhatsApp(params){ gtag('event', 'click_whatsapp', params); }
  function clickPhone(params){ gtag('event', 'click_phone', params); }
  function downloadAsset(params){ gtag('event', 'download_asset', params); }
  function viewFaqItem(params){ gtag('event', 'view_faq_item', params); }
</script>
```

### 16.5 JSON‑LD (exemplos)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{title}}",
  "description": "{{description}}",
  "datePublished": "{{pubDate}}",
  "image": "{{cover.src}}",
  "author": { "@type": "Organization", "name": "{{ORG}}" },
  "publisher": { "@type": "Organization", "name": "{{ORG}}" },
  "mainEntityOfPage": {"@type":"WebPage","@id":"{{canonical}}"}
}
</script>
```
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"Pergunta 1","acceptedAnswer":{"@type":"Answer","text":"Resposta 1."}}
  ]
}
</script>
```
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Blog","item":"https://pavieadvocacia.com.br/blog/"},
    {"@type":"ListItem","position":2,"name":"{{title}}","item":"{{canonical}}"}
  ]
}
</script>
```

### 16.6 Pagefind (scripts)
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "postbuild": "pagefind --site dist",
    "preview": "astro preview"
  },
  "devDependencies": { "pagefind": "^1.0.0" }
}
```

### 16.7 Cloudflare Pages Functions — OAuth GitHub (Decap)
**`/blog/functions/api/auth.ts`** e **`/blog/functions/api/callback.ts`** ver ADRs correspondentes.
