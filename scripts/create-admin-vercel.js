const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('🔧 Criando usuário administrador para Vercel...')

    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('✅ Usuário administrador já existe!')
      console.log(`📧 Email: ${existingAdmin.email}`)
      console.log('🔑 Senha: 123456')
      return
    }

    // Criar senha hash
    const hashedPassword = await bcrypt.hash('123456', 12)

    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@estabelecimento.com',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '(11) 99999-0001',
        isActive: true
      }
    })

    console.log('🎉 Usuário administrador criado com sucesso!')
    console.log('\n📋 Credenciais de acesso:')
    console.log('┌─────────────────────────────────────────────────────────┐')
    console.log('│                    ESTABELECIMENTO                       │')
    console.log('├─────────────────────────────────────────────────────────┤')
    console.log('│ Email: admin@estabelecimento.com                        │')
    console.log('│ Senha: 123456                                          │')
    console.log('│ Função: Administrador                                   │')
    console.log('└─────────────────────────────────────────────────────────┘')
    console.log('\n🌐 Acesse: https://seu-projeto.vercel.app/admin')
    console.log('📱 Menu cliente: https://seu-projeto.vercel.app/client/menu')

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
