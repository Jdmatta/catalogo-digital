import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CatalogView } from "@/components/catalog/CatalogView"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const store = await prisma.store.findUnique({ where: { slug } })
  if (!store) return { title: "Catálogo não encontrado" }
  return {
    title: `${store.name} — Cardápio Digital`,
    description: store.description ?? `Faça seu pedido pelo WhatsApp`,
  }
}

export default async function CatalogPage({ params }: Props) {
  const { slug } = await params
  const store = await prisma.store.findUnique({
    where: { slug, active: true },
    include: {
      categories: {
        include: {
          products: {
            where: { active: true },
            orderBy: { name: "asc" },
          },
        },
        orderBy: { name: "asc" },
      },
      products: {
        where: { active: true, categoryId: null },
        orderBy: { name: "asc" },
      },
    },
  })

  if (!store) notFound()

  return <CatalogView store={store} />
}
