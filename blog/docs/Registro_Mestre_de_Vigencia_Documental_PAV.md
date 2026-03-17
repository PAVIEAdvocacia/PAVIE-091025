---
id: pavie-registro-mestre-vigencia-documental
title: "Registro Mestre de Vigência Documental da PAVIE Advocacia"
filename: "Registro_Mestre_de_Vigencia_Documental_PAVIE.md"
type: registro_mestre_governanca_documental
status: minuta_para_homologacao
version: "1.0"
date: "2026-03-17"
owner: "Fabio Mathias Pavie"
authority_level: alto
parent_documents:
  - "00. Constituição e Governo do Escritório — Carta Constitucional da PAVIE Advocacia"
  - "Documento 04 — Registro de Prevalência, Versionamento e Superação"
  - "Laudo de Aptidão Sistêmica da PAVIE Advocacia"
  - "Parecer Formal de Coerência e Adequação Documental"
related_documents:
  - "Documento 01 — Norma de Compatibilização entre Portfólio Institucional e Taxonomia Editorial"
  - "Documento 02 — Matriz Mestra de Correspondência Pública"
  - "Documento 03 — Padrão Canônico de Copy para Superfícies Públicas"
  - "PAVIE | Advocacia — Elementos Institucionais · Site & Blog Jurídico"
review_cycle: "30 dias na fase de saneamento inicial; depois, 90 dias ou por gatilho estrutural relevante"
applies_to:
  - "governança documental do ecossistema PAVIE"
  - "site institucional"
  - "blog jurídico"
  - "página /sobre"
  - "home do site"
  - "página /areas/"
  - "bios, assinaturas e perfis externos"
  - "prompts permanentes"
  - "AGENTS.md"
  - "templates, validadores e checklists"
  - "sprints de produção, revisão e publicação"
tags:
  - pavie
  - registro-mestre
  - vigencia-documental
  - prevalencia
  - versionamento
  - superacao
  - governanca
  - editorial
  - site
  - blog
---

# Registro Mestre de Vigência Documental da PAVIE Advocacia

## 1. Objeto

O presente Registro Mestre tem por finalidade consolidar, em um único arquivo operacional, o estado de vigência, a posição hierárquica, a função sistêmica e o regime de reutilização dos documentos centrais da PAVIE Advocacia.

Seu uso é obrigatório sempre que houver:

1. publicação ou revisão de texto público;
2. criação de página, CTA, bio, assinatura, perfil externo ou ativo institucional;
3. uso de prompts, agentes, Codex, templates ou automações;
4. conflito entre texto antigo e formulação canônica mais nova;
5. dúvida sobre qual documento prevalece;
6. necessidade de classificar se um arquivo é fonte normativa, base legada, peça histórica, minuta, rascunho ou ativo operacional vigente.

## 2. Função do registro

Este arquivo existe para impedir cinco falhas críticas:

1. coexistência de versões conflitantes sem definição de prevalência;
2. reutilização indevida de documento superado;
3. uso de base biográfica legada como se fosse copy pública final;
4. atuação de agentes, prompts ou redatores por memória informal do projeto;
5. publicação em superfície sensível sem confronto com a cadeia normativa vigente.

## 3. Regra de leitura

A leitura correta deste registro depende de quatro distinções:

### 3.1 Arquivo físico

É o arquivo materialmente existente no repositório, pasta ou conversa.

### 3.2 Documento lógico

É a peça normativa, estratégica, editorial ou operacional que pode estar contida isoladamente em um arquivo físico ou agregada a outros documentos dentro de um arquivo compilado.

### 3.3 Status do documento de origem

É o status declarado pelo próprio documento, quando houver frontmatter ou indicação expressa.

### 3.4 Status normalizado no registro

É a classificação operacional uniforme adotada por este Registro Mestre para fins de produção, revisão, publicação, automação, auditoria e reuso.

## 4. Status documentais oficiais do registro

Para fins operacionais, este registro adota os seguintes status normalizados:

| Status normalizado | Significado operacional | Pode reger produção ativa? | Pode ser reutilizado sem compatibilização? |
|---|---|---:|---:|
| `vigente` | documento plenamente válido e apto a reger operação | sim | sim |
| `vigente_com_ressalvas` | documento ativo, mas sujeito a cautelas específicas | sim | não, sem checagem |
| `condicionado` | documento útil e aproveitável, mas dependente de homologação, saneamento ou compatibilização | não, sozinho | não |
| `superado` | documento substituído por outro mais recente ou mais específico | não | não |
| `histórico` | documento preservado por memória institucional, valor comparativo ou contexto | não | não |
| `arquivado` | documento retirado da operação e mantido apenas por guarda | não | não |
| `rascunho` | texto preparatório sem autoridade operacional | não | não |
| `cancelado` | peça sem valor operativo e sem autorização de uso | não | não |

