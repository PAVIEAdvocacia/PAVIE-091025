@echo off
cd /d "C:\Users\Fabio ESTUDO\Desktop\Obsidian\3. Recursos (Materiais de suporte e interesse geral)\70 - 79 IA\71 - PAVIE Advocacia\Site\PAVIE-091025\blog"

echo Corrigindo o Decap CMS com configuração inline e coleção única...
echo ^<!doctype html^> > public\admin\index.html
echo ^<html lang='pt-br'^> >> public\admin\index.html
echo ^<head^> >> public\admin\index.html
echo   ^<meta charset='utf-8'^> >> public\admin\index.html
echo   ^<meta name='viewport' content='width=device-width, initial-scale=1'^> >> public\admin\index.html
echo   ^<title^>Admin — PAVIE ^| Advocacia^</title^> >> public\admin\index.html
echo ^</head^> >> public\admin\index.html
echo ^<body^> >> public\admin\index.html
echo   ^<script^>window.CMS_MANUAL_INIT = true;^</script^> >> public\admin\index.html
echo   ^<script src='https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js'^>^</script^> >> public\admin\index.html
echo   ^<script^> >> public\admin\index.html
echo     CMS.init({ >> public\admin\index.html
echo       config: { >> public\admin\index.html
echo         backend: { >> public\admin\index.html
echo           name: 'github', >> public\admin\index.html
echo           repo: 'PAVIEAdvocacia/PAVIE-091025', >> public\admin\index.html
echo           branch: 'main', >> public\admin\index.html
echo           base_url: 'https://blog.pavieadvocacia.com.br', >> public\admin\index.html
echo           auth_endpoint: '/api/auth/github-oauth' >> public\admin\index.html
echo         }, >> public\admin\index.html
echo         site_url: 'https://blog.pavieadvocacia.com.br', >> public\admin\index.html
echo         logo_url: 'https://pavieadvocacia.com.br/assets/logo.png', >> public\admin\index.html
echo         locale: 'pt', >> public\admin\index.html
echo         publish_mode: 'editorial_workflow', >> public\admin\index.html
echo         media_folder: 'blog/public/uploads', >> public\admin\index.html
echo         public_folder: '/blog/uploads', >> public\admin\index.html
echo         collections: [ >> public\admin\index.html
echo           { >> public\admin\index.html
echo             name: 'posts', >> public\admin\index.html
echo             label: 'Artigos', >> public\admin\index.html
echo             folder: 'blog/src/content/posts', >> public\admin\index.html
echo             create: true, >> public\admin\index.html
echo             slug: '{{year}}-{{month}}-{{day}}-{{slug}}', >> public\admin\index.html
echo             preview_path: 'blog/{{slug}}/', >> public\admin\index.html
echo             editor: { preview: true }, >> public\admin\index.html
echo             fields: [ >> public\admin\index.html
echo               { label: 'Título', name: 'title', widget: 'string' }, >> public\admin\index.html
echo               { label: 'Data', name: 'pubDate', widget: 'datetime', format: 'YYYY-MM-DD' }, >> public\admin\index.html
echo               { label: 'Resumo', name: 'description', widget: 'text', hint: '≤ 155 caracteres' }, >> public\admin\index.html
echo               { label: 'Autor', name: 'author', widget: 'string', default: 'PAVIE ^| Advocacia' }, >> public\admin\index.html
echo               { label: 'Tipo', name: 'type', widget: 'select', options: ['autoridade','guia','jurisprudencia','noticia','opiniao'] }, >> public\admin\index.html
echo               { label: 'Tags', name: 'tags', widget: 'list', default: ['Sucessões ^& Inventário'] }, >> public\admin\index.html
echo               { >> public\admin\index.html
echo                 label: 'Imagem de capa', >> public\admin\index.html
echo                 name: 'cover', >> public\admin\index.html
echo                 widget: 'object', >> public\admin\index.html
echo                 fields: [ >> public\admin\index.html
echo                   { label: 'Arquivo', name: 'src', widget: 'image' }, >> public\admin\index.html
echo                   { label: 'Alt (acessível)', name: 'alt', widget: 'string' } >> public\admin\index.html
echo                 ] >> public\admin\index.html
echo               }, >> public\admin\index.html
echo               { label: 'Canonical (opcional)', name: 'canonical', widget: 'string', required: false }, >> public\admin\index.html
echo               { label: 'Noindex', name: 'noindex', widget: 'boolean', default: false, required: false }, >> public\admin\index.html
echo               { label: 'Corpo', name: 'body', widget: 'markdown' } >> public\admin\index.html
echo             ] >> public\admin\index.html
echo           } >> public\admin\index.html
echo         ] >> public\admin\index.html
echo       } >> public\admin\index.html
echo     }); >> public\admin\index.html
echo   ^</script^> >> public\admin\index.html
echo ^</body^> >> public\admin\index.html
echo ^</html^> >> public\admin\index.html

echo.
echo ✅ CONFIGURAÇÃO INLINE CORRIGIDA (coleção única)!
echo.
echo Agora verifique a configuração do OAuth no GitHub:
echo 1. URL de callback deve ser: https://blog.pavieadvocacia.com.br/api/auth/github-oauth/callback
echo.
echo E as variáveis de ambiente no Cloudflare Pages:
echo - GITHUB_CLIENT_ID: ov311kkw1x2wt8uu1isp
echo - GITHUB_CLIENT_SECRET: (deve ser o segredo correto)
echo.
echo Commit e push:
echo git add public/admin/index.html
echo git commit -m "fix: decap cms inline config with unique collection"
echo git push
pause