# Guia de Implementação do Blog PAVIE | Advocacia

## Visão Geral

Este guia detalha todos os passos para implementar o blog Astro + Decap CMS no site institucional da PAVIE | Advocacia.

---

## Fase 1: Preparação do Repositório

### 1.1 Estrutura de Pastas

Crie a estrutura no repositório `PAVIEAdvocacia/PAVIE-091025`:

```
/blog/
  ├── admin/
  │   ├── index.html
  │   └── config.yml
  ├── functions/
  │   └── api/
  │       ├── auth.ts
  │       └── callback.ts
  ├── public/
  │   ├── _headers
  │   └── uploads/
  ├── src/
  │   ├── content/
  │   │   ├── config.ts
  │   │   ├── posts/
  │   │   └── schemas/
  │   │       └── post.ts
  │   ├── layouts/
  │   │   └── BaseLayout.astro
  │   └── pages/
  │       ├── index.astro
  │       └── [...slug].astro
  ├── .gitignore
  ├── astro.config.mjs
  ├── package.json
  └── tsconfig.json
```

### 1.2 Arquivos Criados

Todos os arquivos foram fornecidos nos artefatos anteriores. Copie-os para as respectivas pastas.

---

## Fase 2: Configuração do GitHub OAuth App

### 2.1 Criar OAuth App no GitHub

1. Acesse: https://github.com/settings/developers
2. Clique em **"New OAuth App"**
3. Preencha:
   - **Application name**: `PAVIE Blog Admin`
   - **Homepage URL**: `https://pavieadvocacia.com.br`
   - **Authorization callback URL**: `https://pavieadvocacia.com.br/api/callback`
4. Clique em **"Register application"**
5. Anote o **Client ID**
6. Clique em **"Generate a new client secret"** e anote o **Client Secret**

### 2.2 OAuth App para Desenvolvimento Local (Opcional)

Se quiser testar localmente:

1. Crie outro OAuth App com:
   - **Homepage URL**: `http://localhost:8788`
   - **Authorization callback URL**: `http://localhost:8788/api/callback`

---

## Fase 3: Configuração do Cloudflare Pages

### 3.1 Variáveis de Ambiente

No painel do Cloudflare Pages, vá em:
**Project → Settings → Environment variables**

Adicione (para Production e Preview):

```
GITHUB_CLIENT_ID = seu_client_id_aqui
GITHUB_CLIENT_SECRET = seu_client_secret_aqui
```

### 3.2 Build Settings

Configure o build no Cloudflare Pages:

- **Build command**: `npm run build`
- **Build output directory**: `pages_out`
- **Root directory**: `/` (raiz do repositório)

O script `tools/build.cjs` já existe no seu repositório e fará:
1. Copiar o site estático para `pages_out/`
2. Fazer build do blog Astro
3. Copiar o build do blog para `pages_out/blog/`

---

## Fase 4: Cloudflare Access (Proteção do Admin)

### 4.1 Criar Aplicação no Cloudflare Zero Trust

1. Acesse: **Cloudflare Zero Trust → Access → Applications**
2. Clique em **"Add an application"** → **"Self-hosted"**
3. Preencha:
   - **Application name**: `Blog Admin`
   - **Session Duration**: `24 hours`
   - **Application domain**: 
     - Subdomain: (deixe vazio)
     - Domain: `pavieadvocacia.com.br`
     - Path: `/blog/admin/*`

### 4.2 Criar Política de Acesso

1. Na mesma tela, adicione uma política:
   - **Policy name**: `Blog Editors`
   - **Action**: `Allow`
   - **Include**:
     - Rule type: `Emails`
     - Value: `fabiopavie@pavieadvogado.com` (ou os e-mails autorizados)

2. (Opcional) Adicione **MFA** nas configurações de autenticação

3. Clique em **"Save application"**

---

## Fase 5: Instalação e Build Local

### 5.1 Instalar Dependências

```bash
cd blog
npm install
```

### 5.2 Testar Localmente (sem OAuth)

```bash
npm run dev
```

Acesse: `http://localhost:4321/blog/`

### 5.3 Build de Produção

```bash
npm run build
```

Isso vai:
1. Gerar o build estático em `blog/dist/`
2. Executar Pagefind para criar o índice de busca

### 5.4 Testar com Wrangler (OAuth local)

Se configurou o OAuth App de desenvolvimento:

1. Crie `blog/functions/.dev.vars`:
```
GITHUB_CLIENT_ID=seu_dev_client_id
GITHUB_CLIENT_SECRET=seu_dev_client_secret
```

2. Execute:
```bash
npm run build
wrangler pages dev dist --port 8788
```

3. Acesse: `http://localhost:8788/blog/admin/`

---

## Fase 6: Deploy para Produção

### 6.1 Commit e Push

```bash
git add .
git commit -m "feat(blog): add Astro blog with Decap CMS and OAuth"
git push origin main
```

### 6.2 Verificação do Deploy

