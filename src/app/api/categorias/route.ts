import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })

  const store = await prisma.store.findUnique({ where: { ownerId: session.user.id } })
  if (!store) return NextResponse.json([], { status: 200 })

  const categorias = await prisma.category.findMany({
    where: { storeId: store.id },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(categorias)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })

  const store = await prisma.store.findUnique({ where: { ownerId: session.user.id } })
  if (!store) return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 })

  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: "Nome obrigatório." }, { status: 400 })

  const categoria = await prisma.category.create({
    data: { name, storeId: store.id },
  })

  return NextResponse.json(categoria, { status: 201 })
}
