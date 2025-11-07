const fs = require('fs-extra');
const path = require('path');

async function main() {
  console.log('🚀 Iniciando processo de build...');
  
  const blogDistPath = path.join(__dirname, '../blog/dist');
  const pagesOutPath = path.join(__dirname, '../pages_out');
  const blogPublicPath = path.join(__dirname, '../blog/public');
  const rootPath = path.join(__dirname, '..');

  // 1. Limpar pasta de output anterior
  console.log('📁 Limpando pasta pages_out...');
  await fs.remove(pagesOutPath);
  await fs.ensureDir(pagesOutPath);

  // 2. Copiar build do Astro (blog)
  console.log('📦 Copiando build do blog...');
  if (await fs.pathExists(blogDistPath)) {
    const distItems = await fs.readdir(blogDistPath);
    for (const item of distItems) {
      const sourcePath = path.join(blogDistPath, item);
      const destPath = path.join(pagesOutPath, 'blog', item);
      await fs.copy(sourcePath, destPath);
    }
    console.log('✅ Build do blog copiado');
  } else {
    console.log('❌ Pasta blog/dist não encontrada');
  }

  // 3. Copiar admin do public
  console.log('👨‍💼 Copiando arquivos do admin...');
  if (await fs.pathExists(blogPublicPath)) {
    const publicItems = await fs.readdir(blogPublicPath);
    for (const item of publicItems) {
      const sourcePath = path.join(blogPublicPath, item);
      const destPath = path.join(pagesOutPath, 'blog', item);
      
      // Não sobrescrever se já foi copiado do dist
      if (!(await fs.pathExists(destPath))) {
        await fs.copy(sourcePath, destPath);
      }
    }
    console.log('✅ Admin copiado');
  }

  // 4. Copiar arquivos de configuração da raiz
  console.log('⚙️ Copiando arquivos de configuração...');
  const rootFiles = ['_headers', '_redirects'];
  for (const file of rootFiles) {
    const sourcePath = path.join(rootPath, file);
    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, path.join(pagesOutPath, file));
      console.log(`✅ ${file} copiado`);
    }
  }

  // 5. Verificar estrutura final
  console.log('\n📋 Estrutura final em pages_out:');
  const listFiles = async (dir, prefix = '') => {
    const items = await fs.readdir(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        console.log(prefix + '📁 ' + item + '/');
        await listFiles(fullPath, prefix + '  ');
      } else {
        console.log(prefix + '📄 ' + item);
      }
    }
  };
  
  await listFiles(pagesOutPath);
  
  console.log('\n🎉 Build concluído com sucesso!');
}

main().catch(error => {
  console.error('❌ Erro no build:', error);
  process.exit(1);
});