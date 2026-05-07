import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import ProdutoForm from "@/components/admin/ProdutoForm"
import Link from "next/link"

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const { id } = await params
  const product = await prisma.product.findFirst({
    where: { id, store: { ownerId: session.user.id } },
  })

  if (!product) notFound()

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/produtos" className="text-gray-400 hover:text-gray-600 text-sm">
          Produtos
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-700 truncate max-w-xs">{product.name}</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Editar produto</h1>

      <ProdutoForm
        productId={product.id}
        initialValues={{
          name: product.name,
          description: product.description ?? "",
          price: product.price.toFixed(2).replace(".", ","),
          imageUrl: product.imageUrl ?? "",
          categoryId: product.categoryId ?? "",
          active: product.active,
        }}
      />
    </div>
  )
}
