# PAVIE | Advocacia — Site Institucional
Repositório oficial do **site institucional** da **PAVIE | Advocacia** (solo + parcerias). Foco em **confiança, clareza e conversão**, com observância à ética profissional (Prov. **OAB 205/2021**), **LGPD/GDPR**, **WCAG 2.2 AA**, **Core Web Vitals** e **SEO técnico** (Schema.org).

- **Responsável técnico**: Fabio Mathias Pavie — OAB/RJ **134.947**
- **Site**: https://www.pavieadvocacia.com.br
- **E-mail**: fabiopavie@pavieadvogado.com
- **Telefone/WhatsApp**: +55 (21) **96438-2263**
- **Endereço profissional**: Av. Ataulfo de Paiva, 1235, Sala 303/191 — Leblon Office Tower — Leblon — Rio de Janeiro/RJ — CEP 22440-034

---

## 1) Propósito & Escopo    d
- **O que é**: código-fonte do site estático (landing principal, páginas de serviços, contato, políticas, blog informativo).
- **O que não é**: gestão de casos, banco de dados de clientes ou documentos sigilosos (**NÃO** versionar aqui).

## 2) Pilares de Confiança
- **Ética (OAB 205/2021)**: conteúdo informativo, sem promessa de resultado, sem captação indevida, sem comparação com colegas.
- **Clareza & Visual Law**: linguagem objetiva, hierarquia visual, microcopy que guia a ação e reduz ambiguidade.
- **Documentação & Transparência**: políticas e termos públicos, registro de mudanças versionado.

## 3) Como Editar e Publicar
**Edição rápida no navegador**
- Pressione `.` neste repositório (ou acesse `https://github.dev/<owner>/<repo>`) para abrir o editor web.

**Fluxo local com GitHub Desktop**
1. `Code → Open with GitHub Desktop` → **Clone**.
2. Faça alterações → escreva a mensagem de **Commit** → **Push origin**.
3. Sugestão: crie e trabalhe no branch `dev`; abra **Pull Request** para `main`.

**Publicação (Cloudflare Pages)**
- Projeto conectado a este repositório. Framework: *None* (HTML puro). **Build**: _vazio_. **Output directory**: `/` (ou `dist` se gerador).
- Cada **push no `main`** gera **deploy** automático. PRs têm **pré-visualizações** (URLs temporárias).
- **Domínio**: https://www.pavieadvocacia.com.br (DNS e TLS gerenciados no Cloudflare).

## 4) Stack & Estrutura de Pastas
```
/
├─ index.html
├─ pages/                     # páginas internas: /servicos, /contato, /privacidade, /termos, etc.
├─ assets/
│  ├─ css/style.css
│  ├─ js/main.js
│  └─ img/
├─ forms/                     # templates HTML de formulários (integração com e-mail/API)
├─ sitemap.xml
├─ robots.txt
└─ README.md
```

## 5) Diretrizes de Conteúdo (Advocacia)
- **Proibido** prometer resultados, usar expressões de garantia de êxito ou divulgar casos sem consentimento **expresso**.
- **Disclaimer**: mensagens via site/WhatsApp **não** constituem, por si só, contratação ou relação advogado–cliente.
- **Tom de voz**: técnico, empático e objetivo; foco em orientar e qualificar o lead; evitar jargões desnecessários.
- **Depoimentos** (se houver): apenas informativos, com consentimento, sem superlativos e sem criar expectativa de resultado.
- **Compliance visual**: manter identidade PAVIE (paleta azul‑petróleo + laranja), textos legíveis e CTAs claros.

## 6) Privacidade & LGPD/GDPR
- **Coleta mínima**: nome, e‑mail, telefone e conteúdo da mensagem, exclusivamente para retorno do contato.
- **Base legal**: consentimento e/ou legítimo interesse (art. 7º, LGPD), conforme o caso.
- **Políticas**: publicar **Política de Privacidade** (`/pages/privacidade.html`) e **Termos de Uso** (`/pages/termos.html`).
- **Cookies/Analytics**: preferir **Cloudflare Web Analytics** (sem cookies). Caso use ferramentas que exijam consentimento, exibir **banner**.
- **Registros (art. 37 LGPD)**: mantidos **fora** deste repositório (planilhas/sistemas internos).
- **Solicitações do titular**: incluir canal claro de atendimento (e‑mail).

## 7) Acessibilidade (WCAG 2.2 AA)
- **Contraste** ≥ 4.5:1; fontes responsivas (≥16px); foco visível; navegação por teclado.
- **Imagens** com `alt` descritivo; formulários com `label`, instruções e mensagens de erro claras.
- **Semântica**: títulos hierárquicos (`h1…h3`), landmarks (`header`, `main`, `nav`, `footer`) e ARIA quando necessário.
- **Alvos clicáveis** confortáveis; evitar apenas cor para transmitir informação; respeitar preferências de movimento reduzido.

