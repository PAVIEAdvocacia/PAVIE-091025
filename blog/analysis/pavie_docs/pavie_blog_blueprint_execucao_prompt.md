# Execução do Prompt Mestre — Estruturação do Blog Jurídico da PAVIE Advocacia

## 1. Tese central

O blog jurídico da PAVIE deve ser tratado como **produto editorial institucional de alto ROI e alto valor**, subordinado ao ecossistema estratégico da banca, e não como simples área de posts. O Plano Diretor fixa Astro como frontend, Firebase como captura, Obsidian local-first como cérebro operacional e GitHub como controle de versão; também exige rastreabilidade, supervisão humana sobre IA e comunicação baseada em problemas reais, com Legal Design e conversão ética. A identidade digital reforça que as plataformas digitais devem funcionar como engrenagens de autoridade e captura orgânica, e não como folhetos virtuais. A paleta institucional, por sua vez, já prevê uso editorial, conversivo, acessível e orientado à leitura longa. 

## 2. Diagnóstico do fluxo atual

### 2.1 Fluxo-base

O fluxo **Decap Admin → Markdown com frontmatter → Astro → GitHub → Cloudflare** é conceitualmente correto para a PAVIE, porque preserva velocidade, publicação estática, rastreabilidade e governança. Ele é coerente com o desenho estratégico já fixado: o ecossistema web deve usar Astro como camada pública, GitHub como trilha auditável e o núcleo intelectual deve permanecer desacoplado e estruturado por dados. 

### 2.2 O que está certo

- O blog em subdomínio é compatível com a arquitetura desacoplada do ecossistema.
- O uso de Markdown via admin é compatível com produtividade editorial.
- O uso de GitHub e Cloudflare reforça rastreabilidade e publicação limpa.
- O uso de Codex e ferramentas equivalentes é coerente com o paradigma de desenvolvimento agêntico sob revisão humana.

### 2.3 O que ainda falta formalizar

O ponto fraco não está no stack, mas no **contrato editorial e operacional**. O sistema só fica realmente robusto quando estiver formalmente amarrado:

- o que o Decap capta;
- o que o frontmatter canoniza;
- o que a home do blog renderiza;
- o que a página de leitura exige;
- como os links relacionados são formados;
- como o CTA varia por intenção;
- como o blog conversa com Instagram e outros derivados;
- como a IA recebe instruções estruturantes sem inventar contratos implícitos.

## 3. Objetivo do blog dentro do ecossistema PAVIE

O blog deve operar simultaneamente como:

1. vitrine pública de autoridade jurídica;
2. motor de busca qualificada por intenção;
3. camada de educação pré-consulta;
4. sistema de aprofundamento temático;
5. repositório de ativos reutilizáveis;
6. instrumento de conversão ética;
7. base para conteúdos derivados em outros canais;
8. componente integrado ao site institucional.

A meta não é atrair “mais tráfego” em abstrato, mas **mais clientes qualificados**, com menor CAC, maior confiança prévia e maior reaproveitamento do conteúdo produzido.

## 4. Arquitetura recomendada do ecossistema comunicacional

### 4.1 Camadas do sistema

- **Site institucional principal:** âncora reputacional e institucional.
- **Blog em subdomínio:** hub editorial e indexador temático.
- **Home do blog:** distribuidor de autoridade, descoberta e clusters.
- **Página de leitura:** ambiente de leitura profunda, aprofundamento e conversão ética.
- **Decap Admin:** interface de entrada editorial.
- **Markdown + frontmatter:** registro canônico do artigo.
- **Astro:** renderização da home e das páginas individuais.
- **GitHub:** trilha auditável, versionamento e integridade.
- **Cloudflare:** publicação estática.
- **GitHub Desktop:** operação local de versionamento.
- **Codex Desktop:** criação, ajuste, refatoração, QA e evolução assistida.
- **Camada humana de revisão:** validação obrigatória de todo ato editorial e técnico relevante.

### 4.2 Fonte única de verdade

A fonte única de verdade do conteúdo deve ser o **arquivo Markdown com frontmatter**. Nada relevante deve existir apenas no template ou apenas no admin.

## 5. Organização editorial do blog

### 5.1 Home do blog

A home do blog não deve ser mero arquivo cronológico. Ela deve funcionar como:

- hub editorial institucional;
- indexador por tema, área e dor;
- distribuidor de links internos;
- organizador de clusters;
- ambiente de descoberta;
- camada de confiança;
- ponte entre site institucional e artigos.

Ela deve prever, progressivamente:

- destaque principal;
- cards consistentes;
- agrupamento temático;
- organização por área;
- filtros ou coleções quando úteis;
- blocos de entrada por intenção;
- links internos fortes;
- CTA discretos e contextuais.

### 5.2 Página de leitura

Com base no protótipo, a página de leitura já tem a arquitetura certa e deve ser normatizada assim:

