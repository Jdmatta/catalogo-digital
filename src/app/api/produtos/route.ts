import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })

  const store = await prisma.store.findUnique({ where: { ownerId: session.user.id } })
  if (!store) return NextResponse.json([])

  const produtos = await prisma.product.findMany({
    where: { storeId: store.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(produtos)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })

  const store = await prisma.store.findUnique({ where: { ownerId: session.user.id } })
  if (!store) return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 })

  const { name, description, price, imageUrl, categoryId } = await req.json()

  if (!name || price === undefined) {
    return NextResponse.json({ error: "Nome e preço são obrigatórios." }, { status: 400 })
  }

  const produto = await prisma.product.create({
    data: {
      name,
      description: description || null,
      price: Number(price),
      imageUrl: imageUrl || null,
      categoryId: categoryId || null,
      storeId: store.id,
    },
    include: { category: true },
  })

  return NextResponse.json(produto, { status: 201 })
}
