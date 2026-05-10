import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateProductSchema } from "@/lib/schemas"

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

  const body = await req.json()
  const parsed = updateProductSchema.safeParse(body)

  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Dados inválidos."
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const { name, description, price, imageUrl, categoryId, active } = parsed.data

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: name ?? existing.name,
      description: description !== undefined ? description : existing.description,
      price: price !== undefined ? price : existing.price,
      imageUrl: imageUrl !== undefined ? imageUrl || null : existing.imageUrl,
      categoryId: categoryId !== undefined ? categoryId || null : existing.categoryId,
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
