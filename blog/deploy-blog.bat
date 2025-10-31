@echo off
REM deploy-blog.bat — Build Astro blog and copy to site root /blog (Windows CMD)
REM Usage: double-click after adjusting the paths below if needed.

REM --- Adjust only if your local paths change ---
SET SRC="C:\Users\Fabio ESTUDO\Desktop\Obsidian\3. Recursos (Materiais de suporte e interesse geral)\70 - 79 IA\71 - PAVIE Advocacia\Site\PAVIE-091025\blog\dist\blog"
SET DEST="C:\Users\Fabio ESTUDO\Desktop\Obsidian\3. Recursos (Materiais de suporte e interesse geral)\70 - 79 IA\71 - PAVIE Advocacia\Site\PAVIE-091025\blog"

REM Optional: build before copy (uncomment to run):
REM pushd "C:\Users\Fabio ESTUDO\Desktop\Obsidian\3. Recursos (Materiais de suporte e interesse geral)\70 - 79 IA\71 - PAVIE Advocacia\Site\PAVIE-091025\blog"
REM call npm install
REM call npx astro clean
REM call npm run build
REM popd

echo.
echo Copying from:
echo   %SRC%
echo to:
echo   %DEST%
echo.

REM Create destination folder if missing
if not exist %DEST% mkdir %DEST%

REM Mirror dist\blog -> site\blog with fewer retries and quick backoff
robocopy %SRC% %DEST% /MIR /NFL /NDL /NJH /NJS /R:1 /W:1
set RC=%ERRORLEVEL%

echo.
echo Robocopy exit code: %RC%
echo (0,1 are success; 2-7 are OK with extra info; >7 indicates a failure)
echo.

pause
