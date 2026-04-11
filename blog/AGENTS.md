# AGENTS.md — Escopo `blog/`

## 1. Finalidade

Este arquivo rege a implementação e manutenção do blog da PAVIE, incluindo:

- coleção de posts;
- templates de artigo;
- páginas de categoria;
- listagens;
- frontmatter;
- interlinking;
- autoria;
- CTA editorial.

Ele complementa o `AGENTS.md` raiz e prevalece dentro deste escopo.

---

## 2. Fontes obrigatórias de leitura

Antes de editar qualquer arquivo do blog, o agente deve ler:

1. `../12.02_Arquitetura_Editorial_do_Blog_Juridico_da_PAVIE_Advocacia.md`
2. `../12.06_Governanca_de_Conteudo_Frontmatter_e_Migracao_do_Acervo_da_PAVIE_Advocacia.md`
3. `../13.05_Politica_de_Controle_de_Qualidade_Testes_e_Validacao_de_Entregas_da_PAVIE_Advocacia.md`

Se houver ajuste de copy pública sensível, ler também:

4. `../legal-copy/AGENTS.md`

---

## 3. Regras de taxonomia

O blog opera com 8 categorias canônicas, de CAT-01 a CAT-08, e nenhuma outra categoria-mãe.

Todo post deve possuir, obrigatoriamente:

- `categoryCode`;
- `contentType`;
- `readerStage`;
- `ctaType`;
- `ctaTarget`;
- `authorId`;
- status de revisão.

É vedado:

- publicar post sem categoria;
- usar tags como substitutas de categoria;
- criar rótulos concorrentes por conveniência.

---

## 4. Regras de template

Cada post deve conter, funcionalmente:

1. enquadramento da dor;
2. critérios jurídicos/documentais;
3. limites do texto;
4. encaminhamento ético.

Todo template deve prever:

- metadata;
- breadcrumb;
- bloco de autor;
- relação com área;
- CTA;
- relacionados.

---

## 5. Regras de interlinking

Cada post deve apontar para:

- uma página de área principal;
- pelo menos um conteúdo correlato;
- CTA compatível com o estágio do leitor.

Cada categoria deve acumular autoridade. Evitar posts órfãos.

---

## 6. Regras de migração

Ao migrar legado, o agente deve:

1. classificar;
2. podar;
3. normalizar slug;
4. reescrever o que estiver incompatível;
5. arquivar o que não sustentar o novo padrão.

Não migrar automaticamente conteúdos só porque já existem.

---

## 7. Regras de CTA

O CTA do blog deve orientar, não pressionar.

Evitar:

- urgência mercantilizada;
- “fale agora” agressivo;
- promessa de resolução;
- fecho vendedor.

---

## 8. Regras de autoria

A autoria deve ser identificável, coerente e controlada.

Não inventar:

- especialização não documentada;
- credenciais extras;
- experiência numérica;
- afirmações biográficas não comprovadas.

---

## 9. Critério de aceite

Uma alteração no blog só deve ser aprovada quando:

1. reforça a taxonomia;
2. melhora a legibilidade;
3. respeita a matriz pública;
4. mantém o frontmatter íntegro;
5. não cria duplicidade semântica.
