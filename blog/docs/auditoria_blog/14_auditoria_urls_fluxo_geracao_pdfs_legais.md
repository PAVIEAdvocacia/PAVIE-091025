# 14 - Auditoria decisoria de URLs e fluxo de geracao dos PDFs legais

Data da auditoria: 2026-04-26

Escopo: auditoria read-only das URLs nas fontes editaveis dos PDFs legais, nos PDFs-fonte de `blog/public/legal/` e nas copias de `blog/dist/legal/`, com proposta de fluxo seguro de geracao futura. Nenhum arquivo existente foi alterado, nenhum PDF foi gerado, `dist/` nao foi editado, nao houve `git add` nem commit.

## 1. Sintese executiva

Foram mapeadas as URLs presentes nas fontes Markdown, nos PDFs atuais em `blog/public/legal/` e nas copias em `blog/dist/legal/`.

Conclusoes:

- O link historico `https://pavieadvocacia.com.br/blog/` ainda existe apenas nos PDFs atuais, nao nas fontes Markdown.
- As fontes Markdown ja usam o destino correto do blog: `https://blog.pavieadvocacia.com.br/blog/`.
- As URLs antigas `.html` de privacidade e termos existem como rotas reais no repositorio raiz institucional:
  - `privacidade/privacidade.html`
  - `termos/termos.html`
- O arquivo raiz `_redirects` aponta os atalhos `/privacidade` e `/termos` para essas rotas `.html`.
- Portanto, nesta etapa decisoria, a recomendacao tecnica e preservar as URLs `.html` nos PDFs futuros por continuidade juridica e por aderencia ao estado atual do site institucional, sem substitui-las automaticamente.

Recomendacao central: gerar PDFs futuros a partir das fontes Markdown somente depois de revisao humana, removendo frontmatter, aviso interno, registro tecnico e notas de auditoria do corpo publico.

## 2. Estado Git inicial

Comandos executados no inicio:

```text
git log -1 --oneline
691f155 docs: revisar fontes editaveis dos PDFs legais
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

Auditorias:

- `blog/docs/auditoria_blog/11_auditoria_pdfs_legais_links_historicos.md`
- `blog/docs/auditoria_blog/12_fontes_editaveis_pdfs_legais.md`
- `blog/docs/auditoria_blog/13_revisao_tecnica_fontes_pdfs_legais.md`

Fontes Markdown:

- `blog/docs/legal/politica-de-privacidade-pavie-advocacia.md`
- `blog/docs/legal/termos-de-servico-pavie-advocacia.md`

PDFs atuais:

- `blog/public/legal/politica-de-privacidade-pavie-advocacia.pdf`
- `blog/public/legal/termos-de-servico-pavie-advocacia.pdf`
- `blog/dist/legal/politica-de-privacidade-pavie-advocacia.pdf`
- `blog/dist/legal/termos-de-servico-pavie-advocacia.pdf`

Arquivos de rota/redirecionamento consultados:

- `_redirects`
- `blog/public/_redirects`
- `blog/dist/_redirects`
- `privacidade/privacidade.html`
- `termos/termos.html`

## 4. URLs mapeadas

### 4.1 Fontes Markdown

As fontes Markdown contem:

- dominio institucional principal e ancoras:
  - `https://pavieadvocacia.com.br/`
  - `https://pavieadvocacia.com.br/#servicos`
  - `https://pavieadvocacia.com.br/#honorarios`
  - `https://pavieadvocacia.com.br/#contato`
- dominio correto do blog:
  - `https://blog.pavieadvocacia.com.br/blog/`
- URLs legais `.html`:
  - `https://pavieadvocacia.com.br/privacidade/privacidade.html`
  - `https://pavieadvocacia.com.br/termos/termos.html`
- e-mail:
  - `mailto:contato@pavieadvocacia.com.br`
- URLs tecnicas extraidas do rodape de impressao do PDF e registradas apenas na secao tecnica:
  - `https://pavieadvocacia.com.br/privacidade/privacidade`
  - `https://pavieadvocacia.com.br/termos/termos`

### 4.2 PDFs em public/legal

Os PDFs-fonte em `public/legal` contem, em anotacoes `/URI`:

- dominio institucional principal e ancoras;
- URL historica de blog `https://pavieadvocacia.com.br/blog/`;
- URLs legais `.html`;
- `mailto:contato@pavieadvocacia.com.br` no PDF de politica.

