const fs = require('fs-extra');
const path = require('path');

async function main() {
  const blogDistPath = path.join(__dirname, '../blog/dist');
  const pagesOutBlogPath = path.join(__dirname, '../pages_out/blog');
  const blogPublicPath = path.join(__dirname, '../blog/public');

  console.log('🔄 Iniciando build do blog...');

  // 1. Limpar destino anterior
  await fs.remove(pagesOutBlogPath);
  
  // 2. Copiar conteúdo do build do Astro (blog/dist)
  const distItems = await fs.readdir(blogDistPath);
  for (const item of distItems) {
    const sourcePath = path.join(blogDistPath, item);
    const destPath = path.join(pagesOutBlogPath, item);
    await fs.copy(sourcePath, destPath);
  }

  // 3. Copiar arquivos estáticos do public (incluindo admin)
  const publicItems = await fs.readdir(blogPublicPath);
  for (const item of publicItems) {
    // Não copiar _headers novamente se já estiver na raiz
    if (item !== '_headers') {
      const sourcePath = path.join(blogPublicPath, item);
      const destPath = path.join(pagesOutBlogPath, item);
      await fs.copy(sourcePath, destPath);
    }
  }

  console.log('✅ Build do blog concluído em:', pagesOutBlogPath);
  console.log('📁 Conteúdo gerado:');
  const finalItems = await fs.readdir(pagesOutBlogPath);
  finalItems.forEach(item => console.log('   -', item));
}

main().catch(console.error);