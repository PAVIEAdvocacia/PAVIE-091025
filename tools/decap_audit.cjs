diff --git a/tools/decap_audit.cjs b/tools/decap_audit.cjs
new file mode 100755
index 0000000000000000000000000000000000000000..cb05f2761bb67fa5cf9092c578c48dbbb1c9c03b
--- /dev/null
+++ b/tools/decap_audit.cjs
@@ -0,0 +1,190 @@
+#!/usr/bin/env node
+/*
+ * tools/decap_audit.cjs
+ * Automates the manual checklist described in RELATORIO.md for aligning
+ * Decap CMS, Astro blog build, and Cloudflare Pages packaging.
+ */
+
+const { readFileSync, existsSync } = require('node:fs');
+const { resolve, join } = require('node:path');
+
+const ROOT = resolve(__dirname, '..');
+
+function read(relPath) {
+  const abs = join(ROOT, relPath);
+  return readFileSync(abs, 'utf8');
+}
+
+const findings = [];
+function warn(title, detail, fix) {
+  findings.push({ level: 'warn', title, detail, fix });
+}
+function ok(title) {
+  findings.push({ level: 'ok', title });
+}
+
+function summarize() {
+  const warnings = findings.filter((f) => f.level === 'warn');
+  const oks = findings.filter((f) => f.level === 'ok');
+
+  for (const entry of findings) {
+    if (entry.level === 'ok') {
+      console.log(`✅  ${entry.title}`);
+    } else {
+      console.log(`⚠️  ${entry.title}`);
+      if (entry.detail) console.log(`    Detalhes: ${entry.detail}`);
+      if (entry.fix) console.log(`    Sugestão: ${entry.fix}`);
+    }
+  }
+
+  console.log('\nResumo:');
+  console.log(`  Avisos:   ${warnings.length}`);
+  console.log(`  OK:       ${oks.length}`);
+
+  if (warnings.length > 0) {
+    console.log('\nConsulte RELATORIO.md para o contexto completo de cada item.');
+    process.exitCode = 1;
+  }
+}
+
+try {
+  const pkg = JSON.parse(read('blog/package.json'));
+  const dependencies = Object.assign({}, pkg.dependencies, pkg.devDependencies);
+  if (dependencies['astro-redirects']) {
+    ok('Dependência "astro-redirects" declarada.');
+  } else {
+    warn(
+      'Falta a dependência "astro-redirects" no blog/package.json.',
+      'O build do Astro falha ao importar o pacote usado no redirect de /admin.',
+      'Adicionar com "npm install astro-redirects" (ou ajustar a página para outro método).'
+    );
+  }
+} catch (err) {
+  warn(
+    'Não foi possível ler blog/package.json.',
+    err.message,
+    'Verifique se o projeto do blog existe e contém package.json válido.'
+  );
+}
+
+if (existsSync(join(ROOT, 'blog/src/pages/admin.astro'))) {
+  const admin = read('blog/src/pages/admin.astro');
+  if (admin.includes('/blog/public/admin')) {
+    warn(
+      'Redirect do CMS aponta para /blog/public/admin/.',
+      'O build estático do Astro publica o painel diretamente em /blog/admin/.',
+      'Atualize o destino para /blog/admin/ para evitar 404.'
+    );
+  } else {
+    ok('Redirect do CMS aponta para /blog/admin/.');
+  }
+}
+
+if (existsSync(join(ROOT, 'blog/public/admin/config.yml'))) {
+  const yaml = read('blog/public/admin/config.yml');
+  if (/folder:\s*src\/content\/posts/.test(yaml)) {
+    warn(
+      'config.yml salva posts em src/content/posts/.',
+      'O site consome a coleção "blog" em src/content/blog com campo date.',
+      'Ajuste folder/slug/campos para alinhar com src/content/blog.'
+    );
+  } else {
+    ok('config.yml aponta para a coleção esperada.');
+  }
+  if (/pubDate/.test(yaml) && !/date/.test(yaml)) {
+    warn(
+      'Schema do CMS usa pubDate sem expor date.',
+      'As páginas Astro ordenam por data e esperam o campo date.',
+      'Inclua um campo date (ou adapte o schema do Astro para pubDate).'
+    );
+  }
+  const authMatch = yaml.match(/auth_endpoint:\s*([^\n]+)/);
+  if (authMatch) {
+    const endpoint = authMatch[1].trim();
+    if (!endpoint.includes('/api/auth/github-oauth')) {
+      warn(
+        `auth_endpoint configurado como ${endpoint}.`,
+        'A função Cloudflare implementada é /api/auth/github-oauth.',
+        'Atualize auth_endpoint para /api/auth/github-oauth.'
+      );
+    } else {
+      ok('config.yml usa /api/auth/github-oauth como auth_endpoint.');
+    }
+  }
+} else {
+  warn(
+    'Painel do Decap (config.yml) não encontrado.',
+    'Arquivo blog/public/admin/config.yml ausente.',
+    'Garanta que o build estático inclua o painel do CMS.'
+  );
+}
+
+if (existsSync(join(ROOT, 'blog/public/admin/index.html'))) {
+  const html = read('blog/public/admin/index.html');
+  if (/src\/content\/posts/.test(html)) {
+    warn(
+      'Bootstrap inline do Decap ainda referencia src/content/posts.',
+      'Isso gera divergência entre o CMS e as páginas do Astro.',
+      'Atualize o script inline para apontar para src/content/blog e campo date.'
+    );
+  } else {
+    ok('Bootstrap inline do Decap sincronizado com src/content/blog.');
+  }
+  if (/auth_endpoint\s*:\s*"?\/auth\/github"?/.test(html)) {
+    warn(
+      'Bootstrap inline do Decap usa /auth/github.',
+      'A função publicada é /api/auth/github-oauth.',
+      'Sincronize o endpoint de autenticação do script inline.'
+    );
+  }
+} else {
+  warn(
+    'Bootstrap inline do Decap não encontrado.',
+    'Arquivo blog/public/admin/index.html ausente.',
+    'Execute o build do blog para gerar o painel do CMS.'
+  );
+}
+
+if (existsSync(join(ROOT, 'tools/build.cjs'))) {
+  const buildScript = read('tools/build.cjs');
+  if (/cpSync\(BLOG_DIST, BLOG_OUT/.test(buildScript)) {
+    warn(
+      'tools/build.cjs copia blog/dist inteiro, gerando caminho /blog/blog/.',
+      'O build do Astro gera uma pasta intermediária blog/ dentro de dist/.',
+      'Copie apenas o conteúdo de dist/blog para pages_out/blog.'
+    );
+  } else {
+    ok('tools/build.cjs copia apenas o conteúdo interno de dist/blog.');
+  }
+} else {
+  warn(
+    'tools/build.cjs não encontrado.',
+    'Sem script de empacotamento padrão.',
+    'Verifique o pipeline de deploy do Cloudflare Pages.'
+  );
+}
+
+if (existsSync(join(ROOT, 'blog/src/pages/index.astro'))) {
+  const home = read('blog/src/pages/index.astro');
+  if (/href="\/blog\/posts\//.test(home)) {
+    warn(
+      'index.astro mantém links manuais em /blog/posts/.',
+      'O roteamento dinâmico gera URLs em /blog/<slug>/.',
+      'Remova a lista manual ou alinhe os slugs para evitar duplicidade.'
+    );
+  } else {
+    ok('index.astro não usa caminhos /blog/posts/.');
+  }
+}
+
+if (!existsSync(join(ROOT, 'functions/api/auth/github-oauth.ts'))) {
+  warn(
+    'Função /api/auth/github-oauth ausente.',
+    'O Decap depende deste endpoint para OAuth com o GitHub.',
+    'Crie a função correspondente em functions/api/auth/github-oauth.ts.'
+  );
+} else {
+  ok('Função /api/auth/github-oauth presente.');
+}
+
+summarize();
