# Rodada final curta de conformidade publica — PAVIE

## Escopo

Rodada restrita a pendencias residuais de conformidade publica e UX, sem reabrir arquitetura, taxonomia, hosts, rotas, anatomia das S2, vinculo area-categoria ou homologacao estrutural da CAT-08.

## 1. Vazio editorial B1/B2

- Fato atual: `src/content/blog` permanece sem posts publicados; B1, indice B2 e B2 individual exibem categorias canonicas e textos de acervo em preparacao.
- Classificacao: ok, com ajuste aplicado.
- Arquivos/rotas: `/blog/`, `/blog/categoria/`, `/blog/categoria/[category]/`, `src/components/blog/BlogGrid.astro`.
- Correcao minima aplicada: removido framing de contato como acao principal em B1/indice B2; B2 individual passa a nomear explicitamente o estado como "acervo em preparacao" quando nao houver posts.

## 2. Governanca publica e juridica

- Fato atual: politica de privacidade e termos oficiais estao publicados em `public/legal/` e linkados no rodape global.
- Classificacao: ok, com pendencia documental.
- Arquivos/rotas: `src/components/site/Footer.astro`, `/legal/politica-de-privacidade-pavie-advocacia.pdf`, `/legal/termos-de-servico-pavie-advocacia.pdf`.
- Correcao minima proposta: nenhuma adicional nesta rodada.
- Pendencia documental: politica de cookies/consentimento ainda depende de camada futura especifica; nao foi inventada nem publicada sem documento proprio.

## 3. Disciplina funcional do blog

- Fato atual: B3 mantem breadcrumbs, corpo, relacionados, autor e CTA final unico; a captura lateral comercial foi removida em rodada anterior.
- Classificacao: ok, com ajuste aplicado.
- Arquivos/rotas: `/blog/`, `/blog/categoria/`, `/blog/categoria/[category]/`, `/blog/contato/`, `src/layouts/ReadingLayout.astro`, `src/components/blog/ReadingSidebar.astro`.
- Correcao minima aplicada: B1 e indice B2 passaram a privilegiar "Ver areas no site institucional" e continuidade editorial; `/blog/contato/` foi mantida como rota existente, mas marcada com `noIndex` e rotulada como ponte para o contato da home, nao como segunda sede comercial.

## 4. Rodape e marca

- Fato atual: o rodape global usa `BrandLogo variant="square" theme="dark"` com o ativo oficial quadrado claro.
- Classificacao: ok, excecao deliberada de projeto.
- Arquivo/rota: `src/components/site/Footer.astro`.
- Justificativa funcional: a base escura da pagina pede uma assinatura compacta e institucional; o logo quadrado oficial melhora proporcao e leitura no rodape sem competir com o logo horizontal usado no header e nas superficies largas.
- Correcao minima proposta: nenhuma adicional nesta rodada.

## 5. Changelog

### Vazio editorial

- Ajustado CTA de B2 individual para "Ver acervo em preparacao" quando a categoria nao possui posts.
- Ajustado texto vazio do grid para evitar leitura de falha publica.

### Conformidade publica

- Confirmados links oficiais de privacidade e termos no rodape.
- Registrada pendencia futura de cookies/consentimento sem criar conformidade ficticia.

### Disciplina de CTA

- B1 deixou de usar contato como CTA secundario da hero.
- B1 deixou de usar contato como CTA principal no bloco final editorial.
- Indice B2 deixou de usar contato como CTA principal da hero.
- `/blog/contato/` recebeu `noIndex` e labels mais precisos de retorno a home.

### Rodape / marca

- Mantido logo quadrado oficial no rodape como excecao deliberada e documentada.

## 6. Fechamento executivo

GO tecnico final para esta rodada curta. HOLD residual apenas para a futura camada de cookies/consentimento e para protecoes externas de `/admin`, ambas fora do escopo desta rodada.
