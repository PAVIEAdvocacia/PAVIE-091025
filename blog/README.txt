PAVIE | Advocacia — Deploy Local do Blog (Astro → pasta /blog do site)

O que estes arquivos fazem
1) deploy-blog.bat    → Script para CMD/Prompt de Comando (usa ROBOCOPY).
2) deploy-blog.ps1    → Script para PowerShell (usa Copy-Item).
3) Ajuste apenas os caminhos SRC (origem) e DEST (destino) se mover suas pastas.

Passo a passo recomendado (seguro e repetível)
A) No diretório do projeto do blog (…\PAVIE-091025\blog):
   - npm install
   - npx astro clean
   - npm run build   → vai gerar dist\blog\

B) Execute UM dos scripts:
   - CMD:  dê duplo‑clique em deploy-blog.bat
   - PowerShell: clique com o botão direito no deploy-blog.ps1 → “Run with PowerShell”
     (Se o Windows bloquear, execute:  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned)

C) Verifique se foi criado/atualizado:
   …\Site\PAVIE-091025\blog\index.html
   …\Site\PAVIE-091025\blog\<posts>, /tags, /categorias, etc.

D) Faça o deploy do site estático via Cloudflare Pages/Git (como você já faz).
   Dica: depois do deploy, limpe o cache do Cloudflare (“Purge everything” ou o caminho /blog/*).

Sinais de que deu certo
- /blog/ abre a listagem do blog.
- /blog/<slug>/ abre a página do post.
- O RSS em /blog/rss.xml responde com o feed.

Se algo falhar
- Feche VS Code/Explorer para liberar locks na pasta destino.
- Rode o PowerShell como Administrador e use o deploy-blog.ps1 (evita erros EPERM/ACCESS DENIED).
- Confirme que astro.config.mjs tem:  base: '/blog/',  output: 'static',  site: 'https://pavieadvocacia.com.br'
- Confirme que existe a pasta destino: …\Site\PAVIE-091025\blog\
- No Cloudflare Pages, certifique-se de que o conteúdo /blog/ está no artefato publicado.
