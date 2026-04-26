# 12 - Fontes editáveis propostas para PDFs legais

Data da sprint: 2026-04-26

Escopo: criação de fontes editáveis auditáveis para os PDFs legais publicados no blog, sem substituir PDFs, sem gerar PDF, sem editar `dist/`, sem alterar conteúdo jurídico por iniciativa própria, sem `git add` e sem commit.

## 1. Síntese executiva

Foram criadas fontes editáveis propostas em Markdown para os dois PDFs legais:

- `blog/docs/legal/politica-de-privacidade-pavie-advocacia.md`
- `blog/docs/legal/termos-de-servico-pavie-advocacia.md`

As fontes foram derivadas por extração textual sem OCR usando `pypdf`. O texto principal foi preservado em ordem, com normalização conservadora de espaços e quebras quando a extração do PDF mesclou palavras. Não houve substituição dos PDFs vigentes em `blog/public/legal/` nem edição de `blog/dist/`.

Intervenção deliberada nesta etapa: nas fontes editáveis propostas, o link de Blog foi atualizado de:

```text
https://pavieadvocacia.com.br/blog/
```

para:

```text
https://blog.pavieadvocacia.com.br/blog/
```

Essa alteração foi feita apenas nos arquivos `.md` criados nesta sprint.

## 2. Estado Git inicial

Comandos executados no início:

```text
git log -1 --oneline
bfcf911 docs: auditar links historicos nos PDFs legais
```

```text
git status -sb
## main...origin/main
```

```text
git diff --stat
<sem saída>
```

```text
git diff --cached --stat
<sem saída>
```

Estado inicial: árvore limpa, sem alterações locais e sem staged changes.

## 3. Auditoria 11 usada como base

Arquivos lidos:

- `blog/docs/auditoria_blog/11_auditoria_pdfs_legais_links_historicos.md`
- `blog/docs/auditoria_blog/11_matriz_pdfs_legais_links_historicos.csv`

Resumo herdado da auditoria 11:

- os PDFs-fonte em `blog/public/legal/` continham 2 ocorrências cada de `https://pavieadvocacia.com.br/blog/`;
- os PDFs de `blog/dist/legal/` eram cópias idênticas por hash;
- não havia fonte editável correspondente no repositório;
- `dist/legal` não deveria ser editado diretamente.

## 4. PDFs de origem

| Documento | PDF origem | SHA-256 |
|---|---|---|
| Política de Privacidade | `blog/public/legal/politica-de-privacidade-pavie-advocacia.pdf` | `63ee5beab62af2feb6f57bbc8d24812e7aafd89603b8623618d85f3077f56a3c` |
| Termos de Serviço | `blog/public/legal/termos-de-servico-pavie-advocacia.pdf` | `17658d98d1b6d7a2b069c8652b93b9b3181ad3e383429a6dd1b70d392f1df8cf` |

Os hashes acima foram usados como referência de preservação dos PDFs.

## 5. Método de extração textual

Método utilizado:

- biblioteca: `pypdf`;
- OCR: não utilizado;
- arquivos lidos: apenas os PDFs-fonte em `blog/public/legal/`;
- saída: fontes Markdown propostas em `blog/docs/legal/`.

Resultado da extração:

| Documento | Páginas | Qualidade |
|---|---:|---|
| Política de Privacidade | 2 | extração textual utilizável, com mesclagem pontual de espaços |
| Termos de Serviço | 1 | extração textual utilizável, com mesclagem pontual de espaços |

Observação técnica: as URIs dos links estavam principalmente em anotações de link do PDF, não no texto extraído. Por isso, as fontes Markdown reconstruíram os links como links Markdown, preservando os destinos existentes e atualizando apenas o destino histórico do Blog.

## 6. Fontes editáveis criadas

### Política de Privacidade

Fonte criada:

```text
blog/docs/legal/politica-de-privacidade-pavie-advocacia.md
```

Conteúdo preservado:

- título;
- data de última atualização;
- navegação;
- seções 1 a 10;
- contato por e-mail;
- link para Termos de Serviço;
- rodapé institucional.

Normalização aplicada:

- separação de título e data;
- recomposição de espaços mesclados pela extração, como `Dadossão`, `desegurança` e `paracontato`;
- estruturação da tabela de finalidades e bases legais;
- preservação dos links como links Markdown.

