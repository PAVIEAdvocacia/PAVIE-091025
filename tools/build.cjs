const fs = require('fs/promises');
const path = require('path');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  console.log('🚀 Iniciando processo de build...');
  
  const blogDistPath = path.join(__dirname, '../blog/dist');
  const pagesOutPath = path.join(__dirname, '../pages_out');
  const blogPublicPath = path.join(__dirname, '../blog/public');
  const rootPath = path.join(__dirname, '..');

  try {
    // 1. Limpar pasta de output anterior
    console.log('📁 Limpando pasta pages_out...');
    try {
      await fs.rm(pagesOutPath, { recursive: true, force: true });
    } catch (error) {
      // Pasta pode não existir
    }
    await fs.mkdir(pagesOutPath, { recursive: true });

    // 2. Copiar build do Astro (blog)
    console.log('📦 Copiando build do blog...');
    try {
      await copyDir(blogDistPath, path.join(pagesOutPath, 'blog'));
      console.log('✅ Build do blog copiado');
    } catch (error) {
      console.log('❌ Pasta blog/dist não encontrada:', error.message);
    }

    // 3. Copiar admin do public
    console.log('👨‍💼 Copiando arquivos do admin...');
    try {
      const publicItems = await fs.readdir(blogPublicPath);
      for (const item of publicItems) {
        const sourcePath = path.join(blogPublicPath, item);
        const destPath = path.join(pagesOutPath, 'blog', item);
        
        const sourceStat = await fs.stat(sourcePath);
        if (sourceStat.isDirectory()) {
          await copyDir(sourcePath, destPath);
        } else {
          await fs.copyFile(sourcePath, destPath);
        }
      }
      console.log('✅ Admin copiado');
    } catch (error) {
      console.log('❌ Erro ao copiar admin:', error.message);
    }

    // 4. Copiar arquivos de configuração da raiz
    console.log('⚙️ Copiando arquivos de configuração...');
    const rootFiles = ['_headers', '_redirects'];
    for (const file of rootFiles) {
      try {
        const sourcePath = path.join(rootPath, file);
        await fs.copyFile(sourcePath, path.join(pagesOutPath, file));
        console.log(`✅ ${file} copiado`);
      } catch (error) {
        console.log(`⚠️ ${file} não encontrado na raiz`);
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
  } catch (error) {
    console.error('❌ Erro no build:', error);
    process.exit(1);
  }
}

main();