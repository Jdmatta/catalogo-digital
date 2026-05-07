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
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Olá, {session.user?.name} 👋
        </h1>
        <p className="text-zinc-400 text-sm">
          Seu catálogo está em{" "}
          <Link
            href={`/${store.slug}`}
            target="_blank"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            /{store.slug}
          </Link>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Produtos ativos"
          value={activeProducts}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          accent="from-emerald-500/20 to-teal-500/20 border-emerald-500/20"
          iconColor="text-emerald-400"
        />
        <StatCard
          label="Total de produtos"
          value={store._count.products}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          accent="from-cyan-500/20 to-blue-500/20 border-cyan-500/20"
          iconColor="text-cyan-400"
        />
      </div>

      {/* Actions */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/produtos/novo"
            className="btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
          >
            + Novo produto
          </Link>
          <Link
            href="/admin/produtos"
            className="glass hover:bg-white/[0.08] text-zinc-300 text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200"
          >
            Gerenciar produtos
          </Link>
          <Link
            href={`/${store.slug}`}
            target="_blank"
            className="glass hover:bg-white/[0.08] text-zinc-300 text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2"
          >
            Ver catálogo público
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  accent,
  iconColor,
}: {
  label: string
  value: number
  icon: React.ReactNode
  accent: string
  iconColor: string
}) {
  return (
    <div className="glass-card p-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent} border flex items-center justify-center ${iconColor} mb-3`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-zinc-400 mt-0.5">{label}</p>
    </div>
  )
}