1. Cloudflare Pages iniciará o build automaticamente
2. Acompanhe em: **Cloudflare Pages → Project → Deployments**
3. Aguarde conclusão (5-10 minutos)

---

## Fase 7: Validação (Go/No-Go)

### 7.1 Checklist de Validação

#### Blog Público
- [ ] Acesse `https://pavieadvocacia.com.br/blog/`
- [ ] Verifique se a listagem de posts aparece
- [ ] Clique em um post e verifique se abre corretamente
- [ ] Verifique os headers (DevTools → Network → Headers)

#### Admin (Decap CMS)
- [ ] Acesse `https://pavieadvocacia.com.br/blog/admin/`
- [ ] Cloudflare Access deve solicitar login (se configurado)
- [ ] Após autenticação do Access, clique em **"Login with GitHub"**
- [ ] Popup abre com autorização do GitHub
- [ ] Popup fecha automaticamente após autorização
- [ ] Painel do Decap CMS carrega corretamente

#### Criar Post de Teste
- [ ] No Decap, clique em **"New Artigos"**
- [ ] Preencha todos os campos obrigatórios
- [ ] Clique em **"Save"** → cria PR (editorial workflow)
- [ ] Ou clique em **"Publish"** → commit direto na main

#### Verificar no GitHub
- [ ] Vá ao repositório no GitHub
- [ ] Verifique se o PR foi criado (ou commit na main)
- [ ] Arquivo deve estar em `blog/src/content/posts/`

### 7.2 Troubleshooting

**Problema**: Popup do login não fecha
- **Solução**: Verifique o CSP em `blog/public/_headers` (já configurado)

**Problema**: Erro 401 em `/api/callback`
- **Solução**: Confirme `GITHUB_CLIENT_SECRET` no Cloudflare Pages
- **Solução**: Verifique a callback URL no GitHub OAuth App

**Problema**: Decap não vê os posts
- **Solução**: Confirme os caminhos em `admin/config.yml`:
  ```yaml
  media_folder: "blog/public/uploads"
  public_folder: "/blog/uploads"
  collections:
    - folder: "blog/src/content/posts"
  ```

**Problema**: Busca (Pagefind) não funciona
- **Solução**: Execute `npm run build` (postbuild roda o Pagefind)
- **Solução**: Verifique se `dist/_pagefind/` foi criado

---

## Fase 8: Próximos Passos

### 8.1 Adicionar Busca no Blog

1. Instale o componente de busca do Pagefind
2. Adicione ao header do blog:

```astro
<div id="search"></div>
<script>
  import { search } from '@pagefind/default-ui';
  search('#search');
</script>
```

### 8.2 Adicionar RSS Feed

Astro gera automaticamente `rss.xml`. Adicione ao `<head>` do site:

```html
<link rel="alternate" type="application/rss+xml" 
      title="Blog PAVIE | Advocacia" 
      href="/blog/rss.xml">
```

### 8.3 SEO Avançado

- [ ] Adicionar sitemap do blog ao sitemap principal
- [ ] Configurar `robots.txt` para permitir `/blog/`
- [ ] Adicionar Schema.org `FAQPage` em posts relevantes
- [ ] Configurar `hreflang` quando adicionar EN/DE

### 8.4 Analytics

- [ ] Verificar eventos GA4 nos posts
- [ ] Criar eventos customizados:
  - `view_blog_post`
  - `click_cta_from_blog`
  - `download_material`

---

## Recursos Adicionais

### Documentação

- **Astro**: https://docs.astro.build
- **Decap CMS**: https://decapcms.org/docs/
- **Pagefind**: https://pagefind.app/

### Suporte

- Documentação completa: `/docs/blog/RFC-000 - Plano Diretor do Blog (DMB).md`
- ADRs: `/docs/blog/adrs/ADR-001.md` a `ADR-012.md`

---

## Comandos Úteis

```bash
# Desenvolvimento local
cd blog && npm run dev

# Build de produção
cd blog && npm run build

# Testar com Wrangler (Pages Functions)
cd blog && npm run dev:pages

# Instalar dependências
cd blog && npm install

# Limpar cache
cd blog && rm -rf node_modules dist .astro
```

---

## Checklist Final de Go-Live

- [ ] OAuth GitHub configurado (Production)
- [ ] Variáveis de ambiente no Cloudflare Pages
- [ ] Cloudflare Access configurado em `/blog/admin/*`
- [ ] Build funcional (raiz + blog)
- [ ] 3 posts de exemplo validados pelo schema Zod
- [ ] Admin acessível e funcional
- [ ] Posts aparecem no blog público
- [ ] Headers de segurança aplicados
- [ ] GA4 rastreando page views
- [ ] Sitemap atualizado

---

**Status do Projeto**: ✅ Pronto para implementação

**Data**: 2025-11-03

**Responsável**: Fabio Pavie

---

## Suporte Técnico

Em caso de dúvidas ou problemas:

1. Consulte este guia
2. Revise a RFC-000 e ADRs
3. Verifique os logs do Cloudflare Pages
4. Entre em contato: fabiopavie@pavieadvogado.com
