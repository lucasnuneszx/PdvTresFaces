import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const allowedRoles = ['ADMIN', 'MANAGER', 'CASHIER']
    if (!allowedRoles.includes(session.user.role as any)) {
      return NextResponse.json(
        { message: 'Sem permissão' },
        { status: 403 }
      )
    }

    const { amount, description } = await request.json()

    const lastCashLog = await prisma.cashLog.findFirst({
      where: {
        type: {
          in: ['OPEN', 'CLOSE']
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!lastCashLog || lastCashLog.type === 'CLOSE') {
      return NextResponse.json(
        { message: 'Caixa não está aberto' },
        { status: 400 }
      )
    }

    const cashLog = await prisma.cashLog.create({
      data: {
        type: 'CLOSE',
        amount: amount || 0,
        description: description || 'Fechamento do caixa'
      }
    })

    return NextResponse.json(cashLog, { status: 201 })
  } catch (error) {
    console.error('Erro ao fechar caixa:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}



