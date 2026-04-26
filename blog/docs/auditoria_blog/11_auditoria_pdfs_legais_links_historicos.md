# 11 - Auditoria dos PDFs legais: links históricos

Data da auditoria: 2026-04-26

Escopo: leitura, comparação e registro dos PDFs legais publicados no blog, sem edição de PDFs, sem alteração de rotas, sem alteração de CAT-08, sem alteração de registry, Decap, posts, robots, sitemap, RSS, canonical ou redirects, e sem `git add` ou commit.

## 1. Síntese executiva

A auditoria confirmou links históricos não canônicos dentro dos dois PDFs legais publicados no blog.

Achado central:

- `blog/public/legal/politica-de-privacidade-pavie-advocacia.pdf` contém 2 ocorrências de `https://pavieadvocacia.com.br/blog/`.
- `blog/public/legal/termos-de-servico-pavie-advocacia.pdf` contém 2 ocorrências de `https://pavieadvocacia.com.br/blog/`.
- As cópias geradas em `blog/dist/legal/` são idênticas por hash aos PDFs-fonte em `blog/public/legal/`, portanto repetem as mesmas ocorrências.
- Não há ocorrência de `https://blog.pavieadvocacia.com.br/blog/` nos PDFs analisados.

Contagem operacional:

- 4 ocorrências históricas nos PDFs-fonte de `public/legal`.
- 4 ocorrências históricas nas cópias geradas de `dist/legal`.
- 8 ocorrências físicas quando se contam fonte e dist, mas a origem provável do problema está nos 2 PDFs-fonte de `public/legal`.

## 2. Estado Git inicial

Comandos executados no início:

```text
git log -1 --oneline
aa84007 test: validar host canonico no qa do blog
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

```text
git ls-files --others --exclude-standard
<sem saída>
```

Estado inicial: árvore limpa, sem alterações locais, sem staged changes e sem arquivos não rastreados.

## 3. PDFs analisados

Foram analisados quatro arquivos:

1. `blog/public/legal/politica-de-privacidade-pavie-advocacia.pdf`
2. `blog/public/legal/termos-de-servico-pavie-advocacia.pdf`
3. `blog/dist/legal/politica-de-privacidade-pavie-advocacia.pdf`
4. `blog/dist/legal/termos-de-servico-pavie-advocacia.pdf`

Todos existem no repositório local no momento da auditoria.

## 4. PDFs-fonte em public/legal

Os arquivos em `blog/public/legal/` são os PDFs-fonte rastreados pelo Git:

```text
blog/public/legal/politica-de-privacidade-pavie-advocacia.pdf
blog/public/legal/termos-de-servico-pavie-advocacia.pdf
```

Resultado:

- ambos existem;
- ambos são arquivos PDF binários;
- ambos contêm 2 ocorrências do link histórico `https://pavieadvocacia.com.br/blog/`;
- nenhum contém `https://blog.pavieadvocacia.com.br/blog/`.

## 5. PDFs gerados em dist/legal

Os arquivos em `blog/dist/legal/` existem no build local, mas `blog/dist/` está ignorado por `.gitignore`:

```text
blog/.gitignore:2:dist/ blog/dist/legal/politica-de-privacidade-pavie-advocacia.pdf
blog/.gitignore:2:dist/ blog/dist/legal/termos-de-servico-pavie-advocacia.pdf
```

Resultado:

- ambos existem;
- ambos são cópias geradas no build;
- ambos são idênticos por hash aos PDFs correspondentes em `public/legal`;
- não devem ser editados diretamente.

## 6. Hashes e tamanhos

| PDF | Local | Tipo | SHA-256 | Tamanho |
|---|---|---|---|---:|
| `politica-de-privacidade-pavie-advocacia.pdf` | `public/legal` | fonte | `63ee5beab62af2feb6f57bbc8d24812e7aafd89603b8623618d85f3077f56a3c` | 266181 |
| `politica-de-privacidade-pavie-advocacia.pdf` | `dist/legal` | gerado | `63ee5beab62af2feb6f57bbc8d24812e7aafd89603b8623618d85f3077f56a3c` | 266181 |
| `termos-de-servico-pavie-advocacia.pdf` | `public/legal` | fonte | `17658d98d1b6d7a2b069c8652b93b9b3181ad3e383429a6dd1b70d392f1df8cf` | 225545 |
| `termos-de-servico-pavie-advocacia.pdf` | `dist/legal` | gerado | `17658d98d1b6d7a2b069c8652b93b9b3181ad3e383429a6dd1b70d392f1df8cf` | 225545 |

