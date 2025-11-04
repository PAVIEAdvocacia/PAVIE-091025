#!/usr/bin/env bash
# Script para criar imagens placeholder usando ImageMagick
# Uso: bash create-placeholder-images.sh

set -euo pipefail

UPLOAD_DIR="../public/uploads"
mkdir -p "$UPLOAD_DIR"

# Função para criar placeholder
create_placeholder() {
  local dir="$1"
  local filename="$2"
  local text="$3"
  
  mkdir -p "$UPLOAD_DIR/$dir"
  
  # Criar imagem 1200x630 (formato Open Graph)
  convert -size 1200x630 \
    -background "#1e3a5f" \
    -fill white \
    -gravity center \
    -pointsize 48 \
    -font DejaVu-Sans-Bold \
    label:"$text" \
    "$UPLOAD_DIR/$dir/$filename"
  
  echo "✓ Criado: $dir/$filename"
}

# Criar placeholders para os posts de exemplo
create_placeholder "guia-inventario-internacional" "cover.jpg" "Inventário Internacional\nBrasil-Alemanha"
create_placeholder "tjrj-inventariante" "cover.jpg" "TJRJ\nNomeação de Inventariante"
create_placeholder "servico-transfronteirico" "cover.jpg" "Serviço Jurídico\nTransfronteiriço"

echo ""
echo "✓ Placeholders criados com sucesso!"
echo "Substitua por imagens reais antes do deploy em produção."
