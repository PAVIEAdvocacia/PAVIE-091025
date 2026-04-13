---
id: pavie-cadeia-de-granulacao-site-blog
title: "PAVIE — Cadeia de Granulação Site/Blog"
type: cadeia_de_granulacao_operacional
status: extrato_operacional_consolidado
version: "1.1-cat-08"
date: "2026-04-13"
owner: "Fabio Mathias Pavie"
authority_level: derivado_da_cadeia_canonica_existente
parent_documents:
  - "Registro Mestre de Vigência Documental da PAVIE Advocacia"
  - "12.02 — Arquitetura Editorial do Blog Jurídico da PAVIE Advocacia"
  - "12.06 — Governança de Conteúdo, Frontmatter e Migração do Acervo da PAVIE Advocacia"
  - "Matriz Canônica Final de Superfícies Públicas da PAVIE"
  - "Registro de Prevalência e Reconciliação Documental da CAT-08"
applies_to:
  - "site institucional"
  - "blog jurídico"
  - "S1"
  - "S2"
  - "B1"
  - "B2"
  - "B3"
tags:
  - pavie
  - cadeia-de-granulacao
  - site
  - blog
  - cat-08
  - taxonomia
---

# PAVIE — Cadeia de Granulação Site/Blog

## 1. Objeto

Este documento materializa, em formato operacional, a cadeia de granulação entre site institucional e blog jurídico da PAVIE.

Ele não cria cadeia paralela, não reabre arquitetura e não amplia taxonomia. Sua função é consolidar a projeção atual da cadeia canônica no estado de 8 categorias controladas, de `CAT-01` a `CAT-08`.

Regra funcional preservada:

1. o site enquadra, organiza confiança e converte de forma qualificada;
2. o blog amadurece leitura, organiza dúvidas e devolve o leitor ao site;
3. cada categoria editorial mantém vínculo 1:1 com sua página institucional de área correspondente;
4. o front-end não cria taxonomia por conta própria.

---

## 2. Nível Taxonômico Geral

| Código | Título canônico | Título curto de interface | areaSlug | categorySlug |
|---|---|---|---|---|
| CAT-01 | Sucessões, Inventários e Partilha Patrimonial | Sucessões e Inventários | `sucessoes-inventarios-partilha-patrimonial` | `sucessoes-inventarios-partilha-patrimonial` |
| CAT-02 | Planejamento Patrimonial, Sucessório e Arranjos Preventivos | Planejamento Patrimonial | `planejamento-patrimonial-sucessorio-arranjos-preventivos` | `planejamento-patrimonial-sucessorio-arranjos-preventivos` |
| CAT-03 | Família Patrimonial e Dissoluções | Família Patrimonial | `familia-patrimonial-dissolucoes` | `familia-patrimonial-dissolucoes` |
| CAT-04 | Família Binacional, Sucessões Internacionais e Cooperação Documental | Família Binacional | `familia-binacional-sucessoes-internacionais-cooperacao-documental` | `familia-binacional-sucessoes-internacionais-cooperacao-documental` |
| CAT-05 | Imóveis, Registro, Regularizações e Litígios Patrimoniais | Imóveis e Regularizações | `imoveis-registro-regularizacoes-litigios-patrimoniais` | `imoveis-registro-regularizacoes-litigios-patrimoniais` |
| CAT-06 | Cobrança, Execução, Contratos e Recuperação de Crédito Seletiva | Cobrança e Contratos | `cobranca-execucao-contratos-recuperacao-credito-seletiva` | `cobranca-execucao-contratos-recuperacao-credito-seletiva` |
| CAT-07 | Tributação Patrimonial e Recuperação Tributária Seletiva | Tributação Patrimonial | `tributacao-patrimonial-recuperacao-tributaria-seletiva` | `tributacao-patrimonial-recuperacao-tributaria-seletiva` |
| CAT-08 | Direito do Consumidor e Responsabilidade Civil | Consumidor e Responsabilidade Civil | `direito-do-consumidor-responsabilidade-civil` | `direito-do-consumidor-responsabilidade-civil` |

---

## 3. Registro Mestre Da CAT-08

### 3.1 Identificação

- Código: `CAT-08`
- Título canônico: Direito do Consumidor e Responsabilidade Civil
- Título curto de interface: Consumidor e Responsabilidade Civil
- areaSlug: `direito-do-consumidor-responsabilidade-civil`
- categorySlug: `direito-do-consumidor-responsabilidade-civil`
- Rota S2: `/areas/direito-do-consumidor-responsabilidade-civil/`
- Rota B2: `/blog/categoria/direito-do-consumidor-responsabilidade-civil/`

### 3.2 Página Institucional Recomendada

- Título recomendado da página institucional: Direito do Consumidor e Responsabilidade Civil
- Subtítulo/hero recomendado: Falhas relevantes de consumo, negativação indevida, cobranças abusivas, passagens aéreas e responsabilidade civil exigem prova, cronologia e leitura objetiva do dano.
- Objetivo da página: enquadrar casos de consumo e responsabilidade civil que dependem de prova mínima, cronologia e leitura proporcional antes de qualquer medida.
- CTA principal recomendado: Solicitar análise inicial
- Ponte com o blog: Explorar categoria

### 3.3 Escopo De Atuação

A CAT-08 cobre, de forma controlada e sem absorção pela CAT-06:

- passagens aéreas com atraso, cancelamento, perda de conexão, reembolso e bagagem;
- negativação indevida;
- cobranças indevidas, em duplicidade ou posteriores a cancelamento;
- compras online com não-entrega, atraso excessivo, recusa de devolução ou oferta não cumprida;
- falhas de serviço documentáveis com impacto patrimonial ou pessoal relevante.

