#!/usr/bin/env bash
# Script de setup inicial do blog PAVIE | Advocacia
# Uso: bash setup-blog.sh

set -euo pipefail

echo "=================================================="
echo "  Setup do Blog PAVIE | Advocacia"
echo "=================================================="
echo ""

# Detectar diretório
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BLOG_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT_DIR="$(cd "$BLOG_DIR/.." && pwd)"

echo "📂 Diretórios detectados:"
echo "   Raiz do projeto: $ROOT_DIR"
echo "   Blog: $BLOG_DIR"
echo ""

# Verificar se estamos no lugar certo
if [[ ! -f "$BLOG_DIR/package.json" ]]; then
  echo "❌ ERRO: package.json não encontrado em $BLOG_DIR"
  echo "   Execute este script a partir de: blog/scripts/setup-blog.sh"
  exit 1
fi

# 1. Criar estrutura de pastas
echo "📁 Criando estrutura de pastas..."
mkdir -p "$BLOG_DIR/admin"
mkdir -p "$BLOG_DIR/public/uploads"
mkdir -p "$BLOG_DIR/src/content/posts"
mkdir -p "$BLOG_DIR/src/content/schemas"
mkdir -p "$BLOG_DIR/src/layouts"
mkdir -p "$BLOG_DIR/src/pages"
echo "   ✓ Pastas criadas"
echo ""

# 2. Instalar dependências
echo "📦 Instalando dependências..."
cd "$BLOG_DIR"
if [[ ! -d "node_modules" ]]; then
  npm install
  echo "   ✓ Dependências instaladas"
else
  echo "   ✓ Dependências já instaladas (pulando)"
fi
echo ""

# 3. Criar placeholders de imagens (se ImageMagick disponível)
echo "🖼️  Criando imagens placeholder..."
if command -v convert &> /dev/null; then
  bash "$SCRIPT_DIR/create-placeholder-images.sh" || echo "   ⚠️  Erro ao criar placeholders (não crítico)"
else
  echo "   ⚠️  ImageMagick não encontrado. Crie manualmente:"
  echo "      - blog/public/uploads/guia-inventario-internacional/cover.jpg"
  echo "      - blog/public/uploads/tjrj-inventariante/cover.jpg"
  echo "      - blog/public/uploads/servico-transfronteirico/cover.jpg"
  echo "      Tamanho sugerido: 1200x630px, fundo #1e3a5f"
fi
echo ""

# 4. Testar build
echo "🔨 Testando build do blog..."
npm run build
if [[ $? -eq 0 ]]; then
  echo "   ✓ Build concluído com sucesso!"
else
  echo "   ❌ Erro no build. Verifique os logs acima."
  exit 1
fi
echo ""

# 5. Verificar estrutura final
echo "🔍 Verificando estrutura..."
CHECKS=(
  "dist/index.html:Blog index gerado"
  "dist/_astro:Assets Astro"
  "public/_headers:Headers de segurança"
  "src/content/posts:Posts de exemplo"
  "admin/config.yml:Config Decap CMS"
)

ALL_OK=true
for check in "${CHECKS[@]}"; do
  file="${check%%:*}"
  desc="${check##*:}"
  if [[ -e "$BLOG_DIR/$file" ]]; then
    echo "   ✓ $desc"
  else
    echo "   ❌ $desc (faltando: $file)"
    ALL_OK=false
  fi
done
echo ""

# 6. Próximos passos
if $ALL_OK; then
  echo "=================================================="
  echo "  ✅ Setup concluído com sucesso!"
  echo "=================================================="
  echo ""
  echo "📋 Próximos passos:"
  echo ""
  echo "1. Configurar GitHub OAuth App:"
  echo "   → https://github.com/settings/developers"
  echo "   → Callback URL: https://pavieadvocacia.com.br/api/callback"
  echo ""
  echo "2. Adicionar variáveis no Cloudflare Pages:"
  echo "   → GITHUB_CLIENT_ID"
  echo "   → GITHUB_CLIENT_SECRET"
  echo ""
  echo "3. Configurar Cloudflare Access:"
  echo "   → Path: /blog/admin/*"
  echo "   → Policy: Allow (e-mails autorizados)"
  echo ""
  echo "4. Atualizar robots.txt (remover bloqueio do /blog/)"
  echo ""
  echo "5. Commit e push:"
  echo "   cd $ROOT_DIR"
  echo "   git add ."
  echo "   git commit -m \"feat(blog): implement Astro blog with Decap CMS\""
  echo "   git push origin main"
  echo ""
  echo "📚 Documentação: $BLOG_DIR/GUIA_IMPLEMENTACAO_BLOG.md"
  echo ""
else
  echo "=================================================="
  echo "  ⚠️  Setup incompleto"
  echo "=================================================="
  echo ""
  echo "Alguns arquivos estão faltando. Revise a estrutura acima."
  exit 1
fi
