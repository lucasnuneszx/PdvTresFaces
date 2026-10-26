const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupVercel() {
  try {
    console.log('Configurando sistema para Vercel...')

    // 1. Criar configurações padrão
    console.log('Criando configurações padrão...')
    await prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        restaurantName: 'Estabelecimento',
        restaurantAddress: 'Endereço do Estabelecimento',
        restaurantPhone: '(11) 99999-9999',
        restaurantEmail: 'contato@estabelecimento.com',
        deliveryFee: 5.00,
        minOrderValue: 25.00,
        taxRate: 0,
        autoPrint: true,
        printerPort: '9100',
        deliveryEstimate: '35 - 70min',
        isOpen: true,
        openingHours: 'Seg-Dom: 18h-23h'
      }
    })

    // 2. Criar usuários administrativos
    console.log('Criando usuários administrativos...')
    const hashedPassword = await bcrypt.hash('123456', 12)

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
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      })
    }

    // 3. Criar categorias básicas
    console.log('Criando categorias básicas...')
    const categories = [
      {
        name: 'Pratos Tradicionais',
        description: 'Nossos pratos mais populares',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        order: 1
      },
      {
        name: 'Pratos Especiais',
        description: 'Pratos com ingredientes especiais',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
        order: 2
      },
      {
        name: 'Sobremesas',
        description: 'Sobremesas deliciosas',
        image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop',
        order: 3
      },
      {
        name: 'Bebidas',
        description: 'Refrigerantes, sucos e cervejas',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        order: 4
      }
    ]

    for (const categoryData of categories) {
      await prisma.category.upsert({
        where: { name: categoryData.name },
        update: {},
        create: categoryData
      })
    }

    console.log('\nSistema configurado com sucesso!')
    console.log('\nCredenciais de acesso:')
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
    console.log('\nURLs importantes:')
    console.log('• Admin: /admin')
    console.log('• Menu Cliente: /client/menu')
    console.log('• Credenciais: /credentials')

  } catch (error) {
    console.error('Erro ao configurar sistema:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupVercel()