Tambem contem, no texto extraido de cabecalho/rodape de impressao:

- `https://pavieadvocacia.com.br/privacidade/privacidade`
- `https://pavieadvocacia.com.br/termos/termos`

Essas URLs sem `.html` foram classificadas como URLs tecnicas internas de impressao, nao como links publicos a preservar no PDF final.

### 4.3 PDFs em dist/legal

As copias em `dist/legal` repetem o mesmo conjunto de URLs dos PDFs-fonte. Isso confirma novamente que `dist/legal` e saida de build e nao deve ser editado diretamente.

## 5. Classificacao decisoria das URLs

| URL | Classificacao | Decisao recomendada |
|---|---|---|
| `https://pavieadvocacia.com.br/` | dominio institucional legitimo | preservar |
| `https://pavieadvocacia.com.br/#servicos` | dominio institucional legitimo | preservar, salvo revisao futura do site institucional |
| `https://pavieadvocacia.com.br/#honorarios` | dominio institucional legitimo | preservar, salvo revisao futura do site institucional |
| `https://pavieadvocacia.com.br/#contato` | dominio institucional legitimo | preservar |
| `mailto:contato@pavieadvocacia.com.br` | dominio institucional legitimo | preservar |
| `https://blog.pavieadvocacia.com.br/blog/` | dominio do blog correto | usar nos PDFs futuros |
| `https://pavieadvocacia.com.br/blog/` | URL historica `/blog` | substituir pelo dominio correto do blog nos PDFs futuros |
| `https://pavieadvocacia.com.br/privacidade/privacidade.html` | URL historica `.html` | preservar por continuidade juridica no estado atual |
| `https://pavieadvocacia.com.br/termos/termos.html` | URL historica `.html` | preservar por continuidade juridica no estado atual |
| `https://pavieadvocacia.com.br/privacidade/privacidade` | URL tecnica interna | excluir do PDF publico final |
| `https://pavieadvocacia.com.br/termos/termos` | URL tecnica interna | excluir do PDF publico final |

## 6. Verificacao das URLs antigas `.html`

### 6.1 Existencia de rota equivalente

Foram encontrados arquivos reais no repositorio raiz:

```text
privacidade/privacidade.html
termos/termos.html
```

Esses arquivos sao rastreados pelo Git.

### 6.2 Redirects correspondentes

O arquivo raiz `_redirects` contem:

```text
/privacidade   /privacidade/privacidade.html   301
/termos        /termos/termos.html             301
```

Tambem contem a regra que redireciona o antigo `/blog` para o subdominio correto:

```text
/blog          https://blog.pavieadvocacia.com.br/blog/        301
/blog/         https://blog.pavieadvocacia.com.br/blog/        301
/blog/*        https://blog.pavieadvocacia.com.br/blog/:splat  301
```

### 6.3 Observacao sobre canonical interno

Os arquivos HTML legais consultados indicam canonical com `https://www.pavieadvocacia.com.br/...`, enquanto o `_redirects` raiz canonicaliza `www` para apex. Isso nao deve ser corrigido dentro desta sprint, mas e um ponto de revisao futura do site institucional.

### 6.4 Decisao recomendada

Preservar as URLs `.html` nos PDFs futuros nesta etapa.

Motivos:

1. as rotas existem no repositorio raiz;
2. os atalhos limpos `/privacidade` e `/termos` redirecionam para as URLs `.html`, nao o inverso;
3. os arquivos HTML legais parecem ser a superficie institucional atual de privacidade e termos;
4. mudar esses destinos dentro dos PDFs seria decisao juridica/editorial maior do que a correcao do link de blog;
5. a continuidade juridica favorece manter o destino legal publicado enquanto nao houver migracao formal.

## 7. Fluxo seguro de geracao futura dos PDFs

### 7.1 Partes do Markdown que devem entrar no PDF publico

Devem entrar:

- titulo do documento;
- data de ultima atualizacao;
- navegacao publica, se o layout final mantiver esse bloco;
- corpo juridico principal;
- links publicos revisados;
- rodape institucional, se aprovado;
- secoes legais propriamente ditas.

### 7.2 Partes que devem ser excluidas do PDF publico

Devem ser excluidas:

