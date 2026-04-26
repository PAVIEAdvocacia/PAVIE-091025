# 13 - Revisao tecnica das fontes editaveis dos PDFs legais

Data da revisao: 2026-04-26

Escopo: revisao tecnica das fontes Markdown propostas em `blog/docs/legal/`, comparadas aos PDFs-fonte em `blog/public/legal/`, sem alterar PDFs, sem gerar PDFs, sem editar `dist/`, sem alterar conteudo juridico, sem `git add` e sem commit.

## 1. Sintese executiva

Foram revisadas as duas fontes editaveis criadas na sprint 12:

- `blog/docs/legal/politica-de-privacidade-pavie-advocacia.md`
- `blog/docs/legal/termos-de-servico-pavie-advocacia.md`

Conclusao tecnica:

- as duas fontes preservam titulo, ordem e secoes principais dos PDFs;
- as duas fontes corrigem o link historico do blog apenas no Markdown, usando `https://blog.pavieadvocacia.com.br/blog/`;
- nao foi encontrada lacuna textual material nas secoes juridicas durante a comparacao tecnica;
- as duas fontes estao prontas para revisao humana, mas nao devem ser usadas para geracao direta de PDF sem decisao formal sobre metadados, notas tecnicas e URLs antigas `.html`;
- os PDFs originais permanecem inalterados.

Classificacao:

| Documento | Classificacao |
|---|---|
| Politica de Privacidade | pronta para revisao humana |
| Termos de Servico | pronta para revisao humana |

## 2. Estado Git inicial

Comandos executados no inicio:

```text
git log -1 --oneline
ee177d3 docs: criar fontes editaveis dos PDFs legais
```

```text
git status -sb
## main...origin/main
```

```text
git diff --stat
<sem saida>
```

```text
git diff --cached --stat
<sem saida>
```

Estado inicial: arvore limpa, sem alteracoes locais e sem staged changes.

## 3. Arquivos lidos

Auditorias e matriz base:

- `blog/docs/auditoria_blog/11_auditoria_pdfs_legais_links_historicos.md`
- `blog/docs/auditoria_blog/12_fontes_editaveis_pdfs_legais.md`
- `blog/docs/auditoria_blog/12_matriz_fontes_editaveis_pdfs_legais.csv`

Fontes Markdown:

- `blog/docs/legal/politica-de-privacidade-pavie-advocacia.md`
- `blog/docs/legal/termos-de-servico-pavie-advocacia.md`

PDFs-fonte:

- `blog/public/legal/politica-de-privacidade-pavie-advocacia.pdf`
- `blog/public/legal/termos-de-servico-pavie-advocacia.pdf`

## 4. Metodo de comparacao

Foi feita comparacao tecnica read-only por:

1. leitura das auditorias 11 e 12;
2. leitura integral das duas fontes Markdown;
3. extracao de texto dos PDFs com `pypdf`, sem OCR;
4. leitura das anotacoes `/URI` dos PDFs;
5. comparacao de titulos, secoes, ordem, links, URLs antigas `.html`, lacunas textuais e problemas de espacamento.

Nenhum PDF foi editado, sobrescrito, movido ou regenerado.

## 5. Politica de Privacidade

### 5.1 Titulo, secoes e ordem

Resultado: aprovado tecnicamente para revisao humana.

O PDF possui 2 paginas e as seguintes secoes foram preservadas na fonte Markdown:

1. `1. Controladora dos dados`
2. `2. Finalidades e bases legais`
3. `3. Dados coletados`
4. `4. Cookies e metricas`
5. `5. Retencao e descarte`
6. `6. Compartilhamento`
7. `7. Direitos do titular`
8. `8. Seguranca da informacao`
9. `9. Links externos`
10. `10. Atualizacoes`

A ordem das secoes no Markdown corresponde a ordem extraida do PDF.

### 5.2 Conteudo textual

Nao foi identificada lacuna material nas secoes juridicas durante a revisao tecnica.

Foram confirmados no Markdown os blocos centrais do PDF:

- identificacao da controladora;
- endereco e e-mail;
- tabela de finalidades e bases legais;
- dados coletados;
- cookies e metricas;
- retencao e descarte;
- compartilhamento;
- direitos do titular;
- seguranca da informacao;
- links externos;
- atualizacoes.

### 5.3 Espacamento e normalizacao

A fonte Markdown recompõe espacos que a extracao do PDF havia mesclado. Exemplos do problema original de extracao:

- `Dadossao`;
- `deseguranca`;
- `paracontato`.

Essa normalizacao e tecnicamente adequada para revisao humana, mas deve ser conferida pelo responsavel juridico antes de gerar novo PDF.

### 5.4 Links

Resultado de links:

- link antigo do blog no Markdown: 0 ocorrencias;
- link novo do blog no Markdown: 2 ocorrencias;
- URLs `.html` preservadas:
  - `https://pavieadvocacia.com.br/privacidade/privacidade.html` com 2 ocorrencias;
  - `https://pavieadvocacia.com.br/termos/termos.html` com 3 ocorrencias.

Risco: medio para as URLs `.html`, porque a auditoria 11 classificou esses destinos como inconclusivos. Nao devem ser corrigidos automaticamente sem decisao canonica.

### 5.5 Observacoes formais

A fonte contem frontmatter, aviso de fonte editavel proposta e secao `Registro tecnico de extracao`. Esses blocos sao uteis para auditoria, mas nao devem ser renderizados no PDF publico final sem decisao expressa.

## 6. Termos de Servico

### 6.1 Titulo, secoes e ordem

Resultado: aprovado tecnicamente para revisao humana.

O PDF possui 1 pagina e as seguintes secoes foram preservadas na fonte Markdown:

