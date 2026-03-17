# AGENTS.md — Raiz Operacional do Projeto PAVIE

## 1. Finalidade

Este arquivo estabelece as instruções operacionais mínimas e estáveis para agentes, assistentes de código, GPTs de projeto e rotinas de execução que atuem no ecossistema digital da **PAVIE | Advocacia**.

Sua função não é substituir os documentos normativos do projeto nem concentrar toda a estratégia do escritório. Sua função é mais restrita e mais importante: **traduzir a governança já homologada em regras executáveis de trabalho**, reduzindo improviso, regressão semântica, duplicação estrutural e conflito entre conteúdo, design, SEO, arquitetura e automação.

Este arquivo deve ser lido como **constituição operacional mínima do repositório**.

---

## 2. Escopo

Este `AGENTS.md` raiz aplica-se a todo o projeto, salvo quando houver `AGENTS.md` mais específico em subdiretório, hipótese em que o arquivo mais profundo prevalecerá dentro do seu próprio escopo.

Ele rege, especialmente:

- criação, edição e refatoração de páginas do site;
- criação, edição e manutenção do blog;
- taxonomia, frontmatter e metadados;
- copy pública e superfícies sensíveis;
- componentes compartilhados, layout e padrões visuais;
- SEO estrutural e editorial;
- CMS, collections e conteúdo em Markdown;
- distribuição derivada para canais externos;
- uso de IA e execução via Codex.

---

## 3. Ordem obrigatória de leitura antes de agir

Antes de editar, criar ou remover qualquer arquivo relevante, o agente deve verificar, nesta ordem, os documentos de maior autoridade disponíveis no projeto:

1. **Constituição e Governo do Escritório** (`00.00` ou equivalente vigente);
2. **Registro Mestre de Vigência Documental da PAVIE**;
3. **Matriz Canônica Final de Superfícies Públicas da PAVIE**;
4. **Norma de Compatibilização entre Portfólio Institucional e Taxonomia Editorial**;
5. documentos do bloco de arquitetura web, SEO, design system, autoria, distribuição e Codex (`12.xx` e `13.xx`, quando presentes);
6. eventuais `AGENTS.md` mais específicos do diretório afetado.

Se houver conflito entre memória informal, texto legado e documento canônico, **prevalece o documento mais alto e mais específico na cadeia vigente**.

---

## 4. Princípios operacionais inegociáveis

### 4.1 Coerência institucional antes de conveniência

Nenhuma alteração pode ampliar artificialmente o portfólio público, romper a taxonomia canônica, criar novas áreas sem autorização documental ou degradar a coerência entre site, blog, bios, CTAs e perfis externos.

### 4.2 Fonte única de verdade antes de criatividade livre

Quando houver matriz canônica, copy autorizada ou regra de superfície, o agente **não deve improvisar nova formulação base**. Deve reutilizar, adaptar dentro dos limites permitidos ou sinalizar lacuna documental.

### 4.3 Refatorar antes de duplicar

Sempre que possível, o agente deve preferir:

- refatorar componente existente;
- reaproveitar layout, partial, collection ou template;
- consolidar lógica repetida;
- reduzir variação desnecessária.

### 4.4 Alterar o mínimo necessário para produzir o efeito correto

Mudanças amplas sem benefício proporcional são indesejadas. O agente deve evitar intervenções excessivas, cascatas não mapeadas e reescritas totais sem necessidade.

### 4.5 Arquitetura antes de volume

O projeto não existe para acumular páginas, posts ou componentes soltos. Toda criação deve saber:

- qual função cumpre;
- qual superfície atende;
- qual categoria ou coleção reforça;
- qual ativo central aponta;
- qual risco de canibalização ou dispersão pode gerar.

### 4.6 Revisão humana obrigatória para atos sensíveis

O agente pode estruturar, redigir, organizar, refatorar e validar tecnicamente, mas não deve tratar como “publicação pronta sem revisão” conteúdos sensíveis, incluindo:

- copy institucional principal;
- bios públicas;
- textos jurídicos com afirmação normativa sensível;
- conteúdo que pareça promessa, especialização implícita ou alegação biográfica dependente de prova;
- textos de privacidade, consentimento, contratação ou honorários;
- mudanças estruturais em rotas, taxonomia e arquitetura pública.

### 4.7 Evidência antes da narrativa

É vedado inventar:

- fatos biográficos;
- prêmios, cargos, certificações ou vínculos não comprovados;
- dados de desempenho;
- jurisprudência, legislação, estatísticas ou premissas técnicas não verificadas;
- funcionalidades “já existentes” quando ainda não implementadas.

