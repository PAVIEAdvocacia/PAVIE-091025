# Registro de Prevalencia e Reconciliacao Documental da CAT-08

## 1. Objeto

Este registro documenta a prevalencia do estado estrutural atual de 8 categorias canonicas no ecossistema PAVIE, com inclusao formal da CAT-08, sobre documentos historicos ou transitorios que ainda mencionem a fase anterior de 7 categorias.

O registro nao cria nova categoria, nao autoriza CAT-09, nao reabre taxonomia, nao altera rotas, nao modifica regime de CTA e nao substitui a revisao humana de documentos superiores.

## 2. Decisao registrada

Fica registrado, para fins operacionais, que o estado vigente de implementacao publica do projeto considera 8 categorias canonicas:

1. CAT-01 - Sucessoes, Inventarios e Partilha Patrimonial
2. CAT-02 - Planejamento Patrimonial, Sucessorio e Arranjos Preventivos
3. CAT-03 - Familia Patrimonial e Dissolucoes
4. CAT-04 - Familia Binacional, Sucessoes Internacionais e Cooperacao Documental
5. CAT-05 - Imoveis, Registro, Regularizacoes e Litigios Patrimoniais
6. CAT-06 - Cobranca, Execucao, Contratos e Recuperacao de Credito Seletiva
7. CAT-07 - Tributacao Patrimonial e Recuperacao Tributaria Seletiva
8. CAT-08 - Direito do Consumidor e Responsabilidade Civil

## 3. Alcance da prevalencia

A prevalencia aqui registrada se aplica a:

- registry canonico;
- Decap CMS;
- frontmatter de areas e posts;
- rotas S2 em `/areas/[slug]/`;
- rotas B2 em `/blog/categoria/[category]/`;
- B1, B2, B3 e componentes que resolvem categoria a partir de registry;
- validacoes de build/check vinculadas ao modelo de conteudo.

## 4. Efeito sobre documentos historicos

Documentos que ainda mencionem "7 categorias", "sete categorias", "CAT-01 a CAT-07" ou formula equivalente devem ser lidos como documentos de fase anterior, materiais historicos ou registros condicionados, salvo se houver disposicao expressa posterior que os atualize para 8 categorias.

Essa classificacao nao invalida o valor historico desses documentos. Apenas impede que mencoes legadas sejam usadas para:

- remover CAT-08;
- criar divergencia entre site e blog;
- bloquear rotas ja homologadas;
- reabrir taxonomia;
- criar categorias paralelas;
- autorizar CAT-09 ou expansao generica de portfolio.

## 5. Fontes correlatas

Fontes recentes que sustentam a prevalencia operacional:

- `src/lib/canonical-content.ts`
- `src/content.config.ts`
- `public/admin/config.yml`
- `src/content/areas/direito-do-consumidor-responsabilidade-civil.md`
- `scripts/validate-content-model.mjs`
- `analysis/handoff-final-pavie-2026-04-11.md`
- `analysis/rodada-final-conformidade-publica-2026-04-12.md`
- `docs/Matriz_Canonica_Final_de_Superficies_Publi.md`
- `docs/12.02_Arquitetura_Editorial_do_Blog_Juridico_da_PAVIE_Advocacia.md`
- `AGENTS.md`
- `site/AGENTS.md`

## 6. Estado estrutural comprovado

O comando `npm run validate:content` valida 8 categorias canonicas e trata a ausencia atual de posts em `src/content/blog` como estado transitorio controlado.

O estado estrutural atual inclui CAT-08 no registry, no Decap, nas paginas de area, nas categorias editoriais e no fluxo de validacao.

## 7. Pendencia documental remanescente

Permanece pendente a reconciliacao textual fina de documentos historicos que narram a fase anterior de 7 categorias. Essa pendencia e documental, nao estrutural.

A reconciliacao futura deve preservar o historico de migracao e apenas marcar a prevalencia do estado atual, sem apagar trilha decisoria e sem reabrir a taxonomia.

## 8. Regra de uso por agentes e futuras implementacoes

Quando houver conflito entre:

- documento historico mencionando 7 categorias; e
- registry, Decap, content config, handoffs recentes ou matriz publica atualizada com 8 categorias,

deve prevalecer o estado de 8 categorias, limitado a CAT-01...CAT-08.

Qualquer proposta de CAT-09, renomeacao material, reordenacao estrutural, nova area publica ou mudanca de slug canonico deve ser devolvida para camada documental superior antes de qualquer implementacao.

## 9. Decisao executiva

GO documental para prevalencia operacional da CAT-08 no estado atual.

HOLD residual apenas para reconciliacao textual dos documentos historicos, sem impacto bloqueante sobre build, rotas ou superficies publicas ja homologadas.