## 8) SEO Técnico & Dados Estruturados
- **Metadados**: `<title>` ≤ 60 caracteres; `meta description` 150–160; **canonical**; **Open Graph/Twitter Cards**.
- **Arquivos**: `sitemap.xml` e `robots.txt` atualizados; slugs legíveis; links internos consistentes.
- **Schema.org**: JSON‑LD `LegalService`/`Attorney` no `<head>` (ver modelo abaixo).
- **Performance**: imagens otimizadas e `loading="lazy"`; minificação/compactação; CDN HTTP/2/3.
- **i18n**: seções em PT‑BR; considerar `hreflang` em caso de conteúdo multi‑idioma no futuro.

### Exemplo de JSON‑LD (`LegalService`)
Cole no `<head>` do `index.html` e ajuste conforme necessário.
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "PAVIE | Advocacia",
  "legalName": "PAVIE | Advocacia",
  "url": "https://www.pavieadvocacia.com.br",
  "image": "https://www.pavieadvocacia.com.br/assets/img/og-image.jpg",
  "telephone": "+55-21-96438-2263",
  "email": "fabiopavie@pavieadvogado.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Ataulfo de Paiva, 1235, Sala 303/191 – Leblon Office Tower – Leblon",
    "addressLocality": "Rio de Janeiro",
    "addressRegion": "RJ",
    "postalCode": "22440-034",
    "addressCountry": "BR"
  },
  "areaServed": "BR",
  "priceRange": "Sob consulta",
  "founder": {
    "@type": "Person",
    "name": "Fabio Mathias Pavie",
    "identifier": "OAB/RJ 134.947"
  },
  "knowsAbout": [
    "Direito de Família",
    "Sucessões e Inventário",
    "Família Binacional",
    "Contratos e Negócios",
    "Direito do Consumidor",
    "Direito Imobiliário"
  ],
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "09:00",
    "closes": "18:00"
  }]
}
</script>
```

## 9) Performance & Segurança
- **Metas CWV**: LCP < 2,5s • CLS < 0,1 • INP < 200ms.
- **Imagens**: formatos modernos quando viável (WebP/AVIF), `width/height` definidos, `lazy` para não‑visíveis.
- **Segurança**: HTTPS obrigatório; headers (`Content‑Security‑Policy`, `Referrer‑Policy`, `X‑Frame‑Options`, `X‑Content‑Type‑Options`); evitar inline scripts.
- **Backups**: manter releases versionados e restaurações via Git tags.

## 10) Métricas de Interesse & Conversão
- **Meta “excelente”**: taxa de conversão **> 7%** (copy informativa, schema estruturado, design acessível e CWV rápido).
- Medir: **taxa de rejeição (bounce)**, **tempo médio na página**, **origem do tráfego** (orgânico/direto/referencial) e **taxa de retorno** (visitantes recorrentes).
- Eventos: cliques em WhatsApp/telefone, envios de formulários, downloads e agendamentos.
- Ferramentas: Cloudflare Web Analytics; (opcional) GA4 com consentimento explícito.

## 11) Fluxo de Desenvolvimento
- **Branches**: `main` (produção), `dev` (homologação), `feature/*` (novas seções).
- **Commits**: Conventional Commits (ex.: `feat: seção Sucessões`, `fix: contraste do CTA`).
- **Pull Requests**: revisão com checklist abaixo; merge via Squash & Merge.
- **Release**: tag `vX.Y.Z` + atualização do **CHANGELOG.md**.

### Checklist de PR (Qualidade & Compliance)
- [ ] Ética OAB 205/2021 ✔
- [ ] LGPD/Políticas de privacidade e base legal ✔
- [ ] Acessibilidade WCAG 2.2 AA ✔
- [ ] SEO/Schema/OG/Canonical ✔
- [ ] Core Web Vitals (LCP/CLS/INP) ✔
- [ ] Microcopy clara + CTA visível ✔
- [ ] Cross‑browser/responsivo testado ✔

## 12) Roadmap
- **v1.0**: landing principal + blocos de serviços + contato.
- **v1.1**: políticas/termos + formulário validado + mensagens de erro acessíveis.
- **v1.2**: blog jurídico informativo (sem casos sensíveis; postagens evergreen).
- **v1.3**: testes A/B de headline/CTA; otimizações de conversão.
- **v1.4**: internacionalização mínima (páginas guia para casos binacionais).

## 13) Changelog
- Histórico de mudanças mantido em `CHANGELOG.md` (datado e taggeado).

## 14) Licença
- Repositório **privado**. **Todos os direitos reservados** (PAVIE | Advocacia).
- Se tornar **público**, licenciar **apenas o código** (ex.: MIT) — marcas, identidade visual e conteúdos permanecem **reservados**.

## 15) Contatos Profissionais
- **Site**: https://www.pavieadvocacia.com.br
- **E-mail**: fabiopavie@pavieadvogado.com
- **Telefone/WhatsApp**: +55 (21) 96438-2263
- **OAB/RJ**: 134.947
- **Endereço**: Av. Ataulfo de Paiva, 1235, Sala 303/191 — Leblon Office Tower — Leblon — Rio de Janeiro/RJ — CEP 22440-034

> **CTA**: **Solicitar proposta** — use os botões do site para enviar mensagem ou agendar atendimento. 