## 5. Hierarquia de prevalência documental

Na dúvida entre dois documentos, aplica-se a seguinte hierarquia:

### Nível I — Constituição, governo e normas-mãe

1. Constituição do escritório;
2. bloco superior de governo e direção estratégica;
3. documentos constitucionais e fundadores expressamente homologados.

### Nível II — Normas de compatibilização e governança

1. norma de compatibilização entre portfólio e taxonomia;
2. registro de prevalência, versionamento e superação;
3. documentos de governança documental aplicada.

### Nível III — Matrizes operacionais estruturantes

1. matriz mestra de correspondência pública;
2. mapas oficiais de superfícies;
3. matrizes canônicas de uso por contexto.

### Nível IV — Padrões canônicos de linguagem e superfície

1. padrão canônico de copy;
2. fórmulas oficiais de home, /sobre, /areas/, bios, assinaturas e CTAs;
3. checklists de revisão e validação.

### Nível V — Derivações operacionais

1. textos de página;
2. prompts;
3. AGENTS.md;
4. templates;
5. sprints;
6. peças derivadas de CMS.

### Nível VI — Materiais históricos, legados e comparativos

1. bios antigas;
2. PDFs legados;
3. textos compilados de fase anterior;
4. estudos, comparativos e rascunhos.

## 6. Regras objetivas de solução de conflito

Quando dois ativos concorrerem entre si, aplicar nesta ordem:

1. **regra da função** — norma prevalece sobre texto descritivo;
2. **regra da especialidade** — documento especificamente criado para a superfície prevalece sobre texto genérico;
3. **regra da atualidade homologada** — prevalece a versão mais recente formalmente validada;
4. **regra da coerência sistêmica** — prevalece o ativo compatível com a arquitetura homologada atual;
5. **regra da superfície mais sensível** — em home, /areas/, assinatura, bio curta, CTA e prompt público, prevalece sempre o padrão mais restritivo e mais canônico;
6. **regra da memória sem uso ativo** — documento histórico não sai da guarda, mas não volta à produção sem reclassificação formal.

## 7. Campos mínimos obrigatórios por registro

Cada documento relevante deve ter, no mínimo:

- código ou identificador;
- título oficial;
- arquivo físico;
- documento lógico principal;
- versão;
- data;
- status do documento de origem;
- status normalizado no registro;
- nível de prevalência;
- documento(s) superior(es);
- documentos subordinados ou exportações principais;
- superfícies afetadas;
- substitui / substituído por;
- regra de reuso;
- observações de risco.

## 8. Registro mestre inicial

### 8.1 Registros confirmados por arquivo materializado

