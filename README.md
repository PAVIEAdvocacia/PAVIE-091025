# PAVIE | Advocacia - Ecossistema site + blog

Este repositório sustenta o ecossistema digital da **PAVIE | Advocacia**. A regra-mãe operacional, vinculante para a Sprint 0, é:

- o **site institucional** recebe, orienta e converte demanda qualificada;
- o **blog jurídico** qualifica, amadurece e devolve o leitor ao site;
- o blog não é segunda sede comercial, não cria taxonomia própria e não deve competir com a superfície institucional.

## Sprint 0 - governança e reconciliação de base

Backlog vinculante: `pavie_sprint_codex.xlsx`, aba `Sprint_Codex`, classe `O0`.

Objetivo desta sprint: eliminar contradições de base entre documentação, configuração e estado real do repositório antes de iniciar implementação completa de `S1`, `B1`, `S2`, `B2`, `S3`, `B3`, `B4` ou `R1`.

Itens O0 reconhecidos:

| Ordem | Diretriz | Aplicação na base |
| --- | --- | --- |
| 1 | Tese-mãe do ecossistema | Site = sede institucional/conversão. Blog = braço editorial subordinado. |
| 2 | Valor editorial comprovado em `CAT-08` | `CAT-08` é o acervo público mínimo atual e serve como referência para o blog. |
| 3 | Regime verbal e disciplina visual do blog devem influenciar o site | Regra registrada para sprints seguintes, sem redesenhar o site nesta sprint. |

## Estado operacional atual

| Camada | Arquivo/rota | Estado |
| --- | --- | --- |
| Site institucional legado | `index.html` | Existe na raiz como base estática institucional. Ainda requer reconciliação fina futura com a linguagem editorial amadurecida. |
| Site institucional no app Astro | `blog/src/pages/index.astro` | Existe como superfície institucional dentro do app Astro, com ponte para o blog. |
| Home editorial do blog (`B1`) | `blog/src/pages/blog/index.astro` | Existe como home editorial curada, não como arquivo cronológico principal. |
| Categoria do blog (`B2`) | `blog/src/pages/blog/categoria/[slug]/[...page].astro` | Existe como categoria canônica paginada. |
| Artigo do blog (`B3`) | `blog/src/pages/blog/[slug].astro` | Existe como página de leitura. |
| Autor do blog (`B4`) | `blog/src/pages/blog/autor/[slug].astro` | Existe como autoria editorial. |
| Área institucional (`S2`) | `blog/src/pages/areas/[slug].astro` | Existe no app Astro e recebe retorno do blog conforme vínculo área-categoria. |
| CMS editorial | `blog/public/admin/config.yml` | Existe com Decap CMS, GitHub backend e coleções de posts, áreas e autores. |

## Taxonomia pública vigente

A taxonomia pública do blog é governada pelo registry canônico em `blog/src/data/categories.registry.ts`. O front-end não cria categorias.

Categorias reconhecidas:

| Código | Categoria |
| --- | --- |
| `CAT-01` | Sucessões, Inventários e Partilha Patrimonial |
| `CAT-02` | Planejamento Patrimonial, Sucessório e Arranjos Preventivos |
| `CAT-03` | Família Patrimonial e Dissoluções |
| `CAT-04` | Família Binacional, Sucessões Internacionais e Cooperação Documental |
| `CAT-05` | Imóveis, Registro, Regularizações e Litígios Patrimoniais |
| `CAT-06` | Cobrança, Execução, Contratos e Recuperação de Crédito Seletiva |
| `CAT-07` | Tributação Patrimonial e Recuperação Tributária Seletiva |
| `CAT-08` | Direito do Consumidor e Responsabilidade Civil |

## Já existe / precisa nascer

| Frente | Já existe | Precisa nascer em sprint futura |
| --- | --- | --- |
| Governança base | `AGENTS.md`, docs normativos em `blog/docs/`, registry canônico e README reconciliado | Consolidação contínua de divergências documentais encontradas durante cada sprint. |
| Site institucional | `index.html` estático e `blog/src/pages/index.astro` | Escolha operacional/deploy unificada para `S1`, sem duplicar narrativa nem contato. |
| Blog editorial | `B1`, `B2`, `B3`, `B4`, autores, áreas e acervo público mínimo de `CAT-08` | Expansão editorial real para `CAT-01` a `CAT-07` apenas quando houver prontidão documental e revisão. |
| CMS | Configuração Decap, coleções e campos canônicos | Fluxo editorial completo de revisão/publicação sem criar taxonomia fora do registry. |
| Métricas/QA | Scripts e instrumentação neutra já existem no app Astro | Ajustes de scripts devem acompanhar o estado aceito das superfícies, sem simular popularidade. |

## Inconsistências remanescentes registradas

- O clone local informa `origin` em `PAVIEAdvocacia/PAVIE-091025`; a solicitação operacional menciona `fabiopavie/PAVIE-091025`. Como `PAVIEAdvocacia/PAVIE-091025` é o remote acessível e compatível com o CMS atual, a Sprint 0 preserva essa configuração até validação humana.
- `index.html` e `blog/src/pages/index.astro` coexistem como narrativas institucionais. A Sprint 0 registra o descompasso, mas não escolhe nem redesenha a arquitetura de `S1`.
- `blog/src/pages/posts/hello-blog.md` não existe mais na estrutura atual. O conteúdo editorial público usa a collection `blog/src/content/blog/`.
- A linguagem comercial do `index.html` ainda deve ser revisada em sprint própria para absorver o melhor regime verbal do blog sem perder a função institucional do site.

## Comandos úteis

Executar a partir de `blog/`:

```bash
npm run check
npm run build
npm run qa:blog
```

## Notas de publicação

- O site institucional deve permanecer como destino de conversão qualificada.
- O blog deve permanecer como camada editorial de descoberta, maturação e retorno.
- Alterações em rotas, taxonomia, CTA global, registry ou superfícies públicas exigem revisão humana e compatibilização com a documentação canônica.
