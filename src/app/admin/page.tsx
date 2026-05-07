import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const store = await prisma.store.findUnique({
    where: { ownerId: session.user.id },
    include: { _count: { select: { products: true } } },
  })

  if (!store) redirect("/admin/setup")

  const activeProducts = await prisma.product.count({
    where: { storeId: store.id, active: true },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Olá, {session.user?.name} 👋</h1>
      <p className="text-gray-500 text-sm mb-8">
        Seu catálogo está em:{" "}
        <Link
          href={`/${store.slug}`}
          target="_blank"
          className="text-green-600 hover:underline font-medium"
        >
          /{store.slug}
        </Link>
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Produtos ativos" value={activeProducts} />
        <StatCard label="Total de produtos" value={store._count.products} />
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/produtos"
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          Gerenciar produtos
        </Link>
        <Link
          href={`/${store.slug}`}
          target="_blank"
          className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          Ver catálogo público
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )
}
