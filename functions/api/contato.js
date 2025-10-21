// functions/api/contato.js — Cloudflare Pages Function
export const onRequestOptions = async () => new Response(null, {
  status: 204,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  }
});

export const onRequestPost = async (ctx) => {
  const { request, env } = ctx;
  const headers = { "Content-Type":"application/json; charset=utf-8", "Access-Control-Allow-Origin":"*" };

  async function parseBody(){
    const ct = request.headers.get("content-type") || "";
    try{
      if (ct.includes("application/json")) return await request.json();
      if (ct.includes("application/x-www-form-urlencoded")){
        const fd = await request.formData();
        return Object.fromEntries(fd.entries());
      }
    }catch(_){}
    return {};
  }

  const data = await parseBody();
  const nome = (data.nome||"").toString().trim();
  const email = (data.email||"").toString().trim();
  const mensagem = (data.mensagem||"").toString().trim();
  const telefone_full = (data.telefone_full||data.telefone||"").toString().trim();

  if(!nome || !email || !mensagem){
    return new Response(JSON.stringify({ ok:false, error:"Campos obrigatórios ausentes" }), { status:400, headers });
  }

  const bypass = String(env.DEV_BYPASS_TURNSTILE||"").toLowerCase()==="true";
  const token = data.turnstileToken || data["cf-turnstile-response"] || "";

  if(!bypass){
    if(!token){
      return new Response(JSON.stringify({ ok:false, error:"Token Turnstile ausente" }), { status:400, headers });
    }
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type":"application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET || "", response: token })
    }).then(r=>r.json()).catch(()=>null);

    if(!verify || !verify.success){
      return new Response(JSON.stringify({ ok:false, error:"Falha na verificação do Turnstile" }), { status:403, headers });
    }
  }

  // encaminha ao Apps Script
  const endpoint = env.APP_SCRIPT_WEBAPP_URL || env.SCRIPT_URL;
  if(!endpoint){
    return new Response(JSON.stringify({ ok:false, error:"SCRIPT_URL não configurada" }), { status:500, headers });
  }

  const payload = {
    nome, email, telefone_full, mensagem,
    site: env.SITE_BASE || new URL(request.url).origin,
    ua: request.headers.get("User-Agent") || "",
    ip: request.headers.get("CF-Connecting-IP") || "",
    auth: env.APPSCRIPT_SECRET || ""
  };

  try{
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });
    const text = await upstream.text();
    let j=null; try{ j=JSON.parse(text);}catch(_){}
    if(upstream.ok && j && j.ok){
      return new Response(JSON.stringify({ ok:true }), { status:200, headers });
    } else {
      return new Response(JSON.stringify({ ok:false, error: (j && (j.error||j.message)) || text || "Falha no backend" }), { status:502, headers });
    }
  }catch(e){
    return new Response(JSON.stringify({ ok:false, error: e?.message || "Erro desconhecido" }), { status:502, headers });
  }
};