Comparação por hash:

- política de privacidade: `public/legal` e `dist/legal` são idênticos.
- termos de serviço: `public/legal` e `dist/legal` são idênticos.

## 7. URIs encontradas

### Política de privacidade

As mesmas URIs foram encontradas no PDF-fonte e na cópia de `dist/legal`:

| URI | Ocorrências por arquivo | Classificação |
|---|---:|---|
| `https://pavieadvocacia.com.br/` | 3 | link institucional legítimo |
| `https://pavieadvocacia.com.br/#contato` | 2 | link institucional legítimo |
| `https://pavieadvocacia.com.br/#honorarios` | 2 | link institucional legítimo |
| `https://pavieadvocacia.com.br/#servicos` | 2 | link institucional legítimo |
| `https://pavieadvocacia.com.br/blog/` | 2 | link histórico não canônico |
| `https://pavieadvocacia.com.br/privacidade/privacidade.html` | 2 | inconclusivo |
| `https://pavieadvocacia.com.br/termos/termos.html` | 3 | inconclusivo |
| `mailto:contato@pavieadvocacia.com.br` | 2 | link institucional legítimo |

### Termos de serviço

As mesmas URIs foram encontradas no PDF-fonte e na cópia de `dist/legal`:

| URI | Ocorrências por arquivo | Classificação |
|---|---:|---|
| `https://pavieadvocacia.com.br/` | 3 | link institucional legítimo |
| `https://pavieadvocacia.com.br/#contato` | 2 | link institucional legítimo |
| `https://pavieadvocacia.com.br/#honorarios` | 2 | link institucional legítimo |
| `https://pavieadvocacia.com.br/#servicos` | 2 | link institucional legítimo |
| `https://pavieadvocacia.com.br/blog/` | 2 | link histórico não canônico |
| `https://pavieadvocacia.com.br/privacidade/privacidade.html` | 5 | inconclusivo |
| `https://pavieadvocacia.com.br/termos/termos.html` | 2 | inconclusivo |

Observação: a classificação "inconclusivo" foi aplicada às URLs legais antigas em `.html` porque esta auditoria não validou o site institucional principal nem fonte externa aos PDFs. Elas devem ser revisadas junto com a futura correção dos PDFs, mas não são o achado principal desta etapa.

## 8. Links históricos identificados

Link histórico não canônico confirmado:

```text
https://pavieadvocacia.com.br/blog/
```

Ocorrências:

| PDF | `public/legal` | `dist/legal` | Total físico |
|---|---:|---:|---:|
| `politica-de-privacidade-pavie-advocacia.pdf` | 2 | 2 | 4 |
| `termos-de-servico-pavie-advocacia.pdf` | 2 | 2 | 4 |

Total:

- 4 ocorrências nos PDFs-fonte.
- 8 ocorrências físicas considerando fonte e dist.

Link de blog correto esperado:

```text
https://blog.pavieadvocacia.com.br/blog/
```

Ocorrências encontradas nos PDFs analisados: 0.

## 9. Origem provável do problema

A origem provável está nos PDFs-fonte em `blog/public/legal/`.

Evidências:

- os PDFs em `public/legal` contêm os links históricos;
- os PDFs em `dist/legal` têm o mesmo hash dos PDFs em `public/legal`;
- `blog/dist/` está ignorado e funciona como saída de build;
- não foi localizado script de geração de PDFs no `package.json` ou em `blog/scripts/`;
- não foi localizada fonte editável equivalente dentro do repositório.

Conclusão: o build apenas copia os PDFs estáticos de `public/legal` para `dist/legal`. A correção futura deve atuar sobre a fonte dos PDFs, não sobre `dist/legal`.

## 10. Fonte editável localizada ou não localizada

Não foi localizada fonte editável dos PDFs legais no repositório.

Busca realizada por:

