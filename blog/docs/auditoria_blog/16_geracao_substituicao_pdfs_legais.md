# 16. Geração e substituição dos PDFs legais

Data da sprint: 2026-04-26

Escopo: geração de novos PDFs legais a partir dos HTMLs intermediários aprovados, substituição apenas dos PDFs-fonte em `blog/public/legal/`, build para atualização de `blog/dist/legal/` e auditoria das URIs dos PDFs novos. Não houve `git add` nem commit.

## 1. Síntese executiva

Foram gerados novos PDFs legais a partir dos HTMLs intermediários aprovados:

- `blog/docs/legal/build/politica-de-privacidade-pavie-advocacia.preview.html`
- `blog/docs/legal/build/termos-de-servico-pavie-advocacia.preview.html`

Os PDFs novos foram gerados em área temporária fora do repositório, auditados antes da substituição e, após validação dos links `/URI`, substituíram apenas os PDFs-fonte em:

- `blog/public/legal/politica-de-privacidade-pavie-advocacia.pdf`
- `blog/public/legal/termos-de-servico-pavie-advocacia.pdf`

Depois da substituição, foi executado build controlado do blog. Os PDFs em `blog/dist/legal/` foram atualizados pelo build e ficaram idênticos por hash aos PDFs de `blog/public/legal/`.

Resultado central:

- o link histórico `https://pavieadvocacia.com.br/blog/` desapareceu dos PDFs novos;
- o link correto `https://blog.pavieadvocacia.com.br/blog/` aparece 2 vezes em cada PDF novo;
- as URLs legais `.html` foram preservadas;
- `validate:content`, `check`, `build` e `qa:blog` passaram.

## 2. Estado Git inicial

Comandos executados no início:

```text
git log -1 --oneline
6b6eca2 docs: criar HTML intermediario dos PDFs legais
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

## 3. Arquivos de contexto lidos

Foram lidos os relatórios anteriores:

- `blog/docs/auditoria_blog/11_auditoria_pdfs_legais_links_historicos.md`
- `blog/docs/auditoria_blog/12_fontes_editaveis_pdfs_legais.md`
- `blog/docs/auditoria_blog/13_revisao_tecnica_fontes_pdfs_legais.md`
- `blog/docs/auditoria_blog/14_auditoria_urls_fluxo_geracao_pdfs_legais.md`
- `blog/docs/auditoria_blog/15_html_intermediario_pdfs_legais.md`

Também foram lidos e validados os HTMLs intermediários aprovados em `blog/docs/legal/build/`.

## 4. Validação dos HTMLs intermediários

Resultado da validação dos HTMLs:

| Documento | Existe | Metadados internos ausentes | Blog canônico | Blog histórico | URLs `.html` |
|---|---:|---:|---:|---:|---:|
| Política de Privacidade | sim | sim | 2 | 0 | preservadas |
| Termos de Serviço | sim | sim | 2 | 0 | preservadas |

Foram verificados como ausentes:

- frontmatter;
- aviso interno;
- registro técnico;
- notas de auditoria;
- metadados de extração;
- referência ao link histórico `https://pavieadvocacia.com.br/blog/`.

## 5. PDFs antigos

Hashes e tamanhos dos PDFs antigos em `blog/public/legal/` antes da substituição:

| Documento | SHA-256 antigo | Tamanho antigo |
|---|---|---:|
| Política de Privacidade | `63ee5beab62af2feb6f57bbc8d24812e7aafd89603b8623618d85f3077f56a3c` | 266181 |
| Termos de Serviço | `17658d98d1b6d7a2b069c8652b93b9b3181ad3e383429a6dd1b70d392f1df8cf` | 225545 |

Um backup temporário dos PDFs antigos foi preservado fora do repositório durante a sprint em:

```text
C:\Users\FABIOE~1\AppData\Local\Temp\pavie-pdfs-legais-20260426-123336\backup-antigos
```

