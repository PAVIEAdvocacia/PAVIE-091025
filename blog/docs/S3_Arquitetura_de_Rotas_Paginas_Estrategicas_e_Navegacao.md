# Sprint S3 — Arquitetura de Rotas, Páginas Estratégicas e Navegação

## Objetivo

Transformar o domínio atual em arquitetura pública coerente com a taxonomia canônica, sem criar caos de URLs, páginas órfãs ou sobreposição de intenção.

---

## Resultado esperado

Ao fim da S3, o site/blog deve possuir esqueleto navegável claro, com rotas centrais estáveis e conexão explícita entre home, `/areas/`, páginas de área, `/blog/`, categorias, autor e contato.

---

## Escopo obrigatório

### 1. Normalizar rotas centrais
Garantir existência ou refatoração de:

- `/`
- `/sobre/`
- `/areas/`
- `/areas/[slug]/`
- `/blog/`
- `/blog/[slug]/` ou estratégia compatível com o padrão público já existente
- `/blog/areas/[category]/`
- `/autor/[slug]/`

Opcional nesta fase, se já existir valor real:
- `/blog/temas/[tag]/`
- `/contato/`

### 2. Reconciliar menu atual com arquitetura canônica
O menu público hoje ainda expõe camadas intermediárias (`Áreas de Atuação`, `Publicações`, `Áreas do Blog`, `Temas`, `Contato`). Esta sprint deve:

- auditar se esses rótulos continuam úteis;
- consolidar nomes redundantes quando necessário;
- preservar previsibilidade do usuário;
- não superlotar navegação;
- diferenciar navegação institucional de descoberta editorial.

### 3. Implementar páginas de área a partir da coleção `areas`
Cada página de área deve ser gerada por dado estruturado e obedecer ao rótulo canônico.

### 4. Implementar listagens do blog
No mínimo:

- home do blog com destaque + lista recente;
- listagem por categoria canônica;
- relação clara entre post e área;
- página do autor.

### 5. Preparar interlinking estrutural
Garantir que:

- home aponte para áreas e blog;
- áreas apontem para posts correspondentes;
- posts apontem para área principal e correlatos;
- autor aponte para posts/autoria.

---

## Adaptação ao repositório real

Como o site em produção já apresenta home institucional e home do blog com estrutura funcional, esta sprint deve ser tratada como **refactor arquitetural guiado**, não como greenfield.

Você deve auditar:

1. quais rotas já existem e podem ser reaproveitadas;
2. quais labels atuais conflitam com a camada canônica;
3. quais URLs já recebem ou podem receber tráfego e precisam de preservação/redirect.

Se a rota atual de artigo for date-prefixed e funcional, não a destrua nesta sprint sem plano explícito aprovado.

---

## Entregáveis obrigatórios

1. rotas centrais criadas ou estabilizadas;
2. `/areas/` gerada a partir das 7 áreas canônicas;
3. páginas dinâmicas ou estaticamente geradas para áreas e autor;
4. `/blog/` e categorias conectadas ao novo content model;
5. nota curta de arquitetura de rotas e redirects necessários.

---

## Restrições

Você **não pode**:

1. criar páginas estratégicas aleatórias fora da governança;
2. multiplicar landing pages por ansiedade de SEO;
3. deixar páginas órfãs;
4. mudar rótulos públicos sem explicar impacto;
5. quebrar links internos antigos sem mapear substituição.

---

## Critérios de aceite

- [ ] rotas centrais funcionando
- [ ] `/areas/` alinhada às 7 categorias canônicas
- [ ] `/blog/` consumindo a collection correta
- [ ] posts, áreas e autor interligados
- [ ] nenhum crescimento desordenado de URLs

---

## Prompt pronto para Codex

```text
Sprint S3. Leia AGENTS.md raiz, site/AGENTS.md, blog/AGENTS.md, 12.02, 12.06 e 13.05. Refatore a arquitetura pública do repositório real do blog.pavieadvocacia.com.br para alinhá-la à taxonomia canônica da PAVIE. Normalize as rotas principais (`/`, `/sobre/`, `/areas/`, `/areas/[slug]/`, `/blog/`, categorias do blog, autor), preserve o que já funciona em produção, documente qualquer mudança de URL e não crie páginas órfãs nem landing pages arbitrárias. Trabalhe como refactor guiado, não como rebuild cego.
```