- hero editorial com imagem e metadados;
- badge de categoria;
- título forte e leitura longa confortável;
- assinatura/autoria institucional;
- data de publicação e atualização;
- tempo de leitura;
- índice do próprio artigo;
- player de áudio, quando houver;
- transcrição, quando houver;
- bloco de destaque/citação;
- corpo principal limpo e hierárquico;
- box de atenção jurídica, quando couber;
- CTA contextual;
- bloco “Aprofunde a leitura”;
- assinatura institucional no fechamento;
- artigos relacionados;
- rodapé institucional coerente.

## 6. Lógica da lateral: índice + CTA + aprofunde a leitura

A lateral do artigo deve ser tratada como **arquitetura de atenção**, não como coluna ornamental.

### 6.1 Índice (“Neste Artigo”)
Função: orientação, navegação interna, redução de atrito cognitivo e apoio à escaneabilidade.

### 6.2 CTA (“Agendar Consultoria”)
Função: conversão ética. A posição entre o índice e o aprofundamento é defensável e, no protótipo, funciona bem porque:

- o índice pode variar de tamanho;
- o CTA entra antes do bloco expandido de exploração;
- ele captura intenção já aquecida sem invadir o topo da leitura principal.

A regra não deve ser “fixar o botão ali para sempre”, mas: **o CTA deve ocupar zona de legitimidade contextual**, podendo variar por tipo de artigo, área, estágio de funil e altura da lateral.

### 6.3 “Aprofunde a leitura”
Função: ampliar interesse, distribuir autoridade interna, aumentar tempo útil de permanência, formar trilhas temáticas e apoiar SEO interno. Ele não compete com o índice: o índice olha para dentro do texto; o aprofundamento olha para o ecossistema editorial.

## 7. Caminhos do clique

Nenhum artigo pode terminar em isolamento. Toda página de leitura deve permitir, de forma clara:

1. continuar no próprio artigo via índice;
2. explorar conteúdo correlato do mesmo cluster;
3. avançar para outro conteúdo mais profundo ou mais específico;
4. seguir para CTA institucional coerente;
5. retornar a hubs temáticos do blog;
6. migrar para instrumentos correlatos do ecossistema institucional.

O blog deve operar com **trilhas editoriais**, e não com links aleatórios.

## 8. Lógica de leads e intenção

O blog deve suportar diferentes tipos de intenção, por exemplo:

- leitor exploratório;
- leitor em diagnóstico;
- leitor em comparação de caminhos;
- leitor com urgência;
- potencial cliente qualificado;
- lead indireto de autoridade.

O conteúdo precisa servir à qualificação e não apenas à captação. Isso exige CTA, taxonomia, relacionados e clusters coerentes.

## 9. Taxonomia recomendada

A taxonomia deve ser curta, forte e útil. Recomenda-se operar, ao menos, com:

- **area**: sucessoes, familia, imobiliario, internacional, contratos, cobranca;
- **tema**: inventario_extrajudicial, itcmd, holding_familiar, divórcio_com_partilha etc.;
- **content_type**: guia, explicativo, checklist, comparativo, FAQ, atualização, caso_pratico;
- **intent**: informar, diagnosticar, comparar, converter, aprofundar;
- **funnel_stage**: topo, meio, fundo;
- **cta_variant**: consultoria, checklist, calculadora, contato, leitura_relacionada;
- **jurisdiction_scope** quando necessário.

A mesma taxonomia deve alimentar home, relacionados, CTA, clusters, métricas e conteúdos derivados.

## 10. Frontmatter canônico

Modelo mínimo recomendado:

```yaml
editorial_item_id: "PAVIE-BLOG-YYYYMMDD-SEQ"
title: ""
slug: ""
description: ""
excerpt: ""
area: ""
tema: []
content_type: ""
intent: ""
funnel_stage: ""
author_ref: "fabio-pavie"
published_at: ""
updated_at: ""
featured_image: ""
featured_image_alt: ""
reading_time: 0
audio_status: "none"
audio_url: ""
transcript_url: ""
cta_variant: ""
related_manual: []
tags: []
publish_status: "draft"
update_status: "current"
canonical_url: ""
trace_ref: ""
```

## 11. Decap Admin

O Decap deve ser ajustado para captar exatamente o que o frontmatter exige. Regras mínimas:

- campos obrigatórios claros;
- ajuda editorial em cada campo;
- slug disciplinado;
- distinção entre draft/publicado;
- preview coerente;
- campos para SEO, acessibilidade, CTA, áudio e relacionados;
- proibição de campos redundantes sem função.

## 12. Identidade visual editorial

A identidade visual do blog deve se subordinar à marca institucional, preservando o caráter sério, editorial e conversivo. O manual já fixa as funções cromáticas e de contraste.

### 12.1 Papéis cromáticos essenciais

- **Verde Petróleo `#2F4E4A`**: ação, autoridade, títulos e CTA.
- **Grafite Jurídico `#25282B`**: header, footer, seções de densidade institucional.
- **Marfim `#F5F1EB`**: fundo geral.
- **Branco Quente `#FCFAF7`**: superfície do artigo e cards.
- **Cinza Texto `#3B4044`**: corpo de leitura.
- **Areia `#CCB093`**: destaque, hover, selo, detalhe.
- **Azul Névoa `#8FA4A7`**: linha, ícone secundário, detalhe editorial.