---

## 5. Regras obrigatórias para conteúdo público

### 5.1 Home, /sobre, /areas/, páginas de área, bios, autor e CTAs

Toda superfície pública deve respeitar a **Matriz Canônica Final de Superfícies Públicas**.

O agente não deve:

- reabrir a taxonomia por entusiasmo redacional;
- transformar repertório biográfico em menu principal;
- listar áreas em excesso na home;
- reinserir categorias satélite como eixo de posicionamento;
- usar headline promocional agressiva;
- usar CTA mercantilizado, apelativo ou artificialmente urgente.

### 5.2 Blog

O blog é ativo editorial de descoberta, aprofundamento, autoridade e conversão ética. Não é arquivo cronológico passivo nem repositório de volume.

Cada conteúdo deve nascer sabendo:

- a categoria canônica a que pertence;
- o hub, subhub ou família temática que reforça;
- a página estratégica que recebe ou distribui autoridade;
- o CTA compatível com o estágio do leitor;
- o destino central do ecossistema.

### 5.3 Portfólio institucional versus taxonomia editorial

O portfólio institucional pode ser mais amplo do que a taxonomia pública, mas essa amplitude **não autoriza** o agente a ampliar menus, categorias, rotas, headlines ou metadados estruturais.

Quando houver dúvida, usar o padrão mais seletivo e mais canônico.

---

## 6. Regras obrigatórias para design, UX e front-end

### 6.1 Estado atual da regra

Enquanto não houver documento mais específico e homologado para determinado detalhe visual ou funcional, o agente deve operar com **sobriedade conservadora**.

### 6.2 Padrões preferenciais

Preferir:

- visual clean;
- legibilidade alta;
- contraste suficiente;
- tipografia estável;
- espaçamento generoso;
- hierarquia clara;
- componentes reutilizáveis;
- baixo ruído visual;
- responsividade real;
- acessibilidade funcional.

### 6.3 O que evitar

Evitar, salvo instrução formal em contrário:

- efeitos chamativos sem função;
- excesso de cores de apoio;
- animações decorativas pesadas;
- variações visuais ad hoc;
- múltiplos padrões de card ou CTA para a mesma função;
- blocos que aparentem produto massificado ou marketing agressivo.

### 6.4 Regra de prudência quando faltar definição visual

Se o projeto ainda não tiver documento definitivo sobre design token, comportamento de componente ou funcionalidade específica, o agente deve:

1. adotar a solução mais simples, limpa e reversível;
2. documentar a lacuna;
3. evitar cristalizar no código uma decisão estética ainda controversa.

---

## 7. Regras obrigatórias para SEO, informação e arquitetura

### 7.1 SEO é consequência de arquitetura correta

Não usar SEO como justificativa para:

- inflar páginas;
- repetir palavras-chave mecanicamente;
- gerar posts órfãos;
- duplicar intenção de busca;
- criar slugs ou títulos em conflito com taxonomia canônica.

### 7.2 Toda página deve ter função dominante clara

Antes de criar ou alterar uma página, validar:

- intenção primária;
- papel da URL;
- categoria/hub correspondente;
- links internos principais;
- CTA compatível;
- risco de canibalização.

### 7.3 Autor e prova institucional

Quando aplicável, preservar estrutura que favoreça:

- autoria identificável;
- página do autor;
- dados estruturados compatíveis;
- coerência entre autor, conteúdo e superfície.

---

## 8. Regras obrigatórias para Markdown, frontmatter e CMS

### 8.1 Frontmatter canônico

Sempre que o projeto usar conteúdo baseado em Markdown/CMS, o agente deve respeitar o frontmatter canônico vigente. Não criar chaves novas sem necessidade clara e sem compatibilidade com collections, templates e renderização.

### 8.2 Naming e slugs

Usar nomenclatura consistente, previsível e estável. Evitar:

- slugs redundantes;
- títulos conflitantes com a taxonomia;
- nomes de arquivo vagos;
- variação arbitrária entre singular/plural, PT/EN ou formas duplicadas.

### 8.3 Migração e normalização

Ao migrar conteúdo legado, o agente deve priorizar:

- limpeza estrutural;
- preservação do que é útil;
- descarte do que é redundante;
- reclassificação do que é histórico;
- alinhamento ao frontmatter e à taxonomia atuais.

---

## 9. Regras obrigatórias para Instagram e demais canais derivados

### 9.1 Hierarquia de canais

No ecossistema PAVIE, a hierarquia funcional é:

