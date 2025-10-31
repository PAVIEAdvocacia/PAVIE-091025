param([string]$nome)

# Gera um slug simples a partir do nome do artigo
$slug = $nome.ToLower() `
  -replace '[áàâã]','a' -replace '[éê]','e' -replace '[í]','i' -replace '[óôõ]','o' -replace '[ú]','u' -replace '[ç]','c' `
  -replace '[^a-z0-9]+','-' -replace '-+','-' -replace '(^-|-$)',''

# Caminho final do arquivo .md
$file = "src/content/blog/$slug.md"

# Front matter padrão (compatível com seu schema unificado)
$content = @"
---
title: "$nome"
excerpt: ""
description: ""
date: "$(Get-Date -Format yyyy-MM-dd)"
draft: false
tags: []
---

# $nome

Introdução (linguagem clara, ética OAB, sem promessas de resultado).

## 1) Contexto/Conceito
Texto…

## 2) Roteiro prático / checklist
- [ ] Passo 1
- [ ] Passo 2

## 3) Conclusão
Orientação geral + CTA ético: agende consulta.
"@

# Cria diretório se não existir
New-Item -ItemType Directory -Force -Path "src/content/blog" | Out-Null
# Grava o arquivo
Set-Content $file $content -Encoding UTF8

Write-Host "✅ Artigo criado:" (Resolve-Path $file)