- frontmatter YAML;
- aviso de fonte editavel proposta;
- mencoes a auditoria;
- `Registro tecnico de extracao`;
- observacoes de qualidade;
- URLs tecnicas de impressao sem `.html`;
- qualquer nota interna usada apenas para rastreabilidade.

### 7.3 HTML intermediario

Recomendacao: usar HTML intermediario antes do PDF.

Motivos:

- facilita template claro para documento legal;
- permite excluir blocos internos de forma deterministica;
- permite inspecao visual antes do PDF;
- permite validar links no HTML antes de imprimir;
- reduz risco de publicar metadados de auditoria.

Fluxo sugerido:

1. ler a fonte Markdown;
2. separar frontmatter;
3. renderizar apenas o conteudo publico aprovado;
4. remover os blocos internos por delimitacao estrutural;
5. aplicar template legal sobrio;
6. gerar HTML temporario em pasta de artefatos ou staging controlado;
7. validar links do HTML;
8. somente em sprint posterior, gerar PDF a partir desse HTML.

### 7.4 Validacao de links no PDF final

Validar:

- contagem de `/URI` no PDF final;
- ausencia de `https://pavieadvocacia.com.br/blog/`;
- presenca de `https://blog.pavieadvocacia.com.br/blog/`;
- presenca ou ausencia deliberada das URLs `.html`, conforme decisao humana;
- ausencia de URLs tecnicas de impressao sem `.html`;
- ausencia de links para arquivos locais;
- funcionamento dos links internos principais por auditoria automatizada e revisao humana.

### 7.5 Comparacao do novo PDF com a fonte Markdown

Comparar:

- titulos;
- data de atualizacao;
- secoes e ordem;
- texto juridico principal;
- links e quantidades;
- rodape;
- tamanho e hash;
- render visual pagina a pagina;
- diferencas em acentuacao, espacos e quebras.

### 7.6 Rastreabilidade

Preservar:

- hash dos PDFs antigos antes da substituicao;
- hash dos PDFs novos;
- commit das fontes Markdown;
- commit do mecanismo de geracao, se houver;
- relatorio de geracao;
- matriz de URLs pos-geracao;
- decisao humana sobre URLs `.html`;
- resultado de revisao juridica/editorial.

## 8. Riscos residuais

Riscos que permanecem:

- os PDFs publicados ainda contem o link historico `/blog`;
- as fontes Markdown ainda nao foram aprovadas por revisao humana;
- as URLs `.html` sao validas no estado atual local, mas a politica de canonical do site institucional tem uma tensao entre `www` nos HTMLs e apex no `_redirects`;
- uma geracao direta sem filtro publicaria frontmatter e registros tecnicos;
- `dist/legal` continuara refletindo os PDFs de `public/legal` ate nova build apos substituicao futura.

## 9. Recomendacao final

Para a proxima etapa, nao substituir as URLs `.html` nos PDFs legais. Preservar essas URLs por continuidade juridica e por existirem como rotas institucionais atuais.

Corrigir apenas a URL historica de blog nos PDFs futuros, usando:

```text
https://blog.pavieadvocacia.com.br/blog/
```

Antes de gerar qualquer PDF publico, aprovar:

1. conteudo juridico das fontes;
2. permanencia das URLs `.html`;
3. exclusao dos blocos internos;
4. template HTML intermediario;
5. protocolo de validacao pos-geracao.

## 10. Proximo prompt recomendado

```text
Voce esta em C:\dev\PAVIE-091025.

Com base na auditoria 14:
blog/docs/auditoria_blog/14_auditoria_urls_fluxo_geracao_pdfs_legais.md

prepare uma proposta tecnica de gerador controlado para PDFs legais, sem executar a geracao ainda.

Restricoes:
1. Nao gerar PDFs.
2. Nao substituir PDFs.
3. Nao editar dist/.
4. Nao alterar conteudo juridico.
5. Nao alterar CAT-08, Decap, registry, posts, robots, sitemap, RSS, canonical ou redirects.
6. O gerador deve excluir frontmatter, aviso interno, registro tecnico e notas de auditoria.
7. O gerador deve preservar as URLs .html por enquanto e trocar apenas o link historico de blog ja corrigido nas fontes.
8. Nao fazer git add nem commit sem autorizacao explicita.
```

## 11. Recomendacao sobre commit

Nao fazer commit automaticamente.

Se aprovado, commitar apenas este relatorio 14 e a matriz 14 em commit documental separado.