- arquivos `.md`;
- arquivos `.docx`;
- arquivos `.html`;
- arquivos `.astro`;
- arquivos `.tsx`;
- scripts de geração;
- nomes semelhantes a política de privacidade, termos de serviço, privacy, terms e legal;
- referências exatas a `politica-de-privacidade-pavie-advocacia` e `termos-de-servico-pavie-advocacia`.

Achados relevantes:

- `blog/public/legal/politica-de-privacidade-pavie-advocacia.pdf`
- `blog/public/legal/termos-de-servico-pavie-advocacia.pdf`
- `blog/src/components/site/Footer.astro`, apenas como ponto de link para os PDFs publicados.
- documentos de análise que mencionam a existência dos PDFs, sem fonte editável correspondente.

Não foi localizado `.md`, `.docx`, `.html`, `.astro` ou `.tsx` que funcione como fonte editável dos PDFs legais.

## 11. Risco jurídico/editorial

Risco classificado como médio.

Motivos:

- os documentos são legais e sensíveis;
- o link de blog embutido aponta para o domínio institucional antigo `https://pavieadvocacia.com.br/blog/`, enquanto a arquitetura vigente do blog usa `https://blog.pavieadvocacia.com.br/blog/`;
- a inconsistência pode preservar dependência de redirecionamento ou rota histórica;
- por serem PDFs legais, a correção deve ser feita com revisão humana, preservação de versão e validação dos links internos antes de republicação.

Não há evidência, nesta auditoria, de alteração de conteúdo jurídico textual. O achado é de URI embutida em arquivo binário.

## 12. Recomendação de correção

Não corrigir diretamente nesta etapa.

Correção recomendada para etapa futura:

1. localizar a fonte original editável dos PDFs fora do repositório ou recriar uma fonte editável controlada;
2. submeter o conteúdo legal a revisão humana antes de republicar;
3. substituir `https://pavieadvocacia.com.br/blog/` por `https://blog.pavieadvocacia.com.br/blog/`, se a revisão confirmar esse destino;
4. decidir, na mesma revisão, se as URLs `.html` de privacidade e termos continuam válidas, devem virar PDFs atuais ou devem apontar para rotas institucionais canônicas;
5. gerar novos PDFs;
6. substituir somente os PDFs-fonte em `blog/public/legal/`;
7. executar build para regenerar `blog/dist/legal/`;
8. repetir a auditoria de hash, tamanho e URIs;
9. evitar edição direta de `blog/dist/legal/`.

## 13. Próximo prompt recomendado

```text
Você está em C:\dev\PAVIE-091025.

Com base na auditoria registrada em blog/docs/auditoria_blog/11_auditoria_pdfs_legais_links_historicos.md e na matriz blog/docs/auditoria_blog/11_matriz_pdfs_legais_links_historicos.csv, prepare a correção controlada dos PDFs legais.

Restrições:
1. Não editar dist/legal diretamente.
2. Não alterar CAT-08, registry, Decap, posts, robots, sitemap, RSS, canonical ou redirects.
3. Antes de substituir PDFs, localizar ou reconstruir fonte editável.
4. Tratar política de privacidade e termos como conteúdo sensível, sujeito a revisão humana.
5. Atualizar links históricos de blog apenas se confirmado o destino canônico https://blog.pavieadvocacia.com.br/blog/.
6. Verificar também as URLs legais antigas em .html e classificar se devem permanecer, ser redirecionadas ou ser substituídas por rotas/PDFs canônicos.
7. Depois de gerar PDFs novos, comparar hashes, tamanhos e URIs.
8. Não fazer git add nem commit sem autorização explícita.

Objetivo:
propor e executar, se aprovado, uma correção reversível e documentada dos PDFs-fonte em blog/public/legal/, seguida de build e nova auditoria.
```

## 14. Recomendação sobre commit

Não fazer commit nesta etapa.

Recomendação:

- manter apenas o relatório e a matriz como artefatos de auditoria;
- não stagear automaticamente;
- só commitar após revisão humana do achado e confirmação de que os arquivos de auditoria devem entrar no histórico;
- a correção dos PDFs deve ser um commit futuro e separado, depois de validação do conteúdo legal.
