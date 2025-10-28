const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateCategoryOrder() {
  try {
    console.log('🔄 Atualizando ordem das categorias...')

    // Definir a ordem desejada
    const categoryOrder = [
      { name: 'Combos', order: 1 },
      { name: 'Pratos Tradicionais', order: 2 },
      { name: 'Pratos Especiais', order: 3 },
      { name: 'Sobremesas', order: 4 },
      { name: 'Hambúrgueres', order: 5 },
      { name: 'Bebidas', order: 6 }
    ]

    // Atualizar cada categoria com sua ordem
    for (const category of categoryOrder) {
      await prisma.category.updateMany({
        where: { name: category.name },
        data: { order: category.order }
      })
      console.log(`✅ ${category.name} -> ordem ${category.order}`)
    }

    console.log('✅ Ordem das categorias atualizada com sucesso!')
    console.log('📋 Nova ordem:')
    categoryOrder.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name}`)
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar ordem das categorias:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCategoryOrder()
