@echo off
cd /d "C:\Users\Fabio ESTUDO\Desktop\Obsidian\3. Recursos (Materiais de suporte e interesse geral)\70 - 79 IA\71 - PAVIE Advocacia\Site\PAVIE-091025\blog"

echo Corrigindo admin/config.yml...
echo backend: > admin\config.yml
echo   name: github >> admin\config.yml
echo   repo: PAVIEAdvocacia/PAVIE-091025 >> admin\config.yml
echo   branch: main >> admin\config.yml
echo   base_url: https://blog.pavieadvocacia.com.br >> admin\config.yml
echo   auth_endpoint: /api/auth/github-oauth >> admin\config.yml
echo. >> admin\config.yml
echo site_url: https://blog.pavieadvocacia.com.br >> admin\config.yml
echo logo_url: https://pavieadvocacia.com.br/assets/logo.png >> admin\config.yml
echo locale: pt >> admin\config.yml
echo publish_mode: editorial_workflow >> admin\config.yml
echo. >> admin\config.yml
echo media_folder: "blog/public/uploads" >> admin\config.yml
echo public_folder: "/blog/uploads" >> admin\config.yml
echo. >> admin\config.yml
echo collections: >> admin\config.yml
echo   - name: posts >> admin\config.yml
echo     label: Artigos >> admin\config.yml
echo     folder: "blog/src/content/posts" >> admin\config.yml
echo     create: true >> admin\config.yml
echo     slug: "{{year}}-{{month}}-{{day}}-{{slug}}" >> admin\config.yml
echo     preview_path: "blog/{{slug}}/" >> admin\config.yml
echo     editor: >> admin\config.yml
echo       preview: true >> admin\config.yml
echo     fields: >> admin\config.yml
echo       - { label: "Título", name: "title", widget: "string" } >> admin\config.yml
echo       - { label: "Data", name: "pubDate", widget: "datetime", format: "YYYY-MM-DD" } >> admin\config.yml
echo       - { label: "Resumo", name: "description", widget: "text", hint: "≤ 155 caracteres" } >> admin\config.yml
echo       - { label: "Autor", name: "author", widget: "string", default: "PAVIE ^| Advocacia" } >> admin\config.yml
echo       - { label: "Tipo", name: "type", widget: "select", options: ["autoridade","guia","jurisprudencia","noticia","opiniao"] } >> admin\config.yml
echo       - { label: "Tags", name: "tags", widget: "list", default: ["Sucessões ^& Inventário"] } >> admin\config.yml
echo       - label: "Imagem de capa" >> admin\config.yml
echo         name: "cover" >> admin\config.yml
echo         widget: "object" >> admin\config.yml
echo         fields: >> admin\config.yml
echo           - { label: "Arquivo", name: "src", widget: "image" } >> admin\config.yml
echo           - { label: "Alt (acessível)", name: "alt", widget: "string" } >> admin\config.yml
echo       - { label: "Canonical (opcional)", name: "canonical", widget: "string", required: false } >> admin\config.yml
echo       - { label: "Noindex", name: "noindex", widget: "boolean", default: false, required: false } >> admin\config.yml
echo       - { label: "Corpo", name: "body", widget: "markdown" } >> admin\config.yml

echo.
echo ✅ CONFIG.YML CRIADO!
echo.
echo Agora faça:
echo git add admin/config.yml
echo git commit -m "feat: add decap cms config with collections"
echo git push
echo.
echo Depois acesse: https://blog.pavieadvocacia.com.br/admin
pause