1. **site institucional** — confiança, proposta de valor, serviço e conversão qualificada;
2. **blog jurídico** — descoberta, aprofundamento, autoridade e organização temática;
3. **Instagram** — reforço visual, síntese temática, atenção e retorno para ativos centrais;
4. **Facebook e demais canais** — distribuição complementar adaptada.

### 9.2 Regra central

O Instagram **não é fonte primária de taxonomia, posicionamento ou arquitetura do projeto**. Ele é canal derivado de distribuição e síntese.

### 9.3 O que o agente pode assumir desde já

Ao criar ou adaptar materiais para Instagram, o agente pode assumir apenas as regras já estabilizadas no acervo:

- design limpo;
- texto contido;
- clareza e sequência lógica;
- linguagem mais escaneável;
- foco em dor real e utilidade;
- apontamento para ativo central do ecossistema quando fizer sentido.

### 9.4 O que o agente não deve congelar no código ou na arquitetura central

Não transformar em regra rígida, sem documento específico posterior:

- cadência detalhada de posts;
- formatos obrigatórios por semana;
- estilo visual fino de carrosséis;
- estratégia de growth por hipótese não homologada;
- qualquer decisão que faça a estratégia de Instagram governar site, blog ou taxonomia.

---

## 10. Protocolo mínimo de trabalho do agente

### 10.1 Antes de editar

O agente deve:

1. ler os arquivos relevantes do escopo;
2. identificar a função dominante da alteração;
3. verificar se há componente, layout, taxonomia ou copy já existentes;
4. mapear riscos de conflito, regressão ou duplicação.

### 10.2 Durante a edição

O agente deve:

- preservar consistência visual e estrutural;
- comentar apenas quando isso melhorar manutenção;
- registrar impacto quando alterar arquitetura, rotas, schema, CMS, taxonomia, design token ou comportamento compartilhado;
- evitar mudanças colaterais não justificadas.

### 10.3 Antes de encerrar

O agente deve, na medida do possível:

- validar build, lint, typecheck ou testes configurados no projeto;
- revisar links internos afetados;
- revisar metadados e frontmatter afetados;
- conferir se a alteração manteve coerência com a Matriz Canônica e o Registro Mestre.

---

## 11. Critérios de aceitação mínimos

Uma tarefa só deve ser considerada bem executada quando, cumulativamente:

1. respeita a cadeia normativa do projeto;
2. não rompe a taxonomia nem a matriz pública canônica;
3. melhora ou preserva clareza, legibilidade e coerência;
4. evita duplicação estrutural desnecessária;
5. não cria promessa indevida nem generalismo artificial;
6. é compatível com manutenção futura;
7. deixa trilha suficiente para revisão humana.

---

## 12. Quando parar e sinalizar lacuna

O agente deve interromper a criatividade expansiva e **sinalizar lacuna documental**, em vez de improvisar solução definitiva, quando faltar definição sobre:

- design system fino ainda não homologado;
- funcionalidade estrutural controversa do site ou do blog;
- regra nova de taxonomia ou nova macroárea;
- regime detalhado de Instagram ou outro canal derivado;
- texto institucional sensível sem fonte canônica suficiente;
- política pública de privacidade, consentimento, honorários ou contratação ainda não fechada.

Nesses casos, a resposta correta é: **preservar o sistema, documentar a lacuna e propor solução reversível**.

---

## 13. Próxima camada recomendada de governança

Este `AGENTS.md` raiz é intencionalmente estável e mais abstrato. O projeto deverá, quando oportuno, ganhar arquivos mais específicos, por exemplo:

- `site/AGENTS.md` — layout, componentes, páginas estratégicas, schema, navegação;
- `blog/AGENTS.md` — frontmatter, coleções, templates de artigo, autoria, interlinking, revisão;
- `content/AGENTS.md` — workflow editorial, combos, redistribuição, métricas e poda;
- `social/AGENTS.md` — adaptação para Instagram/Facebook, formatos, reaproveitamento e limites;
- `legal-copy/AGENTS.md` — bios, CTAs, padrões de superfície pública e revisão sensível.

Até lá, este arquivo rege o projeto inteiro.

---

## 14. Fórmula final de interpretação

Na dúvida, o agente deve preferir a alternativa que seja ao mesmo tempo:

- mais coerente com o sistema;
- mais seletiva do ponto de vista institucional;
- mais clara para o usuário real;
- mais simples de manter;
- mais reversível;
- menos dependente de memória tácita;
- menos arriscada em termos éticos, reputacionais e arquitetônicos.