### Termos de Serviço

Fonte criada:

```text
blog/docs/legal/termos-de-servico-pavie-advocacia.md
```

Conteúdo preservado:

- título;
- data de última atualização;
- navegação;
- seções 1 a 9;
- referência à Política de Privacidade;
- rodapé institucional.

Normalização aplicada:

- separação de título e data;
- recomposição de espaços mesclados pela extração, como `advocaciaPAVIE`, `exigeanálise`, `Reproduçãointegral` e `envio demensagens`;
- preservação dos links como links Markdown.

## 7. Links corrigidos nas fontes

Correção aplicada somente nas fontes editáveis propostas:

| Documento | Ocorrências esperadas do link novo na fonte |
|---|---:|
| Política de Privacidade | 2 |
| Termos de Serviço | 2 |

Link novo:

```text
https://blog.pavieadvocacia.com.br/blog/
```

Os PDFs originais continuam com o link histórico, pois não foram alterados nesta etapa.

## 8. PDFs preservados

Nenhum PDF foi alterado, substituído, movido ou apagado.

Preservados:

- `blog/public/legal/politica-de-privacidade-pavie-advocacia.pdf`
- `blog/public/legal/termos-de-servico-pavie-advocacia.pdf`
- `blog/dist/legal/politica-de-privacidade-pavie-advocacia.pdf`
- `blog/dist/legal/termos-de-servico-pavie-advocacia.pdf`

## 9. `dist/` preservado

Nenhuma alteração foi feita em `blog/dist/`.

`blog/dist/legal/` permanece apenas como cópia gerada, fora do escopo de edição direta.

## 10. Risco jurídico/editorial

Risco residual: médio.

Motivos:

- política de privacidade e termos são documentos legais sensíveis;
- a fonte Markdown foi criada por extração de PDF, não a partir do arquivo autoral original;
- houve normalização conservadora de espaços e quebras para recuperar leitura, mas a revisão humana ainda é obrigatória;
- as URLs antigas `.html` de privacidade e termos foram preservadas e ainda precisam de decisão canônica posterior;
- os PDFs publicados ainda não foram substituídos e continuam contendo o link histórico.

## 11. Recomendação de correção futura

Não substituir os PDFs ainda.

Próxima etapa recomendada:

1. revisão humana integral das fontes Markdown;
2. decisão sobre manter ou substituir as URLs legais antigas em `.html`;
3. definição de mecanismo de geração de PDF a partir das fontes Markdown;
4. geração controlada de novos PDFs;
5. comparação visual e textual com os PDFs atuais;
6. substituição apenas dos PDFs-fonte em `blog/public/legal/`, se aprovada;
7. build para regenerar `blog/dist/legal/`;
8. nova auditoria de hashes, tamanhos e URIs.

## 12. Próximo prompt recomendado

```text
Você está em C:\dev\PAVIE-091025.

Com base nas fontes editáveis criadas em:
1. blog/docs/legal/politica-de-privacidade-pavie-advocacia.md
2. blog/docs/legal/termos-de-servico-pavie-advocacia.md

e no relatório:
blog/docs/auditoria_blog/12_fontes_editaveis_pdfs_legais.md

faça uma revisão técnica controlada das fontes legais antes de gerar novos PDFs.

Restrições:
1. Não alterar PDFs ainda.
2. Não editar dist/.
3. Não alterar CAT-08, Decap, registry, posts, robots, sitemap, RSS, canonical ou redirects.
4. Não alterar conteúdo jurídico sem marcar explicitamente como sugestão para revisão humana.
5. Validar se os links de Blog nas fontes apontam para https://blog.pavieadvocacia.com.br/blog/.
6. Classificar as URLs legais antigas em .html como manter, corrigir ou decidir com revisão humana.
7. Preparar, mas não executar sem autorização, o fluxo de geração dos PDFs.
8. Não fazer git add nem commit sem autorização explícita.
```

## 13. Recomendação sobre commit

Não fazer commit nesta etapa sem autorização explícita.

Os arquivos criados devem ser revisados antes de stage/commit por conterem fontes propostas de documentos legais sensíveis.