## 6. Ferramenta de geração

Ferramenta usada:

- Google Chrome headless, via Chromium print-to-PDF;
- comando com `--headless=new`, `--print-to-pdf` e `--print-to-pdf-no-header`;
- PDFs gerados inicialmente em diretório temporário fora do repositório;
- auditoria de links feita com `pypdf 6.7.5` e contagem crua em bytes.

Playwright não estava instalado no projeto em `blog/node_modules/.bin/playwright.cmd`. Como havia Chromium disponível pelo Google Chrome local, foi usada essa ferramenta.

## 7. Auditoria pré-substituição dos PDFs novos

Antes de substituir os PDFs publicados, os PDFs temporários foram auditados.

### Política de Privacidade

- tamanho temporário: 95932 bytes;
- páginas: 3;
- `https://pavieadvocacia.com.br/blog/`: 0 ocorrências cruas, 0 ocorrências em anotação `/URI`;
- `https://blog.pavieadvocacia.com.br/blog/`: 2 ocorrências cruas, 2 ocorrências em anotação `/URI`;
- `https://pavieadvocacia.com.br/privacidade/privacidade.html`: 2 ocorrências cruas, 2 ocorrências em anotação `/URI`;
- `https://pavieadvocacia.com.br/termos/termos.html`: 3 ocorrências cruas, 3 ocorrências em anotação `/URI`.

### Termos de Serviço

- tamanho temporário: 85226 bytes;
- páginas: 2;
- `https://pavieadvocacia.com.br/blog/`: 0 ocorrências cruas, 0 ocorrências em anotação `/URI`;
- `https://blog.pavieadvocacia.com.br/blog/`: 2 ocorrências cruas, 2 ocorrências em anotação `/URI`;
- `https://pavieadvocacia.com.br/privacidade/privacidade.html`: 4 ocorrências cruas, 4 ocorrências em anotação `/URI`;
- `https://pavieadvocacia.com.br/termos/termos.html`: 2 ocorrências cruas, 2 ocorrências em anotação `/URI`.

Como os dois PDFs temporários passaram na auditoria de links, a substituição foi executada.

## 8. Alterações executadas

Alterações executadas:

- substituído `blog/public/legal/politica-de-privacidade-pavie-advocacia.pdf`;
- substituído `blog/public/legal/termos-de-servico-pavie-advocacia.pdf`;
- criado este relatório 16;
- criada a matriz 16.

Alterações não executadas:

- nenhum HTML intermediário aprovado foi alterado;
- nenhum conteúdo jurídico textual foi alterado nesta etapa;
- `blog/dist/` não foi editado diretamente;
- nenhum arquivo de CAT-08, Decap, registry, posts, robots, sitemap, RSS, canonical ou redirects foi alterado por iniciativa desta sprint;
- não houve `git add`;
- não houve commit.

## 9. PDFs novos em public/legal

Hashes e tamanhos dos PDFs novos em `blog/public/legal/`:

| Documento | SHA-256 novo | Tamanho novo | Páginas |
|---|---|---:|---:|
| Política de Privacidade | `3d86b582678719e2acf23dc3dd7dcb0d91710be255d20f18410a1c2e111a50ba` | 95932 | 3 |
| Termos de Serviço | `6d4731a2a5e271ffecb76440614e15535a478eba86696aed8463cd32fb6bb9f6` | 85226 | 2 |

## 10. Build e QA

Comandos executados em `blog/`:

```text
npm run validate:content
```

Resultado: passou.

```text
[content-model] OK 8 categorias canonicas validadas.
```

```text
npm run check
```

Resultado: passou.

```text
Result (62 files):
- 0 errors
- 0 warnings
- 0 hints
```

```text
npm run build
```

Resultado: passou.

```text
25 page(s) built
Complete!
```

```text
npm run qa:blog
```

Resultado: passou.

```text
[qa-blog] OK 8 categorias, 5 posts publicos e 26 HTMLs validados.
```