### 3.4 Documentação Típica

- documentos pessoais básicos;
- contrato, bilhete, reserva, fatura, boleto ou comprovante do vínculo de consumo;
- comprovantes de pagamento, extratos e recibos;
- e-mails, prints, mensagens, protocolos, notificações e respostas do fornecedor;
- registros de negativação, reembolso negado, gastos adicionais ou prejuízo material, quando existentes;
- cronologia simples do ocorrido, com datas, tentativas de solução e consequências.

### 3.5 Tipos Prioritários No Blog

- `cornerstone`
- `guide`
- `faq`
- `checklist`
- `spoke`
- `case-note`

---

## 4. Contrato S2 — CAT-08

S2 é página institucional de área. Sua função é conectar situação concreta, critérios técnicos, documentos, FAQ específica, leitura útil antes do contato e CTA de análise inicial. Não é mini-home comercial e não deve operar como segunda página de captura agressiva.

### 4.1 Copy-base

- Headline: Falhas relevantes de consumo, passagens aéreas, negativação indevida, cobranças abusivas e responsabilidade civil exigem prova, cronologia e leitura objetiva do dano.
- Subheadline: A análise separa insatisfação cotidiana de lesão juridicamente relevante, organizando documentos, provas, cronologia e impactos concretos antes da definição da via adequada.
- Enquadramento do problema: conflitos de consumo e responsabilidade civil dependem de prova verificável, vínculo de consumo demonstrável, tentativa de solução e impacto concreto.
- Limites e cautelas: nem toda falha gera indenização; não há promessa de resultado, valor de reparação ou medida adequada sem análise do caso concreto.
- Microcopy de leitura útil: A categoria editorial correspondente ajuda a compreender prova, dano, negativação, cobranças, falhas de serviço e limites de reparação antes da análise do caso.
- CTA principal: Solicitar análise inicial
- CTA secundário: Explorar categoria

### 4.2 FAQ Específica Inicial

1. Todo problema de consumo gera dano moral?
2. Negativação indevida sempre permite indenização?
3. Atraso ou cancelamento de voo sempre gera reparação?

---

## 5. Contrato B2 — CAT-08

B2 é página de categoria editorial. Sua função é maturar o tema, organizar leituras, explicitar a relação com a área institucional e devolver o leitor ao site em CTA subordinado.

### 5.1 Copy-base

- Breadcrumb: Início > Publicações > Categorias > Direito do Consumidor e Responsabilidade Civil
- Headline: Direito do Consumidor e Responsabilidade Civil
- Subheadline curta: Leituras sobre falhas de consumo, passagens aéreas, cobranças, negativação e responsabilidade civil com foco em prova, limites e documentação.
- Texto introdutório: Esta categoria reúne artigos, guias, checklists e perguntas frequentes para ajudar o leitor a compreender quando uma falha de consumo deixa de ser mero incômodo e passa a exigir análise técnica.
- Recondução para a área correspondente: Se o caso já possui documentos, cronologia e impacto concreto, a página institucional da área organiza os critérios para o primeiro contato.
- CTA editorial dominante: Explorar categoria
- CTA institucional subordinado: Conhecer área

---

## 6. Article Map Mínimo — CAT-08

| Ordem | Título provisório | Tipo | Intenção de busca | Estágio | CTA final | Função no cluster |
|---:|---|---|---|---|---|---|
| 1 | Quando uma falha de consumo justifica análise jurídica individual? | `cornerstone` | Diferenciar incômodo cotidiano, falha documentável e caso com possível reparação | `clarify` | Conhecer área | Texto-pilar da categoria |
| 2 | Checklist de documentos para cobrança indevida, negativação ou falha de serviço | `checklist` | Separar documentos antes da análise | `decide` | Conhecer área | Preparação documental e redução de contato desorganizado |
| 3 | Passagem aérea: atraso, cancelamento, conexão perdida e bagagem exigem quais provas? | `guide` | Entender provas relevantes em problemas aéreos | `clarify` | Explorar categoria | Guia prático de alto ROI editorial |
| 4 | Negativação indevida: perguntas frequentes antes de buscar reparação | `faq` | Responder dúvidas sobre inscrição indevida, origem da dívida e prova | `discover` | Conhecer área | Entrada por dúvida recorrente |
| 5 | Compra online não entregue ou oferta descumprida: como organizar a cronologia | `spoke` | Organizar fatos e documentos em e-commerce | `clarify` | Explorar categoria | Spoke de recorte documentável |
| 6 | Reembolso negado e cobranças após cancelamento: quando o problema deixa rastro documental | `case-note` | Compreender padrões documentais sem promessa de resultado | `compare` | Conhecer área | Nota aplicada e subordinada ao cornerstone |

### 6.1 Destaque Primário

O destaque primário da categoria deve ser o cornerstone: "Quando uma falha de consumo justifica análise jurídica individual?".

### 6.2 Dependências

Podem ser publicados antes do cornerstone:

- checklist de documentos;
- FAQ de negativação indevida.

Devem preferencialmente apontar para o cornerstone quando ele existir:

- guia de passagens aéreas;
- spoke de compra online;
- case-note de reembolso e cobranças após cancelamento.

---

## 7. Checklist De Aderência

- [x] CAT-08 inserida como frente independente.
- [x] Vínculo 1:1 entre S2 e B2 preservado.
- [x] Sem CAT-09, categoria paralela ou absorção pela CAT-06.
- [x] Site mantém CTA institucional.
- [x] Blog mantém CTA editorial e devolução subordinada ao site.
- [x] Estado vazio editorial tratado como transição, não como tela final.
- [x] Massa editorial mínima definida sem transformar a categoria em portal jurídico.
