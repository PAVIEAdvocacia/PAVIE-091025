1) Cloudflare Pages (projeto do blog):
   - Root: blog/
   - Build: npm run build
   - Output: dist
   - Secrets: GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
   - Rota: https://pavieadvocacia.com.br/blog*
   - OAuth App (GitHub) -> Callback: https://pavieadvocacia.com.br/blog/api/callback
2) Acesse https://pavieadvocacia.com.br/blog/admin para autenticar com GitHub.