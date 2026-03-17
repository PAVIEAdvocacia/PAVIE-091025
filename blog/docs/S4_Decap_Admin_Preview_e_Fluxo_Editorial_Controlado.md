# Sprint S4 — Decap Admin, Preview e Fluxo Editorial Controlado

## Objetivo

Fazer o Decap CMS deixar de ser um editor solto de Markdown e passar a ser uma interface de operação editorial coerente com a governança da PAVIE.

---

## Resultado esperado

Ao fim da S4, o projeto deve permitir criação e edição controlada de conteúdo estratégico sem romper taxonomia, frontmatter, autoria e CTA.

---

## Escopo obrigatório

### 1. Implementar ou refatorar `public/admin/config.yml`
Criar collections mínimas para:

- `posts`
- `areas`
- `authors`

### 2. Campos controlados do Decap
No mínimo:

- `categoryCode` como select controlado;
- `contentType` como select;
- `readerStage` como select;
- `ctaType` e `ctaTarget` como campos controlados;
- `reviewStatus`;
- `authorId`;
- `slug`;
- `publishDate`;
- campos de SEO;
- campos de imagem/capa, quando existirem.

### 3. Fluxo editorial mínimo
Garantir que o CMS favoreça:

- criação de post válido;
- edição de página de área;
- edição do perfil do autor;
- revisão humana posterior.

### 4. Preview editorial inicial
Implementar preview apenas se houver benefício real e baixo custo. Se não houver, documentar o motivo e deixar gancho limpo para fase posterior.

### 5. Guardrails de operação
Sempre que possível, impedir pelo CMS:

- categoria inválida;
- autor inexistente;
- slug duplicado;
- ausência de campos essenciais.

---

## Adaptação ao repositório real

Se já existir admin/CMS em produção ou no repositório:

1. não reescreva sem antes comparar;
2. preserve o que já funciona;
3. refatore campos livres demais;
4. elimine inconsistências entre o CMS e o schema do Astro;
5. documente quebra de compatibilidade, se inevitável.

---

## Entregáveis obrigatórios

1. `public/admin/config.yml` funcional;
2. collections coerentes com `src/content/config.ts`;
3. ao menos um fluxo de criação/edição de post validado;
4. edição controlada de `areas` e `authors`;
5. documento curto `CMS_OPERACAO.md` explicando o uso mínimo.

---

## Restrições

Você **não pode**:

1. deixar campos críticos em texto livre sem necessidade;
2. permitir criação de área fora do conjunto canônico;
3. usar o CMS para reabrir a taxonomia;
4. quebrar o build por desacoplamento entre config do Decap e schemas do Astro.

---

## Critérios de aceite

- [ ] Decap acessível e funcional
- [ ] collections coerentes com os schemas do projeto
- [ ] criação/edição de post válida
- [ ] edição de áreas/autores sob controle
- [ ] documentação mínima de operação entregue

---

## Prompt pronto para Codex

```text
Sprint S4. Leia AGENTS.md raiz, blog/AGENTS.md, 12.06 e 13.05. Implemente ou refatore o Decap admin do repositório real do blog.pavieadvocacia.com.br para operar com collections controladas (`posts`, `areas`, `authors`) e campos compatíveis com o schema canônico do Astro. Preserve compatibilidade com o que já existir, elimine campos livres excessivos, não reabra a taxonomia e documente qualquer impacto estrutural no fluxo editorial.
```
