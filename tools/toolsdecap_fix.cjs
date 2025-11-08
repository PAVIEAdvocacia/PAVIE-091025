diff --git a/tools/decap_fix.cjs b/tools/decap_fix.cjs
new file mode 100644
index 0000000000000000000000000000000000000000..c41cddb7dcc1a74a32a22816049f61ab9a6937fd
--- /dev/null
+++ b/tools/decap_fix.cjs
@@ -0,0 +1,235 @@
+#!/usr/bin/env node
+/*
+ * tools/decap_fix.cjs
+ * Corrige automaticamente divergências entre o CMS Decap,
+ * o projeto Astro e o empacotamento do Cloudflare Pages.
+ */
+
+const { existsSync, readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync, statSync } = require('node:fs');
+const { resolve, join, basename } = require('node:path');
+
+const ROOT = resolve(__dirname, '..');
+const BLOG_ROOT = join(ROOT, 'blog');
+const BLOG_CONTENT = join(BLOG_ROOT, 'src', 'content');
+
+const ADMIN_REDIRECT_TEMPLATE = `<!doctype html>
+<html lang="pt-BR">
+  <head>
+    <meta charset="utf-8" />
+    <title>Redirecionando…</title>
+    <meta http-equiv="refresh" content="0; url=/blog/admin/" />
+    <link rel="canonical" href="/blog/admin/" />
+    <script>window.location.replace('/blog/admin/');</script>
+  </head>
+  <body>
+    <p>Redirecionando para <a href="/blog/admin/">/blog/admin/</a>…</p>
+  </body>
+</html>
+`;
+
+let changes = 0;
+
+function log(msg) {
+  console.log(`- ${msg}`);
+}
+
+function writeIfChanged(file, next) {
+  const current = existsSync(file) ? readFileSync(file, 'utf8') : null;
+  if (current === next) return false;
+  writeFileSync(file, next, 'utf8');
+  changes += 1;
+  log(`Atualizado ${file.replace(ROOT + '/', '')}`);
+  return true;
+}
+
+function normalizeBlogPackage() {
+  const pkgPath = join(BLOG_ROOT, 'package.json');
+  if (!existsSync(pkgPath)) return;
+  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
+  if (pkg.dependencies && pkg.dependencies['astro-redirects']) {
+    delete pkg.dependencies['astro-redirects'];
+  }
+  if (pkg.dependencies && Object.keys(pkg.dependencies).length === 0) {
+    delete pkg.dependencies;
+  }
+  const next = JSON.stringify(pkg, null, 2) + '\n';
+  writeIfChanged(pkgPath, next);
+}
+
+function ensureAdminRedirectPage() {
+  const file = join(BLOG_ROOT, 'src', 'pages', 'admin.astro');
+  if (!existsSync(file)) return;
+  const current = readFileSync(file, 'utf8');
+  let next = current.replace('/blog/public/admin/', '/blog/admin/');
+  if (!next.trim().startsWith('<!doctype html>')) {
+    next = ADMIN_REDIRECT_TEMPLATE;
+  }
+  writeIfChanged(file, next);
+}
+
+function patchConfigYaml() {
+  const file = join(BLOG_ROOT, 'public', 'admin', 'config.yml');
+  if (!existsSync(file)) return;
+  let yaml = readFileSync(file, 'utf8');
+  yaml = yaml.replace(/auth_endpoint:\s*.+/g, 'auth_endpoint: /api/auth/github-oauth');
+  yaml = yaml.replace(/folder:\s*"?src\/content\/posts"?/g, 'folder: "src/content/blog"');
+  yaml = yaml.replace(/name:\s*"?pubDate"?/g, 'name: "date"');
+  yaml = yaml.replace(
+    /- \{ label: "Categoria", name: "category", widget: "select", options: \[[^\]]+\] \}/,
+    '- { label: "Tags", name: "tags", widget: "select", options: ["Inventário", "Família", "Internacional", "Imobiliário", "Contratos", "Consumidor", "Tributário"], multiple: true, default: [] }'
+  );
+  if (!/name:\s*"date"/.test(yaml)) {
+    yaml = yaml.replace(/fields:\s*\[/, 'fields: [\n      - { label: "Data", name: "date", widget: "datetime" },');
+  }
+  writeIfChanged(file, yaml);
+}
+
+function patchAdminBootstrap() {
+  const file = join(BLOG_ROOT, 'public', 'admin', 'index.html');
+  if (!existsSync(file)) return;
+  let html = readFileSync(file, 'utf8');
+  html = html.replace(/auth_endpoint:\s*"?(?:\/auth\/github|\/api\/github-oauth)"?/g, 'auth_endpoint: "/api/auth/github-oauth"');
+  html = html.replace(/folder:\s*"src\/content\/posts"/g, 'folder: "src/content/blog"');
+  html = html.replace(/name:\s*"pubDate"/g, 'name: "date"');
+  html = html.replace(
+    /\{\s*label: "Categoria",[\s\S]*?options: \[[^\]]+\][\s\S]*?\}/,
+    `                {
+                  label: "Tags",
+                  name: "tags",
+                  widget: "select",
+                  options: ["Inventário", "Família", "Internacional", "Imobiliário", "Contratos", "Consumidor", "Tributário"],
+                  multiple: true,
+                  default: []
+                },`
+  );
+  writeIfChanged(file, html);
+}
+
+function patchBuildScript() {
+  const file = join(ROOT, 'tools', 'build.cjs');
+  if (!existsSync(file)) return;
+  let script = readFileSync(file, 'utf8');
+  if (script.includes('cpSync(BLOG_DIST, BLOG_OUT')) {
+    script = script.replace(
+      /console\.log\('> Copiando blog\/dist para pages_out\/blog …'\);[\s\S]*?cpSync\(BLOG_DIST, BLOG_OUT, \{ recursive: true \}\);/,
+      `console.log('> Copiando blog/dist/blog para pages_out/blog …');\nconst BLOG_OUT = resolve(OUT, 'blog');\nmkdirSync(BLOG_OUT, { recursive: true });\nconst BLOG_DIST_BLOG = resolve(BLOG_DIST, 'blog');\nif (!existsSync(BLOG_DIST_BLOG)) {\n  throw new Error('Saída blog/dist/blog não encontrada. Execute "npm run build" em blog/.');\n}\ncopyDir(BLOG_DIST_BLOG, BLOG_OUT);`
+    );
+    writeIfChanged(file, script);
+  }
+}
+
+function normalizeFrontMatter(content) {
+  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*/);
+  if (!fmMatch) return { changed: false, output: content };
+  let front = fmMatch[1].replace(/\r\n/g, '\n');
+  let body = content.slice(fmMatch[0].length);
+
+  front = front.replace(/\bpubDate\b/g, 'date');
+  front = front.replace(/\\\[/g, '[').replace(/\\\]/g, ']');
+
+  if (/^\s*excerpt\s*:/m.test(front)) {
+    if (!/^\s*description\s*:/m.test(front)) {
+      front = front.replace(/^\s*excerpt\s*:/m, 'description:');
+    } else {
+      front = front.replace(/^\s*excerpt\s*:.*\n?/m, '');
+    }
+  }
+
+  if (!/^\s*description\s*:/m.test(front)) {
+    front = front.replace(/(title:\s*[^\n]+\n)/, `$1description: ""\n`);
+  }
+
+  if (/^\s*category\s*:/m.test(front)) {
+    if (!/^\s*tags\s*:/m.test(front)) {
+      front = front.replace(/^\s*category\s*:\s*"?([^"\n]+)"?.*$/m, (_, value) => `tags: ["${value.trim()}"]`);
+    } else {
+      front = front.replace(/^\s*category\s*:.*\n?/m, '');
+    }
+  }
+
+  if (!/^\s*tags\s*:/m.test(front)) {
+    front += '\ntags: []';
+  }
+
+  if (!/^\s*draft\s*:/m.test(front)) {
+    front += '\ndraft: false';
+  }
+
+  front = front
+    .split('\n')
+    .map((line) => line.trimEnd())
+    .filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''))
+    .join('\n')
+    .trim();
+
+  const cleanedBody = body.replace(/(^|\n)\\([#-])/g, '$1$2');
+  const sanitizedBody = cleanedBody.replace(/^\s*/, '\n');
+  const next = `---\n${front}\n---${sanitizedBody}`;
+  return { changed: next !== content, output: next };
+}
+
+function ensureDirectory(dir) {
+  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
+}
+
+function migratePostsFolder() {
+  const postsDir = join(BLOG_CONTENT, 'posts');
+  const blogDir = join(BLOG_CONTENT, 'blog');
+  if (!existsSync(postsDir)) return;
+  ensureDirectory(blogDir);
+  for (const entry of readdirSync(postsDir)) {
+    const src = join(postsDir, entry);
+    const dst = join(blogDir, entry);
+    if (statSync(src).isDirectory()) continue;
+    const raw = readFileSync(src, 'utf8');
+    const { output } = normalizeFrontMatter(raw);
+    if (!existsSync(dst)) {
+      writeFileSync(dst, output, 'utf8');
+      log(`Movido ${basename(src)} para src/content/blog/`);
+      changes += 1;
+    } else {
+      writeFileSync(dst, output, 'utf8');
+      log(`Sobrescrito ${basename(dst)} com conteúdo migrado de posts/`);
+      changes += 1;
+    }
+    rmSync(src);
+  }
+  rmSync(postsDir, { recursive: true, force: true });
+  log('Removido diretório src/content/posts');
+  changes += 1;
+}
+
+function normalizeExistingContent() {
+  const blogDir = join(BLOG_CONTENT, 'blog');
+  if (!existsSync(blogDir)) return;
+  for (const entry of readdirSync(blogDir)) {
+    const file = join(blogDir, entry);
+    if (statSync(file).isDirectory()) continue;
+    const raw = readFileSync(file, 'utf8');
+    const { changed, output } = normalizeFrontMatter(raw);
+    if (changed) {
+      writeFileSync(file, output, 'utf8');
+      log(`Normalizado front matter de ${basename(file)}`);
+      changes += 1;
+    }
+  }
+}
+
+function main() {
+  console.log('▶️  Correções Decap/Astro');
+  normalizeBlogPackage();
+  ensureAdminRedirectPage();
+  patchConfigYaml();
+  patchAdminBootstrap();
+  patchBuildScript();
+  migratePostsFolder();
+  normalizeExistingContent();
+
+  if (changes === 0) {
+    console.log('Nenhuma alteração necessária.');
+  } else {
+    console.log(`Total de ajustes aplicados: ${changes}.`);
+  }
+}
+
+main();
