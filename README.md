⚖️ PAVIE | Advocacia – Site Institucional 

Autor: PAVIE Advocacia

Responsável técnico: Fabio Pavie (fabiopavie@pavieadvogado.com
)
Hospedagem: Cloudflare Pages
Backend: Google Apps Script (Webhook)
Segurança: Cloudflare Turnstile CAPTCHA

🌐 Descrição

Website institucional da PAVIE | Advocacia, escritório jurídico com atuação em Direito Civil, Empresarial e Contratual.
O site apresenta o escritório, áreas de atuação e um canal de contato seguro integrado ao Google Apps Script, com verificação Cloudflare Turnstile.

📁 Estrutura do projeto
/
├─ index.html                   → Página principal (conteúdo e design)
├─ _headers                     → Políticas HTTP e segurança (CSP, CORS)
├─ robots.txt                   → Permite indexação completa do site
├─ sitemap.xml                  → Sitemap XML (atualizado semanalmente)
├─ form.turnstile.js            → Geração e callbacks do CAPTCHA Turnstile
├─ assets/
│  └─ js/
│     └─ form.submit.js         → Envio assíncrono do formulário de contato
└─ functions/
   └─ api/
      └─ contato.js             → Função backend (Cloudflare Pages Function)

⚙️ Tecnologias utilizadas
Camada	Tecnologia	Função
Frontend	HTML5, TailwindCSS, JavaScript Vanilla	Estrutura e estilo da página
Segurança	Cloudflare Turnstile	Verificação humana (CAPTCHA)
Backend	Cloudflare Pages Function (/api/contato)	Recebe e valida dados
Email	Google Apps Script (doPost)	Envia mensagens de contato via Gmail
Infra	Cloudflare Pages + Google Workspace	Hospedagem e e-mail corporativo
🔐 Configuração de ambiente (Cloudflare Pages)
Variável	Descrição	Exemplo
TURNSTILE_SECRET	Chave secreta do CAPTCHA	0x4AAAAAAB6FBQCDOnIZ601SrQIoDIyMNeg
SCRIPT_URL	URL /exec do Apps Script	https://script.google.com/macros/s/AKfycbx.../exec
MAIL_TO	Destinatários do formulário	fabiopavie@pavieadvogado.com,contato@pavieadvocacia.com.br
MAIL_FROM	(opcional) remetente fixo	(vazio recomendado)
MAIL_FROM_NAME	Nome do remetente padrão	`PAVIE
SITE_BASE	URL base do site	https://pavieadvocacia.com.br
DEV_BYPASS_TURNSTILE	(opcional em Preview) Bypass do CAPTCHA	true
💬 Fluxo do formulário de contato
Usuário → Formulário (index.html)
        → Turnstile (valida token)
        → /api/contato (Cloudflare Function)
        → Apps Script Web App (/exec)
        → MailApp.sendEmail()
        → Caixa postal do escritório

Validação

Se o token do Turnstile for inválido → 403 Forbidden

Se o Apps Script retornar erro → 502 com detalhe JSON

Sucesso → { "ok": true } e mensagem “Enviado com sucesso.”

🧩 Backend – Apps Script (Code.gs)

Webhook configurado na conta fabiopavie@pavieadvogado.com, com doPost(e) que:

Lê JSON recebido;

Monta corpo da mensagem com nome, e-mail, telefone e texto;

Envia via MailApp.sendEmail;

Retorna { ok: true }.

🧪 Testes
PowerShell
$body = @{
  nome = "Teste API"
  email = "remetente@exemplo.com"
  telefone_full = "+5521964382263"
  mensagem = "Validação via PowerShell"
  turnstileToken = "COLE_AQUI_TOKEN_REAL"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "https://pavieadvocacia.com.br/api/contato" -ContentType "application/json" -Body $body

CMD
curl -i -X POST https://pavieadvocacia.com.br/api/contato ^
  -H "Content-Type: application/json" ^
  -d "{\"nome\":\"Teste API\",\"email\":\"remetente@exemplo.com\",\"telefone_full\":\"+5521964382263\",\"mensagem\":\"Teste CMD\",\"turnstileToken\":\"COLE_AQUI_TOKEN_REAL\"}"

🛡️ Segurança e boas práticas

Não expor a TURNSTILE_SECRET em arquivos públicos.

Atualizar o Apps Script com nova versão a cada edição (Implantar → Gerenciar implantações → Editar implantação → Salvar nova versão).

Deixar MAIL_FROM vazio (para usar o remetente padrão do Apps Script).

Configurar DNS do domínio com:

TXT @ "v=spf1 include:_spf.google.com ~all"


E ativar DKIM no Google Workspace.

📅 Atualizações automáticas

robots.txt permite indexação completa.

sitemap.xml atualizado semanalmente:

<loc>https://www.pavieadvocacia.com.br/</loc>
<changefreq>weekly</changefreq>
<priority>1.0</priority>

📞 Contato técnico

Fabio Pavie
📧 fabiopavie@pavieadvogado.com

🌐 www.pavieadvocacia.com.br

📍 Maricá – RJ – Brasil

🧾 Licença

Este projeto é de uso institucional do escritório PAVIE | Advocacia.
Proibida a cópia ou redistribuição não autorizada.
