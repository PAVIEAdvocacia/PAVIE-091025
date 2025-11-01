# PAVIE | Blog Astro — /blog d

Este projeto cria um blog Astro publicado em **/blog** do domínio `https://pavieadvocacia.com.br`.

## Requisitos
- Node 18+
- NPM

## Instalação e build
```bash
cd blog
npm ci
npm run build
```

O resultado sairá em `blog/dist/`. Para a **Rota A (pré-build + commit)**, copie tudo que está dentro de `blog/dist/` para a pasta `/blog` na raiz do seu site estático (mesmo repositório do site institucional) e faça o commit. Ex.:

```
/<repo-raiz>
  /index.html (site institucional)
  /blog        <-- cole aqui o conteúdo de blog/dist/
    index.html
    /_astro/*
    /posts/hello-blog/index.html
```

## Ajustes
- GA4 já incluído no layout com o ID `G-M3GZYKFWZP`. Se desejar alterar, edite em `src/layouts/BaseLayout.astro`.
- O `astro.config.mjs` define `site` e `base: "/blog"` e integra sitemap (`@astrojs/sitemap`).

## Desenvolvimento
```bash
npm run dev
```

Abra http://localhost:4321/blog/

## Estrutura
- `src/layouts/BaseLayout.astro` — head padrão (meta, canonical, GA4).
- `src/pages/index.astro` — lista de posts (exemplo simples).
- `src/pages/posts/hello-blog.md` — post exemplo com JSON-LD (BlogPosting).