| Código | Título oficial / documento lógico | Arquivo físico | Versão | Data | Status do documento de origem | Status normalizado no registro | Nível | Documento(s) superior(es) | Superfícies afetadas | Substitui / substituído por | Regra de reuso | Observações de risco |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RM-00 | Registro Mestre de Vigência Documental da PAVIE Advocacia | `Registro_Mestre_de_Vigencia_Documental_PAVIE.md` | 1.0 | 2026-03-17 | `minuta_para_homologacao` | `condicionado` | II | Constituição; Documento 04; Laudo; Parecer | todo o subsistema institucional e editorial | não substitui; inaugura controle centralizado | pode reger classificação e saneamento após validação final | exige homologação expressa e atualização periódica |
| 00.00 | Constituição e Governo do Escritório — Carta Constitucional da PAVIE Advocacia | `1. portfólio institucional amplo.md` (arquivo compilado) | 1.0 | 2026-03-06 | `vigente` | `vigente` | I | nenhum interno | todo o sistema PAVIE | substitui formulações fundacionais dispersas | reutilização plena, com preservação literal da hierarquia | arquivo físico compilado; recomenda-se individualização futura |
| 01.00 | Plano Diretor Estratégico e Operacional — versão constitucionalmente alinhada | `1. portfólio institucional amplo.md` (arquivo compilado) | 1.0 | 2026-03-06 | `vigente` | `vigente` | I | 00.00 | planejamento, portfólio, metas, capacidade, direção do ciclo | substitui plano diretor anterior não alinhado | reutilização plena nas matérias estratégicas | arquivo físico compilado; recomenda-se individualização futura |
| 01.01 | Plano Anual de Execução | `1. portfólio institucional amplo.md` (arquivo compilado) | 1.0 | 2026-03-06 | `vigente` | `vigente` | I | 00.00; 01.00 | direção anual, execução, precedência entre projetos | não informado | reutilização plena na execução anual | arquivo físico compilado; recomenda-se individualização futura |
| 01.02 | Plano Trimestral de Prioridades e Revisão | `1. portfólio institucional amplo.md` (arquivo compilado) | 1.0 | 2026-03-06 | `vigente` | `vigente` | I | 00.00; 01.00; 01.01 | ciclos trimestrais, contenção, pacing, semáforos | não informado | reutilização plena na gestão trimestral | arquivo físico compilado; recomenda-se individualização futura |
| ARQ-01 | Arquivo 01 — Constituição Editorial e Critérios de Prevalência da Arquitetura de Conteúdo da PAVIE Advocacia | `2. taxonomia editorial canônica e menções púb deriv.md` | 1.1 | 2026-03-16 | `minuta_estruturante_revisada` | `condicionado` | II | 00.00; política de site/blog; plano diretor | site, blog, clusters, sprints editoriais, prompts | não informado | uso como norma de orientação, não como autorização final isolada | peça central do sistema editorial, mas ainda em regime de minuta estruturante |
| ARQ-02 | Arquivo 02 — Taxonomia-Mãe Final Compatibilizada com o Portfólio | `2. taxonomia editorial canônica e menções púb deriv.md` (mesmo arquivo físico) | n/i | 2026-03-16 ou 2026-03-17 (a confirmar) | n/i | `condicionado` | II | ARQ-01; 00.00 | categorias, hubs, /areas/, blog, nomenclatura canônica | não informado | só usar em conjunto com Documento 01, Documento 02 e Documento 03 | recomenda-se extração para arquivo próprio com frontmatter individual |
| ARQ-06 | Arquivo 06 — Arquitetura do Site, do Blog e das Páginas Estratégicas | `2. taxonomia editorial canônica e menções púb deriv.md` (mesmo arquivo físico) | n/i | 2026-03-16 ou 2026-03-17 (a confirmar) | n/i | `condicionado` | III | ARQ-01; ARQ-02 | home, /sobre, /areas/, páginas estratégicas, blog, slugs e interlinking | não informado | pode orientar arquitetura, mas não dispensa matriz canônica por superfície | recomenda-se arquivo próprio e vinculação formal ao backlog de implantação |
| DOC-01 | Documento 01 — Norma de Compatibilização entre Portfólio Institucional e Taxonomia Editorial | `documentos de amarração itens 1 e 2.md` | 1.0 | 2026-03-17 | `minuta_estruturante` | `condicionado` | II | 00.00; ARQ-01; ARQ-02 | home, /sobre, /areas/, assinatura, bio, perfis externos, prompts | não informado | obrigatório para traduzir amplitude biográfica em superfície seletiva | não deve ser ignorado em revisão de copy pública |
| DOC-02 | Documento 02 — Matriz Mestra de Correspondência Pública | `documentos de amarração itens 1 e 2.md` (mesmo arquivo físico) | n/i | 2026-03-17 | n/i | `condicionado` | III | DOC-01 | home, /sobre, /areas/, blog, perfis, CTAs | não informado | documento de referência para compatibilização por superfície | recomenda-se individualização física e validação final |
| DOC-03 | Documento 03 — Padrão Canônico de Copy para Superfícies Públicas | `documentos de amarração itens 1 e 2.md` (mesmo arquivo físico) | n/i | 2026-03-17 | n/i | `condicionado` | IV | DOC-01; DOC-02 | copy pública, headlines, bios, CTAs, páginas canônicas | não informado | aplicar como padrão preferencial de redação pública | risco de reuso indevido se não houver extração para arquivo próprio |
| DOC-04 | Documento 04 — Registro de Prevalência, Versionamento e Superação | `documentos de amarração itens 1 e 2.md` (mesmo arquivo físico) | 1.0 (registro de alteração interno) | 2026-03-17 | `minuta_estruturante` ou equivalente interno | `condicionado` | II | 00.00; DOC-01; DOC-02; DOC-03 | documentos, prompts, AGENTS, templates, publicações | este RM-00 o desdobra em formato de inventário ativo | regra-base de status, prevalência e superação | recomenda-se homologação formal e vinculação a toda revisão futura |
| PARECER-01 | Parecer Formal de Coerência e Adequação Documental | `Parecer_Formal_Coerencia_Adequacao_Documental_PAVIE.md` | 1.0 | 2026-03-17 | `emitido_para_implantacao_condicionada` | `vigente_com_ressalvas` | II | 00.00; 01.00; 01.03; ARQ-01; ARQ-02; DOC-01 | governança documental, site, blog, bios, prompts, superfícies públicas | não substitui norma; orienta saneamento e implantação | reutilização permitida como parecer técnico de referência | não é fonte canônica de copy; é fonte de juízo e condicionantes |
| LAUDO-01 | Laudo de Aptidão Sistêmica da PAVIE Advocacia | `Laudo_de_Aptidao_Sistemica_da_PAVIE.md` | 1.0 | 2026-03-17 | `minuta_para_homologacao` | `condicionado` | II | 00.00; 11.00; 12.00; 13.00 | governança, site, blog, SEO, agentes, implantação | não substitui norma; funda o plano de saneamento | reutilização permitida como base diagnóstica e priorização | carece de homologação final e articulação com este registro |
| LEG-01 | PAVIE  Advocacia — Elementos Institucionais · Site & Blog Jurídico | `PAVIE_Elementos_Institucionais_Sit.pdf` | n/i | 2026-03-17 (upload na conversa) | sem status expresso no PDF | `histórico` | VI | subordinado ao bloco normativo posterior | home, /sobre, assinatura, bios, perfis, CTAs | parcialmente superado por DOC-01, DOC-02, DOC-03 e pelo sistema posterior | reutilização apenas pontual, mediante compatibilização e confronto com norma vigente | base legada útil como reservatório biográfico; vedado tratá-la em bloco como copy pública final |

