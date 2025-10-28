import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUsers() {
  try {
    console.log('Criando usuários administrativos...')

    // Hash da senha padrão
    const hashedPassword = await bcrypt.hash('123456', 12)

    // Criar usuários administrativos
    const users = [
      {
        name: 'Administrador',
        email: 'admin@estabelecimento.com',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '(11) 99999-0001'
      },
      {
        name: 'Gerente',
        email: 'gerente@estabelecimento.com',
        password: hashedPassword,
        role: 'MANAGER',
        phone: '(11) 99999-0002'
      },
      {
        name: 'Caixa',
        email: 'caixa@estabelecimento.com',
        password: hashedPassword,
        role: 'CASHIER',
        phone: '(11) 99999-0003'
      },
      {
        name: 'Cozinha',
        email: 'cozinha@estabelecimento.com',
        password: hashedPassword,
        role: 'KITCHEN',
        phone: '(11) 99999-0004'
      }
    ]

    for (const userData of users) {
      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (!existingUser) {
        const user = await prisma.user.create({
          data: userData
        })
        console.log(`✅ Usuário criado: ${user.name} (${user.email}) - Senha: 123456`)
      } else {
        console.log(`⚠️  Usuário já existe: ${userData.email}`)
      }
    }

    console.log('\n🎉 Usuários administrativos criados com sucesso!')
    console.log('\n📋 Credenciais de acesso:')
    console.log('┌─────────────────────────────────────────────────────────┐')
    console.log('│                    ESTABELECIMENTO                       │')
    console.log('├─────────────────────────────────────────────────────────┤')
    console.log('│ Email: admin@estabelecimento.com                        │')
    console.log('│ Senha: 123456                                          │')
    console.log('│ Função: Administrador                                   │')
    console.log('├─────────────────────────────────────────────────────────┤')
    console.log('│ Email: gerente@estabelecimento.com                      │')
    console.log('│ Senha: 123456                                          │')
    console.log('│ Função: Gerente                                         │')
    console.log('├─────────────────────────────────────────────────────────┤')
    console.log('│ Email: caixa@estabelecimento.com                        │')
    console.log('│ Senha: 123456                                          │')
    console.log('│ Função: Caixa                                           │')
    console.log('├─────────────────────────────────────────────────────────┤')
    console.log('│ Email: cozinha@estabelecimento.com                      │')
    console.log('│ Senha: 123456                                          │')
    console.log('│ Função: Cozinha                                         │')
    console.log('└─────────────────────────────────────────────────────────┘')

  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUsers()


