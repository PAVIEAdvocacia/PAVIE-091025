---
title: "Sprint Teste - Variantes Condicionadas e Reversiveis"
date: "2026-04-20"
status: "ativo para avaliacao controlada"
branch: "codex/sprint-testes-condicionados"
base_estavel:
  - "Sprint 0 reconciliada"
  - "Sprint 1A estabilizada"
  - "Sprint 1B estabilizada"
---

# Sprint Teste - Variantes condicionadas e reversiveis

## 1. Regra desta sprint

Esta sprint nao altera a base aprovada por padrao.

- Base estavel: estado sem parametro `exp` e sem experimentos persistidos.
- Estado de teste: variante ativada explicitamente por `?exp=...`.
- Rollback imediato: `?exp=off`, `?exp=clear`, `?exp=base` ou limpeza de `window.PAVIE_EXPERIMENTS.clear()`.

O objetivo e testar hipotese de acabamento e hierarquia sem reabrir:

- funcao dominante;
- CTA principal;
- arquitetura;
- papel do host;
- separacao site -> blog.

## 2. Como ativar

- Sem experimento: navegar normalmente.
- Um experimento: `?exp=s1-hero-quiet`
- Combinado: `?exp=b3-cta-tonal-band,b3-author-compact,r1-footer-accent-soft`
- Limpeza de estado persistido: `?exp=off`

Observacao operacional:

- Site e blog podem persistir o estado por host via `localStorage`.
- A branch `codex/sprint-testes-condicionados` isola o pacote experimental da base estavel.

## 3. Lista de variantes experimentais

### `s1-hero-quiet`

- Superficie: `S1`
- Hipotese: um hero institucional mais silencioso reduz inflacao verbal e ruido visual sem perder recorte nem CTA principal.
- Ganho buscado: mais sobriedade na dobra inicial e leitura institucional mais limpa.
- Risco: amortecer demais a abertura e reduzir percepcao de autoridade.
- Condicao de permanencia: manter clareza de recorte, CTA principal intacto e ponte editorial visivel.
- Condicao de rollback: qualquer perda de nitidez institucional ou enfraquecimento da abertura.
- Diff do experimento:
  - `C:\\dev\\PAVIE-091025\\blog\\src\\pages\\index.astro`
  - `C:\\dev\\PAVIE-091025\\blog\\src\\styles\\site-home.css`
  - `C:\\dev\\PAVIE-091025\\index.html`

### `s3-form-reduced`

- Superficie: `S3`
- Hipotese: ocultar campos opcionais no primeiro passo reduz friccao sem eliminar o contexto minimo de triagem.
- Ganho buscado: menor densidade e entrada institucional mais rapida.
- Risco: triagem inicial perder sinal auxiliar util em alguns casos.
- Condicao de permanencia: nome, e-mail, resumo, consentimento e expectativa correta continuam suficientes para leitura inicial.
- Condicao de rollback: queda de inteligibilidade, retorno com falta de contexto ou necessidade recorrente dos campos opcionais.
- Diff do experimento:
  - `C:\\dev\\PAVIE-091025\\blog\\src\\pages\\contato\\index.astro`
  - `C:\\dev\\PAVIE-091025\\blog\\src\\styles\\contact-page.css`
  - `C:\\dev\\PAVIE-091025\\contato\\index.html`

### `b3-cta-tonal-band`

- Superficie: `B3`
- Hipotese: uma faixa tonal mais discreta no CTA final melhora a hierarquia do fechamento sem competir com o rodape.
- Ganho buscado: encerramento mais organizado e menos bloco pesado.
- Risco: o CTA perder destaque demais na saida do artigo.
- Condicao de permanencia: o CTA continua sendo o proximo passo dominante do fechamento editorial.
- Condicao de rollback: queda de visibilidade do CTA final ou leitura de bloco ornamental.
- Diff do experimento:
  - `C:\\dev\\PAVIE-091025\\blog\\src\\components\\blog\\ArticleFooterCTA.astro`
  - `C:\\dev\\PAVIE-091025\\blog\\src\\styles\\reading.css`

### `b3-author-compact`

- Superficie: `B3`
- Hipotese: um cartao de autor mais compacto preserva autoria e reduz cauda visual no fechamento do artigo.
- Ganho buscado: melhor ritmo entre corpo, autoria e CTA final.
- Risco: autoria ficar discreta demais.
- Condicao de permanencia: autoria continua nitida, identificavel e coerente com a pagina do autor.
- Condicao de rollback: queda de visibilidade ou perda de assinatura editorial.
- Diff do experimento:
  - `C:\\dev\\PAVIE-091025\\blog\\src\\components\\blog\\AuthorBox.astro`
  - `C:\\dev\\PAVIE-091025\\blog\\src\\styles\\reading.css`

### `r1-footer-accent-soft`

- Superficie: `R1`
- Hipotese: enfase cromatica mais contida no rodape aumenta refinamento sem criar novo CTA ou nova hierarquia.
- Ganho buscado: acabamento mais sofisticado e menos contraste competitivo.
- Risco: rodape perder ancoragem visual em relacao ao resto do ecossistema.
- Condicao de permanencia: assinatura institucional continua clara e a navegacao final permanece legivel.
- Condicao de rollback: perda de contraste, legibilidade ou enfraquecimento do fechamento global.
- Diff do experimento:
  - `C:\\dev\\PAVIE-091025\\blog\\src\\components\\site\\Footer.astro`
  - `C:\\dev\\PAVIE-091025\\index.html`
  - `C:\\dev\\PAVIE-091025\\contato\\index.html`

## 4. Base versus teste

- Base aprovada:
  - nenhuma classe `exp-*` ativa
  - `data-pavie-experiments="base"`
  - superficies seguem exatamente a versao estavel
- Teste:
  - classes `exp-*` aplicadas no `html` e no `body`
  - elementos testaveis recebem `data-experiment-state="test"`
  - rollback e apenas remocao da flag, sem reversao estrutural manual

## 5. Arquivos de controle da sprint

- `C:\\dev\\PAVIE-091025\\blog\\public\\assets\\js\\pavie-experiments.js`
- `C:\\dev\\PAVIE-091025\\assets\\js\\pavie-experiments.js`
- `C:\\dev\\PAVIE-091025\\blog\\src\\layouts\\BaseLayout.astro`

Esses arquivos centralizam a ativacao e garantem que a base continue padrao na ausencia de parametro experimental.

## 6. Validacao operacional desta sprint

- `npm run check`: passou
- `npm run build`: passou
- `npm run qa:blog`: permanece desalinhado com a baseline anterior da B3 e continua sinalizando a cauda editorial do artigo como se fosse regressao estrutural. Esse ponto nao foi aberto nem resolvido nesta sprint de testes condicionados.