1. `1. Objeto`
2. `2. Natureza informativa`
3. `3. Etica profissional (OAB)`
4. `4. Uso do site`
5. `5. Direitos autorais`
6. `6. Isencoes`
7. `7. Formularios e comunicacoes`
8. `8. Cookies`
9. `9. Legislacao e foro`

A ordem das secoes no Markdown corresponde a ordem extraida do PDF.

### 6.2 Conteudo textual

Nao foi identificada lacuna material nas secoes juridicas durante a revisao tecnica.

Foram confirmados no Markdown os blocos centrais do PDF:

- objeto;
- natureza informativa;
- etica profissional;
- uso do site;
- direitos autorais;
- isencoes;
- formularios e comunicacoes;
- cookies;
- legislacao e foro.

### 6.3 Espacamento e normalizacao

A fonte Markdown recompõe espacos que a extracao do PDF havia mesclado. Exemplos do problema original de extracao:

- `advocaciaPAVIE`;
- `exigeanalise`;
- `Reproducao integral` extraido como trecho mesclado;
- `envio demensagens`.

Essa normalizacao e tecnicamente adequada para revisao humana, mas deve ser conferida antes de gerar novo PDF.

### 6.4 Links

Resultado de links:

- link antigo do blog no Markdown: 0 ocorrencias;
- link novo do blog no Markdown: 2 ocorrencias;
- URLs `.html` preservadas:
  - `https://pavieadvocacia.com.br/privacidade/privacidade.html` com 4 ocorrencias logicas no Markdown;
  - `https://pavieadvocacia.com.br/termos/termos.html` com 2 ocorrencias.

Observacao: o PDF tinha 5 anotacoes fisicas para `privacidade.html`, enquanto o Markdown tem 4 links logicos. A diferenca parece decorrer de divisao fisica de anotacao/link no PDF, nao de lacuna textual material. Ainda assim, deve ser validada visualmente antes de geracao final.

### 6.5 Observacoes formais

A fonte contem frontmatter, aviso de fonte editavel proposta e secao `Registro tecnico de extracao`. Esses blocos sao uteis para auditoria, mas nao devem ser renderizados no PDF publico final sem decisao expressa.

## 7. URLs antigas `.html`

As fontes preservam URLs legais antigas:

```text
https://pavieadvocacia.com.br/privacidade/privacidade.html
https://pavieadvocacia.com.br/termos/termos.html
```

Classificacao tecnica: inconclusivas.

Risco: medio.

Motivo: esta revisao nao validou o site institucional principal nem confirmou se esses destinos continuam canonicos. A decisao deve ser tomada antes de gerar novos PDFs.

Recomendacao:

1. decidir se as URLs `.html` devem ser mantidas;
2. se nao forem canonicas, definir destino correto;
3. aplicar mudanca somente apos revisao humana;
4. registrar a decisao em nova auditoria ou no relatorio de geracao dos PDFs.

## 8. Lacunas e trechos duvidosos

Nao foram encontradas lacunas textuais materiais nas secoes juridicas principais.

Lacunas residuais:

- inexistencia da fonte autoral original fora do PDF;
- impossibilidade de garantir, apenas por extracao textual, que layout, pesos tipograficos e quebras futuras reproduzirao o PDF publicado;
- necessidade de revisao humana das normalizacoes de espacamento;
- necessidade de decidir se notas tecnicas e frontmatter ficam fora do PDF final.

## 9. Riscos juridicos/editoriais

Riscos principais:

- conteudo legal sensivel exige revisao humana antes de publicacao;
- fontes Markdown nao devem ser confundidas com versao juridicamente aprovada;
- URLs `.html` antigas ainda nao foram decididas;
- os PDFs publicados ainda contem o link historico do blog;
- geracao direta das fontes, sem filtro, poderia publicar metadados e notas tecnicas internas.

## 10. Recomendacao para geracao futura dos PDFs

Nao gerar PDFs ainda.

Antes da geracao, recomenda-se:

1. revisao humana das duas fontes;
2. decisao canonica sobre URLs `.html`;
3. definicao de quais blocos da fonte entram no PDF publico;
4. criacao de um fluxo de geracao que exclua frontmatter, avisos internos e `Registro tecnico de extracao`, salvo decisao expressa em contrario;
5. geracao controlada dos PDFs em etapa separada;
6. comparacao visual, textual, hash, tamanho e URIs;
7. substituicao de `blog/public/legal/` apenas apos aprovacao;
8. build para atualizar `blog/dist/legal/`.

## 11. Proximo prompt recomendado

```text
Voce esta em C:\dev\PAVIE-091025.

Com base na revisao tecnica registrada em:
blog/docs/auditoria_blog/13_revisao_tecnica_fontes_pdfs_legais.md

e na matriz:
blog/docs/auditoria_blog/13_matriz_revisao_fontes_pdfs_legais.csv

prepare uma proposta de fluxo de geracao dos PDFs legais a partir das fontes Markdown em blog/docs/legal, sem gerar ou substituir PDFs ainda.

Restricoes:
1. Nao editar PDFs.
2. Nao editar dist/.
3. Nao alterar CAT-08, Decap, registry, posts, robots, sitemap, RSS, canonical ou redirects.
4. Nao alterar conteudo juridico sem marcar como sugestao para revisao humana.
5. Definir como excluir frontmatter, avisos internos e Registro tecnico de extracao do PDF publico.
6. Classificar as URLs .html como manter, substituir ou decidir com revisao humana.
7. Nao fazer git add nem commit sem autorizacao explicita.
```

## 12. Recomendacao sobre commit

Nao fazer commit automaticamente.

Como esta etapa cria apenas relatorio e matriz de revisao tecnica, a recomendacao e revisar os achados e, se aprovados, commitar os arquivos 13 em commit documental separado.
