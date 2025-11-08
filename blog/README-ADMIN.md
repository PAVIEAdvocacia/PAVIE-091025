# Admin (Decap CMS)

- Interface: `/admin/`
- Backend: GitHub
- OAuth via Cloudflare Pages Functions (`/api/auth/github-oauth` e `/api/callback`)

Ajuste o arquivo `public/admin/config.yml`:
- `backend.repo`: repositório GitHub
- `site_url`: `https://blog.pavieadvocacia.com.br`
- `media_folder`/`public_folder` já compatíveis com subdomínio

Proteja `/admin/*` com Cloudflare Access (MFA).