import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getOwnedProduct(productId: string, userId: string) {
  return prisma.product.findFirst({
    where: { id: productId, store: { ownerId: userId } },
  })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })

  const { id } = await params
  const existing = await getOwnedProduct(id, session.user.id)
  if (!existing) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 })

  const { name, description, price, imageUrl, categoryId, active } = await req.json()

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: name ?? existing.name,
      description: description !== undefined ? description : existing.description,
      price: price !== undefined ? Number(price) : existing.price,
      imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
      categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
      active: active !== undefined ? active : existing.active,
    },
    include: { category: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })

  const { id } = await params
  const existing = await getOwnedProduct(id, session.user.id)
  if (!existing) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 })

  await prisma.product.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
