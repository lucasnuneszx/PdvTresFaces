import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@teste.com' }
    })

    let user

    if (existingUser) {
      user = await prisma.user.update({
        where: { email: 'admin@teste.com' },
        data: { role: 'ADMIN' }
      })
    } else {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('123456', 12)
      
      user = await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@teste.com',
          password: hashedPassword,
          role: 'ADMIN',
          phone: '(11) 99999-9999'
        }
      })
    }

    return NextResponse.json({
      message: 'Usuário ADMIN configurado com sucesso',
      user: {
        email: user.email,
        role: user.role,
        name: user.name
      },
      credentials: {
        email: 'admin@teste.com',
        password: '123456'
      }
    })

  } catch (error) {
    console.error('Erro ao configurar usuário ADMIN:', error)
    return NextResponse.json({
      message: 'Erro ao configurar usuário ADMIN',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
