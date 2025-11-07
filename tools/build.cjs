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

    // 3. Copiar admin do public - COM CORREÇÕES CRÍTICAS
    console.log('👨‍💼 Copiando arquivos do admin...');
    try {
      const publicItems = await fs.readdir(blogPublicPath);
      
      for (const item of publicItems) {
        const sourcePath = path.join(blogPublicPath, item);
        const destPath = path.join(pagesOutPath, 'blog', item);
        
        // Se for a pasta admin, copiar normalmente
        if (item === 'admin') {
          await copyDir(sourcePath, destPath);
          console.log('✅ Pasta admin copiada');
        } 
        // Se for config.yml, copiar para raiz do blog TAMBÉM (para compatibilidade)
        else if (item === 'config.yml') {
          // Copiar para admin (local original)
          await fs.copyFile(sourcePath, path.join(pagesOutPath, 'blog', 'admin', 'config.yml'));
          // Copiar para raiz do blog (para evitar erro 404)
          await fs.copyFile(sourcePath, path.join(pagesOutPath, 'blog', 'config.yml'));
          console.log('✅ config.yml copiado para admin/ e raiz do blog');
        }
        // Outros arquivos/diretórios
        else {
          const sourceStat = await fs.stat(sourcePath);
          if (sourceStat.isDirectory()) {
            await copyDir(sourcePath, destPath);
          } else {
            await fs.copyFile(sourcePath, destPath);
          }
        }
      }
      console.log('✅ Admin copiado com sucesso');
    } catch (error) {
      console.log('❌ Erro ao copiar admin:', error.message);
    }

    // 4. VERIFICAÇÃO CRÍTICA: Garantir que admin/index.html existe
    console.log('🔍 Verificando estrutura do admin...');
    const adminIndexPath = path.join(pagesOutPath, 'blog', 'admin', 'index.html');
    try {
      await fs.access(adminIndexPath);
      console.log('✅ admin/index.html encontrado');
    } catch (error) {
      console.log('❌ CRÍTICO: admin/index.html não encontrado após build');
    }

    // 5. Copiar arquivos de configuração da raiz
    console.log('⚙️ Copiando arquivos de configuração...');
    const rootFiles = ['_headers', '_redirects'];
    for (const file of rootFiles) {
      try {
        const sourcePath = path.join(rootPath, file);
        const destPath = path.join(pagesOutPath, file);
        
        // Verificar se o arquivo existe antes de copiar
        await fs.access(sourcePath);
        await fs.copyFile(sourcePath, destPath);
        console.log(`✅ ${file} copiado`);
        
        // Log do conteúdo para debug
        if (file === '_redirects') {
          const content = await fs.readFile(sourcePath, 'utf8');
          console.log(`   Conteúdo do _redirects:\n   ${content.split('\n').map(line => `   ${line}`).join('\n')}`);
        }
      } catch (error) {
        console.log(`⚠️ ${file} não encontrado na raiz: ${error.message}`);
      }
    }

    // 6. Verificar estrutura final COMPLETA
    console.log('\n📋 Estrutura final em pages_out:');
    const listFiles = async (dir, prefix = '') => {
      try {
        const items = await fs.readdir(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);
          if (stat.isDirectory()) {
            console.log(prefix + '📁 ' + item + '/');
            await listFiles(fullPath, prefix + '  ');
          } else {
            console.log(prefix + '📄 ' + item + ` (${stat.size} bytes)`);
          }
        }
      } catch (error) {
        console.log(prefix + '❌ Erro ao listar: ' + error.message);
      }
    };
    
    await listFiles(pagesOutPath);
    
    // 7. Verificação final crítica
    console.log('\n🔍 Verificações finais:');
    const criticalPaths = [
      ['blog/admin/index.html', 'Interface do CMS'],
      ['blog/admin/config.yml', 'Configuração do CMS (admin)'],
      ['blog/config.yml', 'Configuração do CMS (raiz)'],
      ['_redirects', 'Redirecionamentos'],
      ['_headers', 'Headers de segurança']
    ];
    
    for (const [filePath, description] of criticalPaths) {
      try {
        const fullPath = path.join(pagesOutPath, filePath);
        await fs.access(fullPath);
        const stats = await fs.stat(fullPath);
        console.log(`✅ ${description}: ${filePath} (${stats.size} bytes)`);
      } catch (error) {
        console.log(`❌ ${description}: ${filePath} - AUSENTE`);
      }
    }
    
    console.log('\n🎉 Build concluído com sucesso!');
    console.log('📝 Próximos passos:');
    console.log('   1. Teste local: cd pages_out && npx serve');
    console.log('   2. Acesse: http://localhost:3000/blog/admin');
    console.log('   3. Se funcionar: Commit & Push no GitHub Desktop');
    console.log('   4. Aguarde deploy automático no Cloudflare');
    
  } catch (error) {
    console.error('❌ Erro crítico no build:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main };