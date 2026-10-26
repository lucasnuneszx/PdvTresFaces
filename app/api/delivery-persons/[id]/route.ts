import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const allowedRoles = ['ADMIN', 'MANAGER']
    if (!allowedRoles.includes(session.user.role as any)) {
      return NextResponse.json(
        { message: 'Sem permissão' },
        { status: 403 }
      )
    }

    const personId = params.id
    const { name, phone, plate, status, isActive } = await request.json()

    if (!name || !phone) {
      return NextResponse.json(
        { message: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      )
    }

    const existingPerson = await prisma.deliveryPerson.findFirst({
      where: { 
        phone,
        id: { not: personId }
      }
    })

    if (existingPerson) {
      return NextResponse.json(
        { message: 'Já existe outro motoboy cadastrado com este telefone' },
        { status: 400 }
      )
    }

    const updatedPerson = await prisma.deliveryPerson.update({
      where: { id: personId },
      data: {
        name,
        phone,
        plate: plate || null,
        status: status || 'OFFLINE',
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(updatedPerson)
  } catch (error) {
    console.error('Erro ao atualizar motoboy:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const allowedRoles = ['ADMIN', 'MANAGER']
    if (!allowedRoles.includes(session.user.role as any)) {
      return NextResponse.json(
        { message: 'Sem permissão' },
        { status: 403 }
      )
    }

    const personId = params.id

    const ordersWithPerson = await prisma.order.findFirst({
      where: { deliveryPerson: { not: null } }
    })

    if (ordersWithPerson) {
      return NextResponse.json(
        { message: 'Não é possível excluir motoboy que já foi usado em pedidos' },
        { status: 400 }
      )
    }

    await prisma.deliveryPerson.delete({
      where: { id: personId }
    })

    return NextResponse.json({ message: 'Motoboy excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir motoboy:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
