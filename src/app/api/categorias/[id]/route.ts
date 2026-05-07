import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })

  const { id } = await params
  const categoria = await prisma.category.findFirst({
    where: { id, store: { ownerId: session.user.id } },
  })
  if (!categoria) return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 })

  await prisma.category.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
