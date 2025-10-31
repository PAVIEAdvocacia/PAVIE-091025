# PAVIE | Blog em Astro (/blog)

## Como rodar local
```bash
npm install
npm run dev
```
Abra o endereço impresso no terminal (geralmente http://localhost:4321/blog/).

## Build
```bash
npm run build
```
Saída em `dist/` (publicar como /blog no seu site/Pages).

## Estrutura
- `src/content/blog/*.md` — posts
- `src/pages/blog/` — roteamento
- `src/layouts/Post.astro` — layout de artigo
- `src/components/` — componentes
- `src/styles/global.css` — estilos básicos
