import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createProductSchema } from "@/lib/schemas"

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

  const body = await req.json()
  const parsed = createProductSchema.safeParse(body)

  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Dados inválidos."
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const { name, description, price, imageUrl, categoryId } = parsed.data

  const produto = await prisma.product.create({
    data: {
      name,
      description: description || null,
      price,
      imageUrl: imageUrl || null,
      categoryId: categoryId || null,
      storeId: store.id,
    },
    include: { category: true },
  })

  return NextResponse.json(produto, { status: 201 })
}
