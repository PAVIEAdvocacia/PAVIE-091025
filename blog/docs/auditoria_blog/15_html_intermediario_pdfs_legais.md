# 15. HTML intermediário dos PDFs legais

## 1. Síntese executiva

Esta sprint preparou versões HTML intermediárias, limpas e revisáveis, para os dois documentos legais da PAVIE. Os arquivos foram criados a partir das fontes Markdown propostas em `blog/docs/legal/`, sem gerar PDFs e sem substituir os PDFs vigentes.

Os HTMLs preservam o conteúdo público pretendido, os títulos, a ordem das seções, os links institucionais, o link canônico do blog e as URLs legais `.html` preservadas por continuidade jurídica. Foram excluídos frontmatter, aviso interno, registro técnico de extração, notas de auditoria e metadados de reconstrução.

## 2. Estado Git inicial

- `git log -1 --oneline`: `72af056 docs: auditar URLs e fluxo de geracao dos PDFs legais`
- `git status -sb`: `## main...origin/main`
- `git diff --stat`: sem diferenças registradas no início.
- `git diff --cached --stat`: sem arquivos stageados no início.

## 3. Fontes lidas

- `blog/docs/auditoria_blog/11_auditoria_pdfs_legais_links_historicos.md`
- `blog/docs/auditoria_blog/12_fontes_editaveis_pdfs_legais.md`
- `blog/docs/auditoria_blog/13_revisao_tecnica_fontes_pdfs_legais.md`
- `blog/docs/auditoria_blog/14_auditoria_urls_fluxo_geracao_pdfs_legais.md`
- `blog/docs/legal/politica-de-privacidade-pavie-advocacia.md`
- `blog/docs/legal/termos-de-servico-pavie-advocacia.md`

## 4. HTMLs criados

- `blog/docs/legal/build/politica-de-privacidade-pavie-advocacia.preview.html`
- `blog/docs/legal/build/termos-de-servico-pavie-advocacia.preview.html`

Os arquivos foram estruturados como HTML estático, autocontido e imprimível, com CSS local no próprio documento e sem scripts, sem dependências externas e sem recursos remotos.

## 5. Conteúdo público preservado

Foram preservados:

- título do documento;
- data de última atualização;
- navegação pública;
- seções numeradas;
- parágrafos;
- listas;
- tabela de finalidades e bases legais da Política de Privacidade;
- links públicos;
- rodapé institucional.

Não houve alteração deliberada de conteúdo jurídico nesta etapa. A transformação aplicada foi formal: Markdown público para HTML intermediário revisável.

## 6. Metadados excluídos

Foram excluídos dos HTMLs públicos:

- frontmatter YAML;
- status de fonte editável proposta;
- caminho e hash do PDF de origem;
- indicação de extração por `pypdf`;
- status textual interno;
- data interna de criação da fonte;
- aviso interno de que a fonte não substitui o PDF vigente;
- explicação interna sobre intervenção deliberada no link do blog;
- seção `Registro técnico de extração`;
- linhas de impressão extraídas do PDF;
- observações de qualidade da extração;
- notas de auditoria.

## 7. Links validados

O link histórico do blog não foi reaproveitado nos HTMLs intermediários. O destino público do blog nos dois documentos é:

- `https://blog.pavieadvocacia.com.br/blog/`

As URLs legais `.html` foram preservadas:

- `https://pavieadvocacia.com.br/privacidade/privacidade.html`
- `https://pavieadvocacia.com.br/termos/termos.html`

Essas URLs permanecem coerentes com a decisão da auditoria 14, que recomendou sua preservação por continuidade jurídica.

## 8. PDFs e dist

Nenhum PDF foi gerado, substituído ou editado nesta sprint.

Não houve alteração em `blog/dist/`.

Os PDFs vigentes permanecem como artefatos publicados atuais e ainda não foram substituídos pelos HTMLs intermediários.

## 9. Riscos residuais

- O conteúdo jurídico ainda depende de revisão humana integral antes de qualquer geração de PDF público.
- A conversão para HTML reorganizou blocos sem alterar o texto jurídico por iniciativa própria, mas a equivalência visual com o PDF final ainda precisa ser validada em etapa própria.
- As URLs `.html` foram preservadas por continuidade jurídica, mas devem continuar sendo aceitas como decisão consciente até eventual revisão institucional.
- A etapa futura de geração de PDF deve garantir que nenhum metadado interno das fontes Markdown seja reintroduzido.

## 10. Recomendação

Revisar humanamente os dois HTMLs intermediários como base pública pretendida. Se aprovados, a próxima etapa deve gerar PDFs novos a partir desses HTMLs, validar as URIs embutidas nos PDFs gerados, comparar visualmente e textualmente com as fontes públicas, e somente então substituir os PDFs em `blog/public/legal/` com propagação controlada para `dist/` via build.

## 11. Próximo prompt recomendado

Executar sprint controlada para revisar visual e juridicamente os HTMLs intermediários dos documentos legais, sem gerar PDFs e sem substituir arquivos publicados, registrando eventuais ajustes formais necessários antes da etapa de geração.

## 12. Recomendação sobre commit

Quando a revisão desta sprint for aprovada, recomenda-se commitar apenas:

- `blog/docs/legal/build/politica-de-privacidade-pavie-advocacia.preview.html`
- `blog/docs/legal/build/termos-de-servico-pavie-advocacia.preview.html`
- `blog/docs/auditoria_blog/15_html_intermediario_pdfs_legais.md`
- `blog/docs/auditoria_blog/15_matriz_html_intermediario_pdfs_legais.csv`

Não incluir PDFs, `dist/`, posts, configurações de blog, redirects, sitemap, RSS, canonical, registry, Decap ou CAT-08.
