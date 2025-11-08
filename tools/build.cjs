diff --git a/tools/build.js b/tools/build.js
index 5ffa8e1bd17112ebd7d39d83cc7e320288d4e534..f7721b146b92c37ed9b4202780c54352f5995a51 100644
--- a/tools/build.js
+++ b/tools/build.js
@@ -1,32 +1,42 @@
 const { execSync } = require('node:child_process');
 const { existsSync, rmSync, mkdirSync, cpSync, readdirSync, statSync } = require('node:fs');
 const { resolve, join } = require('node:path');
 const ROOT = resolve(__dirname, '..');
 const OUT = resolve(ROOT, 'pages_out');
 const BLOG_DIR = resolve(ROOT, 'blog');
 const BLOG_DIST = resolve(BLOG_DIR, 'dist');
 const IGNORES = new Set(['.git', '.github', 'node_modules', 'pages_out', 'blog']);
 function copyDir(src, dst) {
   if (!existsSync(dst)) mkdirSync(dst, { recursive: true });
   for (const name of readdirSync(src)) {
     if (IGNORES.has(name)) continue;
     const from = join(src, name);
     const to = join(dst, name);
     const st = statSync(from);
     if (st.isDirectory()) copyDir(from, to);
     else cpSync(from, to);
   }
 }
 console.log('> Limpando pages_out/…');
 if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
 mkdirSync(OUT, { recursive: true });
 console.log('> Copiando site estático da raiz para pages_out/…');
 copyDir(ROOT, OUT);
+const useInstall = !existsSync(join(BLOG_DIR, 'package-lock.json'));
+const installCmd = useInstall ? 'npm install' : 'npm ci';
+console.log(`> Dependências do blog (${installCmd})…`);
+execSync(installCmd, { cwd: BLOG_DIR, stdio: 'inherit' });
+
 console.log('> Build do blog Astro…');
-execSync('npm ci', { cwd: BLOG_DIR, stdio: 'inherit' });
 execSync('npm run build', { cwd: BLOG_DIR, stdio: 'inherit' });
-console.log('> Copiando blog/dist para pages_out/blog …');
+
+console.log('> Copiando blog/dist/blog para pages_out/blog …');
 const BLOG_OUT = resolve(OUT, 'blog');
 mkdirSync(BLOG_OUT, { recursive: true });
-cpSync(BLOG_DIST, BLOG_OUT, { recursive: true });
-console.log('✓ Empacotamento concluído. Saída: pages_out/');
\ No newline at end of file
+const BLOG_DIST_BLOG = resolve(BLOG_DIST, 'blog');
+if (!existsSync(BLOG_DIST_BLOG)) {
+  throw new Error('Saída blog/dist/blog não encontrada. Execute "npm run build" em blog/.');
+}
+copyDir(BLOG_DIST_BLOG, BLOG_OUT);
+
+console.log('✓ Empacotamento concluído. Saída: pages_out/');