### 12.2 Regras práticas

- Regra 70/20/10 obrigatória.
- Areia nunca como texto longo.
- Azul Névoa nunca como corpo de texto.
- CTA primário em verde com texto claro.
- Cards em superfície clara com borda neutra.
- Links verdes com hover areia ou sublinhado editorial.

## 13. UX, IX e acessibilidade

O blog deve priorizar leitura longa, escaneabilidade e conversão ética. Requisitos mínimos:

- landmarks semânticos;
- hierarchy de headings correta;
- foco visível;
- navegação por teclado;
- estados hover/focus consistentes;
- contraste adequado;
- alt text em imagem de capa;
- player operável;
- transcrição quando houver áudio;
- redução de ruído visual;
- lateral estável e clara;
- mobile responsivo sem sacrificar a leitura principal.

## 14. SEO editorial e descoberta

O blog deve operar com:

- slug limpo;
- title e description úteis;
- canonical consistente;
- breadcrumbs;
- Open Graph;
- dados estruturados úteis;
- interlinking forte;
- organização por cluster;
- atualização de artigos sensíveis;
- coerência entre home, artigo e hubs temáticos.

O foco é conteúdo de intenção, utilidade e autoridade, nunca SEO raso.

## 15. Conteúdo derivado e ecossistema comunicacional

O blog deve ser o centro de um sistema de reaproveitamento. Cada artigo pode gerar:

- carrossel de Instagram;
- snippet curto;
- resumo executivo;
- roteiro de áudio;
- ganchos de publicação social;
- FAQ derivado;
- highlights para reels/stories;
- CTA para calculadora, checklist ou consulta.

A lógica recomendada é a “dobradinha”:

- **Instagram → Blog**: o card social puxa para o artigo completo;
- **Blog → Instagram**: o artigo oferece continuidade social, reforço de autoridade e recirculação.

## 16. Fluxo GitHub / Codex / Cloudflare

Fluxo operacional recomendado:

1. pauta e arquitetura definidas no acervo PAVIE;
2. criação/edição do conteúdo via Decap ou local;
3. versionamento em Git/GitHub;
4. operação local via GitHub Desktop;
5. ajustes estruturais e refatorações com Codex Desktop;
6. revisão humana obrigatória;
7. commit e push;
8. deploy em Cloudflare;
9. checagem pós-publicação.

Codex deve atuar como amplificador de velocidade, qualidade e manutenção. Nunca como substituto da revisão humana.

## 17. Estrutura de arquivos sugerida

```text
/blog
  /public
    /images
    /audio
  /src
    /content
      /posts
      /authors
      /areas
    /layouts
      BlogLayout.astro
      ReadingLayout.astro
    /components
      Header.astro
      Footer.astro
      ArticleHero.astro
      ArticleMeta.astro
      ArticleTOC.astro
      CTABox.astro
      DeepReadBox.astro
      AudioPlayer.astro
      QuoteBox.astro
      RelatedPosts.astro
      AuthorCard.astro
      Breadcrumbs.astro
      BlogCard.astro
      ClusterSection.astro
      LeadPath.astro
    /pages
      index.astro
      blog/index.astro
      blog/[slug].astro
      areas/[area].astro
      temas/[tema].astro
    /lib
      taxonomy.ts
      related.ts
      reading-time.ts
      seo.ts
      schema.ts
      cta.ts
      lead-paths.ts
  /admin
    config.yml
  package.json
  astro.config.mjs
  README.md
```

## 18. Documentos canônicos que devem nascer agora

1. **11.00 Política do Ecossistema Editorial, Blog Jurídico e Publicações Institucionais**
2. **11.01 Política de Modelo de Conteúdo, Frontmatter, Taxonomia e Campos do Decap**
3. **11.02 Política da Página Principal do Blog, Arquitetura de Listagem e Navegação**
4. **11.03 Política da Página de Leitura, Componentes, UX e Acessibilidade**
5. **11.04 Política de Workflow Editorial, Revisão Jurídica, Atualização e Governança de Publicação**
6. **11.05 Política de SEO Editorial, Dados Estruturados, Canonical, Sitemap, RSS e Descoberta**
7. **11.06 Política de Interlinking, CTAs, Conversão Ética e Métricas do Blog**
8. **11.07 Política de Áudio, Mídias Derivadas, Transcrição e Reaproveitamento Editorial**
9. **11.08 Protocolo de QA Editorial, Testes Funcionais e Observabilidade do Blog**

## 19. Decisão executiva

A base do stack já é suficiente. O que falta não é trocar tecnologia, mas **canonizar o blog como sistema editorial integrado ao site institucional**.

Portanto, a ordem correta é:

1. consolidar o **11.00**;
2. amarrar **11.01–11.08**;
3. só depois refinar templates e automações;
4. usar Codex e GitHub Desktop como instrumentos de execução sob revisão humana;
5. transformar cada artigo em ativo composto, rastreável, compartilhável e conversivo.
