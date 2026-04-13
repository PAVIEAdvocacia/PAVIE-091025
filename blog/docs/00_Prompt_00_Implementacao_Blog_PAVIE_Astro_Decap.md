# Prompt 00 — Implementação Constitucional do Repositório `blog.pavieadvocacia.com.br`

## Finalidade

Este Prompt 00 é a instrução-mãe de execução para o repositório real do blog da PAVIE | Advocacia. Ele existe para transformar a governança documental já consolidada em implementação concreta no código, sem permitir regressão semântica, inflação do portfólio público, perda de SEO estrutural, quebra de rotas relevantes ou improviso visual.

Este prompt **não autoriza recomeçar o projeto do zero** sem prova objetiva de que isso é estritamente necessário. A diretriz é: **auditar o que existe, reaproveitar o que presta, refatorar o que conflita, migrar o que for necessário e documentar o impacto**.

---

## Contexto já resolvido fora do repositório

Considere como premissas superiores já definidas fora do código:

1. a PAVIE possui **taxonomia pública canônica de 8 categorias, de CAT-01 a CAT-08**;
2. portfólio institucional amplo e taxonomia editorial **não são equivalentes**;
3. home, `/sobre`, `/areas/`, blog, assinatura de autor, bios e CTAs **devem obedecer à matriz canônica de superfícies públicas**;
4. o projeto está **apto para implantação**, mas com necessidade de **saneamento final do legado e fechamento operacional**;
5. o repositório deve operar com **AGENTS.md** e sprints bem delimitadas, porque Codex funciona melhor com tarefas escopadas, contexto persistente e revisão humana antes de merge/deploy.

---

## Estado público atual a considerar como “repositório real em produção”

Antes de qualquer alteração, parta do que está publicado hoje no domínio e trate isso como realidade a ser auditada:

- há home institucional em `https://blog.pavieadvocacia.com.br/`;
- há blog em `https://blog.pavieadvocacia.com.br/blog/`;
- o menu público atual expõe, ao menos, `Áreas de Atuação`, `Sobre`, `Publicações`, `Áreas do Blog`, `Temas` e `Contato`;
- a home atual ainda usa uma camada intermediária de posicionamento com blocos como `Família e Sucessões`, `Planejamento Patrimonial` e `Contratos e Negócios`;
- o blog atual já possui acervo público, trilhas por área/tema e rotas de artigos com padrão aparentemente **date-prefixed**.

Esses elementos **não devem ser apagados por suposição**. Devem ser auditados, reconciliados com a nova governança e, se necessário, migrados com redirects e documentação.

---

## Ordem de leitura obrigatória antes de agir

Leia, nesta ordem, antes de propor qualquer mudança estrutural:

1. `AGENTS.md` raiz do projeto;
2. `site/AGENTS.md`;
3. `blog/AGENTS.md`;
4. `legal-copy/AGENTS.md`;
5. `12.02 — Arquitetura Editorial do Blog Jurídico da PAVIE Advocacia`;
6. `12.03 — Design System Institucional PAVIE para Web`;
7. `12.06 — Governança de Conteúdo, Frontmatter e Migração do Acervo da PAVIE Advocacia`;
8. `13.05 — Política de Controle de Qualidade, Testes e Validação de Entregas da PAVIE Advocacia`;
9. Registro Mestre de Vigência Documental;
10. Matriz Canônica Final de Superfícies Públicas;
11. Norma de Compatibilização entre Portfólio Institucional e Taxonomia Editorial.

Se houver conflito entre o legado do site e a camada canônica, **prevalece a camada canônica**, mas a correção deve ocorrer com migração consciente e não com destruição cega.

---

## Objetivo operacional

Reestruturar o repositório do blog/site em **Astro + Decap CMS**, preservando o que já está bom e implantando o que falta para que o domínio:

1. respeite a taxonomia pública canônica da PAVIE;
2. tenha modelo de conteúdo controlado por collections e frontmatter validado;
3. possua design system mínimo, sóbrio, estável e reutilizável;
4. exponha arquitetura clara de rotas públicas e internas;
5. torne o Decap admin efetivamente útil para operação contínua;
6. saneie o acervo legado sem perda desnecessária de valor SEO ou editorial;
7. deixe trilha curta e confiável de manutenção futura.

---

## Restrições inegociáveis

Você **não pode**:

1. criar novas categorias-mãe;
2. ampliar o portfólio público por iniciativa própria;
3. reescrever bios, headlines e CTAs livres sem confronto com a matriz canônica;
4. trocar rotas públicas indexadas sem mapear redirect/canonical/impacto;
5. introduzir dependência pesada sem justificativa objetiva;
6. substituir o projeto por arquitetura “mais bonita” mas mais cara de manter;
7. tratar o blog como portal jurídico generalista;
8. migrar acervo automaticamente sem classificar `migrar`, `fundir`, `arquivar`, `redirecionar` ou `reescrever`;
9. presumir que tudo que está publicado hoje deve permanecer igual;
10. presumir que tudo que está publicado hoje deve ser descartado.

---

## Protocolo obrigatório de preflight

Antes da primeira edição material, execute uma auditoria do repositório real e entregue um relatório curto contendo:

### 1. Mapa do estado atual
- árvore de rotas públicas atuais;
- coleção/conteúdo atual existente;
- componentes e layouts reaproveitáveis;
- rotas indexáveis e rotas auxiliares;
- padrão atual de slug, especialmente nos posts;
- presença atual de CMS/admin e seu estado real.

### 2. Mapa de conflito
- o que está alinhado com a nova governança;
- o que está apenas parcialmente alinhado;
- o que conflita com a taxonomia canônica;
- o que é legado útil;
- o que é legado perigoso para reuso sem saneamento.

### 3. Decisão por item estrutural
Para cada item relevante, decidir:
- `manter`;
- `refatorar`;
- `migrar`;
- `substituir com redirect`;
- `arquivar`.

Nenhuma sprint seguinte deve ser iniciada sem esse preflight.

---

## Hipóteses de trabalho para o repositório

Se o repositório ainda não estiver plenamente organizado, assuma como destino desejado, salvo evidência contrária no código:

```text
/
├─ src/
│  ├─ components/
│  ├─ layouts/
│  ├─ content/
│  │  ├─ posts/
│  │  ├─ areas/
│  │  ├─ authors/
│  │  └─ config.ts
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ sobre.astro
│  │  ├─ areas/
│  │  │  ├─ index.astro
│  │  │  └─ [slug].astro
│  │  ├─ blog/
│  │  │  ├─ index.astro
│  │  │  ├─ areas/
│  │  │  │  └─ [category].astro
│  │  │  ├─ temas/
│  │  │  │  └─ [tag].astro
│  │  │  └─ [slug].astro   # ou outra estratégia, desde que preserve URLs/SEO
│  │  └─ autor/
│  │     └─ [slug].astro
│  ├─ lib/
│  ├─ data/
│  └─ styles/
├─ public/
│  └─ admin/
│     ├─ index.html
│     └─ config.yml
├─ redirects
├─ astro.config.*
└─ package.json
```

Se a estrutura real for diferente, adapte **sem perder** a lógica acima.

---

## Regra para slugs e legado

O site atual sugere existência de posts com slugs públicos date-prefixed. A nova governança admite slugs estáveis sem data obrigatória. Portanto:

1. **não elimine o padrão atual sem auditoria**;
2. se a decisão for migrar para slug sem data, implemente:
   - mapa de `legacySlug`;
   - redirects 301 equivalentes;
   - canonical final correta;
   - validação de links internos;
   - documentação explícita da mudança;
3. se a decisão mais segura for manter os slugs atuais nesta fase, mantenha-os e normalize o restante do sistema ao redor deles.

A prioridade é **não perder integridade pública nem SEO estrutural**.

---

## Taxonomia pública canônica obrigatória

As únicas categorias públicas canônicas são:

1. `sucessoes-inventarios-partilha-patrimonial`
2. `planejamento-patrimonial-sucessorio-arranjos-preventivos`
3. `familia-patrimonial-dissolucoes`
4. `familia-binacional-sucessoes-internacionais-cooperacao-documental`
5. `imoveis-registro-regularizacoes-litigios-patrimoniais`
6. `cobranca-execucao-contratos-recuperacao-credito-seletiva`
7. `tributacao-patrimonial-recuperacao-tributaria-seletiva`

No front-end, no CMS, no frontmatter, no interlinking e nos dados centrais, use **códigos estáveis** e, separadamente, os **rótulos públicos canônicos**.

---

## Critério de qualidade transversal a todas as sprints

Toda sprint deverá entregar, no mínimo:

1. diff compreensível;
2. justificativa curta das decisões estruturais;
3. indicação dos arquivos tocados;
4. impacto sobre rotas, conteúdo, metadados e CMS;
5. build sem erro, quando aplicável;
6. pendências conhecidas;
7. itens que exigem revisão humana antes de publicação.

---

## Ordem das sprints subsequentes

Após o preflight, execute exatamente nesta ordem:

1. **S1 — Modelo de Conteúdo, Collections e Contrato Editorial**
2. **S2 — Design System Mínimo e Layout Base Reutilizável**
3. **S3 — Arquitetura de Rotas, Páginas Estratégicas e Navegação**
4. **S4 — Decap Admin, Preview e Fluxo Editorial Controlado**
5. **S5 — Migração do Acervo e Saneamento das Superfícies Públicas**
6. **S6 — QA Final, SEO Estrutural, Redirects, Documentação e Fechamento**

Não inverta a ordem.

---

## Regra de saída

Ao final de cada sprint, entregue:

1. resumo do que foi feito;
2. riscos residuais;
3. checklist de aceite;
4. recomendação objetiva do próximo passo.

Ao final da S6, o repositório deverá estar:

- coerente com a governança documental da PAVIE;
- apto para operação editorial em Astro + Decap;
- apto para revisão humana final e deploy controlado.

---

## Prompt curto de execução contínua

```text
Leia o AGENTS.md raiz, os AGENTS específicos aplicáveis, os documentos 12.02, 12.03, 12.06 e 13.05, além da matriz canônica de superfícies e do registro mestre de vigência. Audite primeiro o estado real do repositório de blog.pavieadvocacia.com.br e o reconcile com o estado publicado em produção. Preserve a taxonomia canônica da PAVIE, não amplie o portfólio público, não quebre URLs sem plano de redirect/canonical e implemente apenas o necessário para a sprint corrente, com máxima reutilização, mínima regressão, build validado e documentação curta do impacto estrutural.
```
