\
    @echo off
    REM copy_blog_dist_to_site.bat — PAVIE | Advocacia
    REM Objetivo: copiar o build estático do Astro (dist/blog) para a pasta /blog do site raiz.
    REM Requisitos: gerar o build antes (npm run build) dentro do projeto do blog.

    REM >>> EDITAR estes caminhos conforme sua máquina:
    set "BLOG_DIST=C:\Users\Fabio ESTUDO\Desktop\Obsidian\3. Recursos (Materiais de suporte e interesse geral)\70 - 79 IA\71 - PAVIE Advocacia\Site\PAVIE-091025\blog\dist\blog"
    set "SITE_ROOT=C:\Users\Fabio ESTUDO\Desktop\Obsidian\3. Recursos (Materiais de suporte e interesse geral)\70 - 79 IA\71 - PAVIE Advocacia\Site\PAVIE-091025"

    echo.
    echo === Copiando build do BLOG para o SITE ===
    echo FROM: %BLOG_DIST%
    echo   TO: %SITE_ROOT%\blog
    echo.

    if not exist "%BLOG_DIST%" (
      echo ERRO: pasta do build nao encontrada: "%BLOG_DIST%"
      echo Gere o build com: npm run build
      exit /b 1
    )

    if not exist "%SITE_ROOT%" (
      echo ERRO: pasta do site nao encontrada: "%SITE_ROOT%"
      exit /b 1
    )

    REM /MIR espelha (apaga o que não existe mais no origem)
    robocopy "%BLOG_DIST%" "%SITE_ROOT%\blog" /MIR /NFL /NDL /NJH /NJS /NP
    set err=%ERRORLEVEL%

    if %err% GEQ 8 (
      echo.
      echo ROBOTE ^(robocopy^) retornou erro %err%.
      exit /b %err%
    )

    echo.
    echo OK! Conteudo publicado em "%SITE_ROOT%\blog".
    echo Commit/Push para o Cloudflare Pages publicar.
    exit /b 0