### 8.2 Registros declarados no sistema e pendentes de individualização física prioritária

Esses documentos aparecem como relevantes no sistema, mas exigem arquivo individual próprio, frontmatter autônomo ou verificação física adicional no repositório principal.

| Código | Documento lógico declarado | Situação atual no registro | Ação exigida | Prioridade |
|---|---|---|---|---:|
| 01.03 | Mapa de Portfólio e Priorização | referenciado em múltiplos documentos, sem arquivo individual materializado nesta conversa | localizar, conferir versão e individualizar | alta |
| 01.04 | Orçamento, Metas e Capacidade | referenciado em múltiplos documentos, sem arquivo individual materializado nesta conversa | localizar, conferir versão e individualizar | alta |
| 05.00 | Portfólio Jurídico e Entrega de Valor | referenciado como documento superior do DOC-01 | localizar, conferir versão e individualizar | alta |
| 05.01 | Mapa Oficial de Frentes, Áreas e Subnichos | referenciado como documento superior do DOC-01 | localizar, conferir versão e individualizar | alta |
| 06.06 | Política de Conteúdo, Autoridade e Captação Ética | referenciada como documento superior do DOC-01 | localizar, conferir versão e individualizar | média |
| 07.04 | Política de Site, Blog, Páginas Estratégicas e SEO Institucional | referenciada no ARQ-01 | localizar, conferir versão e individualizar | alta |
| 11.00 | Política do Ecossistema Editorial | referenciada no LAUDO-01 | localizar, conferir versão e individualizar | média |
| 12.00 | Política de Arquitetura Web Institucional, SEO Estrutural e Ecossistema Editorial | referenciada no LAUDO-01 | localizar, conferir versão e individualizar | alta |
| 13.00 | Política de Implementação, Operação, Controle e Evolução do Ecossistema Digital | referenciada no LAUDO-01 | localizar, conferir versão e individualizar | alta |

## 9. Regras operacionais imediatas

### 9.1 Regra de publicação pública

Nenhum texto de home, página `/sobre`, página `/areas/`, assinatura curta, bio curta, bio média, bio longa, CTA, perfil externo ou prompt público poderá ser aprovado sem confronto cumulativo com:

1. 00.00 Constituição do escritório;
2. DOC-01 Norma de Compatibilização;
3. DOC-02 Matriz Mestra de Correspondência Pública;
4. DOC-03 Padrão Canônico de Copy para Superfícies Públicas;
5. este Registro Mestre.

