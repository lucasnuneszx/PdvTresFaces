const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Iniciando build para Vercel...')

try {
  // 1. Gerar o Prisma Client
  console.log('📦 Gerando Prisma Client...')
  execSync('npx prisma generate', { stdio: 'inherit' })

  // 2. Fazer push do schema para o banco (se DATABASE_URL estiver configurada)
  if (process.env.DATABASE_URL) {
    console.log('🗄️ Aplicando migrações do banco...')
    try {
      execSync('npx prisma db push', { stdio: 'inherit' })
    } catch (error) {
      console.log('⚠️ Aviso: Não foi possível aplicar migrações do banco')
      console.log('   Isso é normal se o banco ainda não estiver configurado')
    }
  }

  // 3. Configurar sistema inicial se o banco estiver disponível
  if (process.env.DATABASE_URL) {
    console.log('🔧 Configurando sistema inicial...')
    try {
      execSync('node scripts/vercel-setup.js', { stdio: 'inherit' })
    } catch (error) {
      console.log('⚠️ Aviso: Não foi possível configurar sistema inicial')
      console.log('   Execute manualmente após o deploy: node scripts/vercel-setup.js')
    }
  }

  // 4. Build do Next.js
  console.log('🏗️ Fazendo build do Next.js...')
  execSync('next build', { stdio: 'inherit' })

  console.log('✅ Build concluído com sucesso!')
  console.log('\n📋 Próximos passos:')
  console.log('1. Configure as variáveis de ambiente no Vercel')
  console.log('2. Configure um banco de dados PostgreSQL')
  console.log('3. Acesse /credentials para ver as credenciais de acesso')

} catch (error) {
  console.error('❌ Erro durante o build:', error.message)
  process.exit(1)
}
