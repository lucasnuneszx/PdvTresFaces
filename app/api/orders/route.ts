import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            combo: true
          }
        },
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const { items, deliveryType, paymentMethod, addressId, notes, total, customer, address, customPizzas } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Nenhum item encontrado no pedido')
      return NextResponse.json(
        { message: 'Nenhum item encontrado no pedido' },
        { status: 400 }
      )
    }

    if (!deliveryType || !paymentMethod || !total) {
      console.error('Dados obrigatórios ausentes', { deliveryType, paymentMethod, total })
      return NextResponse.json(
        { message: 'Dados obrigatórios ausentes' },
        { status: 400 }
      )
    }

    if (deliveryType === 'DELIVERY' && !addressId && !address) {
      console.error('Endereço obrigatório para entrega')
      return NextResponse.json(
        { message: 'Endereço obrigatório para entrega' },
        { status: 400 }
      )
    }

    let userId = session?.user?.id
    let orderAddressId = addressId

    // Se não estiver logado, criar ou buscar usuário público
    if (!userId) {
      try {
        if (!customer || !customer.name || !customer.phone) {
          console.error('Dados do cliente obrigatórios')
          return NextResponse.json(
            { message: 'Dados do cliente obrigatórios' },
            { status: 400 }
          )
        }

        let publicUser = await prisma.user.findUnique({
          where: { email: 'public@estabelecimento.com' }
        })

        if (!publicUser) {
          publicUser = await prisma.user.create({
            data: {
              email: 'public@estabelecimento.com',
              name: 'Cliente Público',
              role: 'CLIENT',
              isActive: true
            }
          })
        }

        userId = publicUser.id

        if (deliveryType === 'DELIVERY' && address && !addressId) {
          const newAddress = await prisma.address.create({
            data: {
              userId: userId,
              street: address.street,
              number: address.number,
              complement: address.complement || '',
              neighborhood: address.neighborhood,
              city: address.city,
              state: address.state,
              zipCode: address.zipCode,
              isDefault: true
            }
          })
          orderAddressId = newAddress.id
        }
      } catch (error) {
        console.error('Erro ao criar/buscar usuário público:', error)
        return NextResponse.json(
          { message: 'Erro ao processar dados do cliente' },
          { status: 500 }
        )
      }
    }

    for (const item of items) {
      if (!item.comboId || !item.quantity || !item.price) {
        console.error('Dados de item inválidos:', item)
        return NextResponse.json(
          { message: 'Dados de item inválidos' },
          { status: 400 }
        )
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: userId,
        addressId: orderAddressId,
        total: parseFloat(total.toString()),
        deliveryType,
        paymentMethod,
        notes: notes || '',
        status: 'PENDING'
      }
    })

    await prisma.orderItem.createMany({
      data: items.map((item: any) => ({
        orderId: order.id,
        comboId: item.comboId,
        quantity: parseInt(item.quantity.toString()),
        price: parseFloat(item.price.toString())
      }))
    })

    if (customPizzas && customPizzas.length > 0) {
      for (const customPizza of customPizzas) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            comboId: 'custom-pizza',
            quantity: 1,
            price: parseFloat(customPizza.totalPrice.toString()),
            pizzaSizeId: customPizza.size?.id,
            selectedFlavors: JSON.stringify(customPizza.flavors?.map((f: any) => f.id) || []),
            observations: customPizza.observations || '',
            extras: JSON.stringify({
              stuffedCrust: customPizza.stuffedCrust || false,
              premiumFlavors: customPizza.flavors?.filter((f: any) => f.type === 'PREMIUM').length || 0,
              especialFlavors: customPizza.flavors?.filter((f: any) => f.type === 'ESPECIAL').length || 0
            })
          }
        })
      }
    }

    // Registrar venda no caixa (não crítico se falhar)
    try {
      const cashResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/cash/sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: total
        }),
      })
      
      if (!cashResponse.ok) {
        console.warn('Erro ao registrar venda no caixa, mas pedido foi criado')
      }
    } catch (error) {
      console.warn('Erro ao registrar venda no caixa:', error)
    }

    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            combo: true
          }
        },
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json(completeOrder, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
