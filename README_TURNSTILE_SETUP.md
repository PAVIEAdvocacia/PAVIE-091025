# Passo a passo — Turnstile + Função /api/contato (Cloudflare Pages)

## 1) Criar NOVO widget no Turnstile
- Hostnames: `pavieadvocacia.com.br`, `www.pavieadvocacia.com.br`, seu `*.pages.dev`
- Modo: Gerenciado (ou Não interativo)

## 2) Variáveis do projeto (Produção)
- `TURNSTILE_SECRET` (Secreto) = CHAVE SECRETA do widget novo
- `MAIL_FROM` = `contato-site@pavieadvocacia.com.br`
- `MAIL_TO` = `fabiopavie@pavieadvogado.com`
→ Salvar e implantar / Redeploy

## 3) Colocar arquivos
- `functions/api/contato.js` (este v4)
- (opcional) `contato-teste.html` na raiz para testar

## 4) Atualizar HTML (form)
Dentro do `<form ... action="/api/contato">`:
```html
<div class="cf-turnstile" data-sitekey="COLE_A_SUA_NOVA_SITE_KEY_AQUI" data-action="contact_form" data-theme="auto"></div>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" defer></script>
```

## 5) Teste
- Abrir `/contato-teste.html` e enviar (resposta JSON)
- Ou usar seu formulário normal
- Logs: Pages → Implantações → Funções → Iniciar fluxo de log
