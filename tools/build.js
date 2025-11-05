// tools/build.js
// Build unificado para Cloudflare Pages: copia o site estático do raiz,
// compila o blog (Astro) e garante /blog/admin no artefato final (site_dist/)

const { execSync } = require("node:child_process");
const { rmSync, mkdirSync, cpSync, writeFileSync } = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const OUT = path.join(ROOT, "site_dist");

function log(msg) { console.log("•", msg); }

function copyRootToOut() {
  // Copia o site estático do raiz para site_dist, excluindo pastas de dev
  const EXCLUDE = new Set([
    "node_modules", ".git", "site_dist", "blog", "functions",
    ".wrangler", ".github", "tools"
  ]);
  const filter = (src) => {
    const rel = path.relative(ROOT, src);
    if (!rel || rel.startsWith("..")) return true;
    const top = rel.split(path.sep)[0];
    return !EXCLUDE.has(top);
  };
  cpSync(ROOT, OUT, { recursive: true, filter });
}

function buildBlog() {
  const BLOG = path.join(ROOT, "blog");
  log("Instalando deps do blog…");
  execSync("npm ci", { cwd: BLOG, stdio: "inherit" });
  log("Rodando build do blog (Astro)…");
  execSync("npm run build", { cwd: BLOG, stdio: "inherit" });

  // Move blog/dist -> site_dist/blog
  cpSync(path.join(BLOG, "dist"), path.join(OUT, "blog"), { recursive: true });

  // Garante o admin do Decap em /blog/admin (mesmo se o Astro não o copiar)
  const ADMIN_SRC = path.join(BLOG, "public", "admin");
  const ADMIN_DST = path.join(OUT, "blog", "admin");
  try {
    cpSync(ADMIN_SRC, ADMIN_DST, { recursive: true });
  } catch {
    // Se não existir, ignore (mas recomendamos manter blog/public/admin no repo)
  }
}

function writeRoutesJson() {
  // Permite que APENAS /api/* seja tratado por Functions; restante é estático
  const routes = {
    include: ["/api/*"],
    exclude: ["/blog/*", "/*"]
  };
  writeFileSync(path.join(OUT, "_routes.json"), JSON.stringify(routes, null, 2));
}

(function main() {
  log(`Limpando saída: ${OUT}`);
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  log("Copiando site raiz para site_dist/…");
  copyRootToOut();

  log("Processando blog…");
  buildBlog();

  log("Escrevendo _routes.json…");
  writeRoutesJson();

  log("✅ Build concluído em site_dist/");
})();
