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
    <div className="animate-fade-in">
      <nav className="flex items-center gap-2 mb-8 text-sm">
        <Link href="/admin/produtos" className="text-slate-400 hover:text-slate-700 transition-colors font-medium">
          Produtos
        </Link>
        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-700 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Editar produto</h1>
        <p className="text-slate-500 text-sm">Atualize as informações do produto</p>
      </div>

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
