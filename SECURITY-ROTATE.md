# Segurança — Rotação de chaves (Turnstile)

> Foi identificado um arquivo no repositório com chaves expostas. **Aja imediatamente** para mitigar.

## Sintoma
- Arquivo de notas/imagens com “**chave do site**” e “**chave secreta**” em texto puro.

## Riscos
- Abuso do captcha e **bypass** da validação do formulário.
- Bloqueio do serviço por uso indevido.

## Como rotacionar
1. **Gerar nova Secret Key** no painel **Cloudflare Turnstile** (rotate).
2. **Atualizar** `TURNSTILE_SECRET` em *Pages → Settings → Environment variables* (salvar como **Secret**).
3. **Confirmar** com `GET https://SEU_DOMINIO/api/contato` → `hasSecret: true`.
4. **Remover** do repositório todos os arquivos que contenham segredos expostos (incluindo histórico, se público). Se necessário, use `git filter-repo`.
5. **Reimplantar** (push em `main` → novo deploy).

## Regras de ouro
- Segredos **nunca** vão para o Git. Use variáveis **Secret**.
- Imagens de tela: **mascare** segredos antes de anexar.