## 11. Validação de dist/legal

Após o build, os PDFs em `blog/dist/legal/` foram conferidos.

| Documento | Hash public/legal | Hash dist/legal | Resultado |
|---|---|---|---|
| Política de Privacidade | `3d86b582678719e2acf23dc3dd7dcb0d91710be255d20f18410a1c2e111a50ba` | `3d86b582678719e2acf23dc3dd7dcb0d91710be255d20f18410a1c2e111a50ba` | idênticos |
| Termos de Serviço | `6d4731a2a5e271ffecb76440614e15535a478eba86696aed8463cd32fb6bb9f6` | `6d4731a2a5e271ffecb76440614e15535a478eba86696aed8463cd32fb6bb9f6` | idênticos |

Resultado da auditoria de links em `dist/legal`:

- Política de Privacidade:
  - blog histórico: 0;
  - blog canônico: 2;
  - `privacidade.html`: 2;
  - `termos.html`: 3.
- Termos de Serviço:
  - blog histórico: 0;
  - blog canônico: 2;
  - `privacidade.html`: 4;
  - `termos.html`: 2.

## 12. Fatos verificados

- Os HTMLs intermediários aprovados existem e não contêm metadados internos.
- Os PDFs temporários foram gerados com Chrome headless.
- As anotações `/URI` dos PDFs novos são auditáveis com `pypdf`.
- O link histórico do blog não aparece nos PDFs novos.
- O link correto do blog aparece 2 vezes em cada PDF novo.
- As URLs legais `.html` foram preservadas.
- Os PDFs novos substituíram apenas os arquivos em `blog/public/legal/`.
- O build atualizou `blog/dist/legal/`.
- Os hashes de `public/legal` e `dist/legal` batem após o build.
- Os comandos `validate:content`, `check`, `build` e `qa:blog` passaram.

## 13. Inferências

- A diferença de tamanho entre os PDFs antigos e novos decorre da mudança de ferramenta/layout de geração, não de alteração jurídica deliberada de texto.
- O aumento de páginas em relação aos PDFs antigos decorre do layout imprimível do HTML intermediário aprovado e do mecanismo de impressão do Chrome.
- Como `dist/legal` ficou idêntico por hash a `public/legal`, o build copiou corretamente os PDFs atualizados.

## 14. Hipóteses

- A revisão humana/jurídica externa à execução técnica já aprovou o texto dos HTMLs intermediários, conforme informado no prompt da sprint.
- A preservação das URLs `.html` continua sendo a decisão jurídica/editorial vigente, conforme auditoria 14 e confirmação de continuidade nesta sprint.

## 15. Riscos residuais

- Os PDFs novos têm paginação diferente dos antigos: Política de Privacidade passou para 3 páginas e Termos de Serviço para 2 páginas.
- A validação visual fina do PDF final deve ser conferida por humano antes de publicação definitiva, embora os links e o conteúdo de origem tenham sido validados tecnicamente.
- Os arquivos `.html` legais permanecem como URLs preservadas por continuidade jurídica; qualquer mudança futura desses destinos deve ser sprint separada.

## 16. Recomendação de commit

Recomenda-se commitar em etapa separada, após revisão do diff, apenas:

- `blog/public/legal/politica-de-privacidade-pavie-advocacia.pdf`
- `blog/public/legal/termos-de-servico-pavie-advocacia.pdf`
- `blog/docs/auditoria_blog/16_geracao_substituicao_pdfs_legais.md`
- `blog/docs/auditoria_blog/16_matriz_geracao_substituicao_pdfs_legais.csv`

Não incluir `blog/dist/` no commit, pois é saída de build ignorada.

## 17. Backup temporário

O backup temporário dos PDFs antigos foi mantido fora do repositório durante a validação. Após a validação completa de `public/legal`, `dist/legal`, links `/URI` e comandos de QA, o diretório temporário foi removido ao final da sprint.
