# Sprint S6 — QA Final, SEO Estrutural, Redirects, Documentação e Fechamento

## Objetivo

Fechar a implantação com critérios objetivos de aceite, garantindo que o sistema não apenas “funcione”, mas esteja pronto para revisão humana final, deploy controlado e operação contínua.

---

## Resultado esperado

Ao fim da S6, o repositório deve estar em condição de:

1. buildar sem erro;
2. expor rotas públicas coerentes;
3. manter collections válidas;
4. operar com metadata e SEO estrutural mínimos;
5. publicar com checklist claro;
6. ser mantido sem depender de memória difusa.

---

## Escopo obrigatório

### 1. QA técnico
Executar, na medida do possível:

- build;
- checagem de collections;
- validação de imports/rotas quebradas;
- checagem de links internos principais;
- checagem de slugs duplicados;
- checagem das páginas públicas críticas.

### 2. SEO estrutural mínimo
Validar:

- `title` e `description` consistentes;
- canonical correta;
- breadcrumbs coerentes;
- sitemap compatível com as rotas canônicas;
- RSS, se aplicável;
- `Organization`, `Article/BlogPosting`, `BreadcrumbList` onde fizer sentido.

### 3. Redirects e canonicals
Conferir se:

- toda mudança pública relevante tem tratamento;
- não há competição entre URL velha e nova;
- links internos apontam para a versão preferencial.

### 4. Documentação mínima de manutenção
Entregar, no mínimo:

- `README_REPO_OPERACIONAL.md` ou equivalente;
- `PUBLICATION_CHECKLIST.md`;
- resumo do fluxo Decap → revisão humana → deploy;
- lista objetiva das pendências não resolvidas.

### 5. Fechamento operacional
Registrar:

- o que ficou pronto;
- o que ficou condicionado;
- o que ainda depende de decisão do advogado;
- o que pode entrar no backlog de evolução posterior.

---

## Adaptação ao repositório real

Como o domínio já está publicado, esta sprint deve olhar o projeto como sistema vivo. Isso significa:

1. conferir se a arquitetura nova não rompeu o comportamento esperado das rotas já conhecidas;
2. conferir se o blog home e a home institucional ainda mantêm coerência entre si;
3. conferir se a navegação pública ficou mais clara do que antes;
4. conferir se o CMS não ficou “tecnicamente certo”, porém operacionalmente hostil.

---

## Entregáveis obrigatórios

1. build validado;
2. checklist final preenchido ou equivalente;
3. mapa final de redirects/canonicals;
4. documentação operacional curta;
5. relatório de fechamento da sprint com riscos residuais.

---

## Restrições

Você **não pode**:

1. chamar de concluído o que ainda depende de revisão humana sensível;
2. mascarar erro estrutural com `noindex` improvisado;
3. deixar mudança pública sem trilha documental mínima;
4. omitir pendências conhecidas.

---

## Critérios de aceite

- [ ] build sem erro
- [ ] rotas críticas funcionando
- [ ] metadata/canonicals/breadcrumbs coerentes
- [ ] redirects tratados
- [ ] Decap operacional
- [ ] documentação mínima entregue
- [ ] pendências e riscos residuais explicitados

---

## Prompt pronto para Codex

```text
Sprint S6. Leia AGENTS.md raiz, 13.05 e a documentação criada nas sprints anteriores. Execute o fechamento técnico e operacional do repositório real do blog.pavieadvocacia.com.br: QA de build/rotas/collections, conferência de links internos, canonicalização, sitemap, breadcrumbs, schema mínimo, redirects e documentação curta de manutenção. Não esconda pendências. Entregue um relatório final objetivo com o que está pronto, o que depende de revisão humana e o que deve entrar no backlog posterior.
```