### 9.2 Regra de legado

O documento `PAVIE_Elementos_Institucionais_Sit.pdf` permanece preservado por memória institucional, repertório biográfico e consulta comparativa. Seu uso ativo depende de reescrita ou compatibilização formal.

### 9.3 Regra de prompts e agentes

Todo prompt permanente, AGENTS.md, validador, sprint ou template deverá conter referência expressa a este Registro Mestre ou reproduzir, em bloco equivalente, ao menos:

- a hierarquia de prevalência;
- os status documentais;
- a vedação de uso de histórico como se fosse vigente;
- a regra de conflito por função, especialidade e atualidade homologada.

### 9.4 Regra de ressurgimento silencioso

Tema, enumeração, slogan, bio, headline, CTA, nome de categoria ou formulação já superados não podem retornar à operação por reaproveitamento intuitivo, memória subjetiva ou busca em arquivos antigos.

## 10. Gatilhos obrigatórios de atualização deste registro

Este registro deverá ser atualizado sempre que houver:

1. criação, homologação, revisão major ou superação de documento normativo relevante;
2. individualização física de documento hoje apenas declarado no sistema;
3. mudança de portfólio público, taxonomia, naming ou arquitetura de superfície sensível;
4. alteração de texto canônico de home, `/sobre`, `/areas/`, assinatura, bio ou CTA;
5. conflito recorrente entre agentes, prompts, templates ou arquivos derivados;
6. descoberta de uso operacional de ativo histórico como se fosse documento vigente;
7. implantação de nova camada técnica que passe a depender de regra documental.

## 11. Protocolo mínimo de atualização

Ao atualizar este registro, inserir no final do arquivo o seguinte bloco:

```md
## Registro de alteração
- versão anterior: x.y
- versão atual: x.y
- data: AAAA-MM-DD
- natureza da mudança: inclusão / reclassificação / superação / saneamento / individualização física
- registros afetados: [listar códigos]
- motivo: [resumo objetivo]
- responsável pela validação: [nome]
- status pós-alteração: vigente / vigente_com_ressalvas / condicionado / superado / histórico / arquivado / rascunho / cancelado
```

## 12. Critério de conclusão da fase inicial de saneamento

A fase inicial deste Registro Mestre será considerada suficientemente concluída quando, cumulativamente:

1. nenhum documento crítico do subsistema público-institucional estiver sem status normalizado;
2. nenhum ativo sensível estiver sem documento superior identificado;
3. os documentos canônicos de superfície estiverem individualizados ou inequivocamente apontados;
4. o PDF legado estiver formalmente rotulado como histórico / base legada sujeita a compatibilização;
5. houver correspondência explícita entre este registro, a matriz por superfície e o padrão canônico de copy.

## 13. Deliberações executivas imediatas

1. individualizar fisicamente DOC-02, DOC-03 e DOC-04;
2. extrair ARQ-02 e ARQ-06 para arquivos próprios, com frontmatter autônomo;
3. localizar e registrar 01.03, 01.04, 05.00, 05.01, 07.04, 12.00 e 13.00;
4. criar, em seguida, a **Matriz Canônica Final de Superfícies Públicas**;
5. somente depois consolidar AGENTS.md e validadores definitivos do repositório.

## 14. Fórmula conclusiva

Este Registro Mestre não substitui a Constituição, a norma de compatibilização, a matriz de correspondência pública nem o padrão canônico de copy. Sua função é distinta: **dizer qual documento vale, em que medida vale, para que superfície vale e sob que cautelas ele pode ou não ser reutilizado**.

Enquanto não houver reclassificação formal, vale a seguinte máxima operacional:

> **memória preserva; norma vigente governa; histórico não publica.**

## Registro de alteração
- versão anterior: inexistente
- versão atual: 1.0
- data: 2026-03-17
- natureza da mudança: criação originária
- registros afetados: RM-00, 00.00, 01.00, 01.01, 01.02, ARQ-01, ARQ-02, ARQ-06, DOC-01, DOC-02, DOC-03, DOC-04, PARECER-01, LAUDO-01, LEG-01
- motivo: instituir inventário central de vigência, prevalência, versionamento e regime de reutilização do acervo crítico do subsistema institucional e editorial público da PAVIE
- responsável pela validação: Fabio Mathias Pavie
- status pós-alteração: condicionado
