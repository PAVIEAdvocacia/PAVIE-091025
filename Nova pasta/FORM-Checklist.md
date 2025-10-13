# Formulário — Checklist de Qualidade

- [x] **Acessibilidade**: `label` associado, `aria-describedby` para aviso LGPD, foco visível.
- [x] **Honeypot**: campo oculto `company` (bloqueia bots).
- [x] **Turnstile**: widget carregado + verificação no servidor.
- [x] **Assunto**: API aceita `assunto` **ou** `servico` (conserva contexto).
- [x] **Telefone**: `pattern` flexível `^[0-9()+\-\s]{8,20}$` (aceita formatos BR comuns).
- [x] **UX de envio**: submissão via Fetch; botão indica `Enviando…/Enviado!`; reset após sucesso.
- [x] **Privacidade**: coleta mínima; checkbox de consentimento; timestamp em `consent_timestamp`.
- [x] **Segurança**: headers `_headers`; CORS padrão (mesmo domínio).

## Testes manuais
1. Submeter sem resolver Turnstile → deve bloquear com alerta.
2. Submeter com todos os campos válidos → **200** e `delivered:true` (ver logs).
3. Falta de variáveis de e‑mail → resposta `mail-vars-missing` (200).
4. Forçar erro de MailChannels → resposta **502** com `mailchannels-failed`.
