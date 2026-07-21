import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createStoreSchema, updateStoreSchema } from "@/lib/schemas"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })

  const store = await prisma.store.findUnique({ where: { ownerId: session.user.id } })
  if (!store) return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 })

  return NextResponse.json(store)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })

  const body = await req.json()
  const parsed = createStoreSchema.safeParse(body)

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Dados inválidos."
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const { name, slug, whatsapp, description } = parsed.data

  const slugTaken = await prisma.store.findUnique({ where: { slug } })
  if (slugTaken) {
    return NextResponse.json({ error: "Essa URL já está em uso. Escolha outra." }, { status: 409 })
  }

  const store = await prisma.store.create({
    data: { name, slug, whatsapp, description: description || null, ownerId: session.user.id },
  })

  return NextResponse.json(store, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })

  const existing = await prisma.store.findUnique({ where: { ownerId: session.user.id } })
  if (!existing) return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 })

  const body = await req.json()
  const parsed = updateStoreSchema.safeParse(body)

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Dados inválidos."
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const { name, slug, whatsapp, description, primaryColor } = parsed.data

  if (slug && slug !== existing.slug) {
    const slugTaken = await prisma.store.findUnique({ where: { slug } })
    if (slugTaken) {
      return NextResponse.json({ error: "Essa URL já está em uso." }, { status: 409 })
    }
  }

  const updated = await prisma.store.update({
    where: { id: existing.id },
    data: {
      name: name ?? existing.name,
      slug: slug ?? existing.slug,
      whatsapp: whatsapp ?? existing.whatsapp,
      description: description !== undefined ? description : existing.description,
      primaryColor: primaryColor ?? existing.primaryColor,
    },
  })

  return NextResponse.json(updated)
}
