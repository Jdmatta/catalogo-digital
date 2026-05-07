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
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
          Olá, {session.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm">
          Seu catálogo público está em{" "}
          <Link
            href={`/${store.slug}`}
            target="_blank"
            className="text-green-600 hover:text-green-700 font-semibold underline underline-offset-2 transition-colors"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          accent="green"
        />
        <StatCard
          label="Total de produtos"
          value={store._count.products}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          accent="blue"
        />
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Novo produto
          </Link>
          <Link
            href="/admin/produtos"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Ver produtos
          </Link>
          <Link
            href={`/${store.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ver catálogo público
          </Link>
        </div>
      </div>

      {/* Catalog URL card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/60 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-700 mb-1">Link do seu catálogo</p>
            <p className="text-xs text-slate-500 mb-3">Compartilhe esse link com seus clientes</p>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-lg truncate">
                /{store.slug}
              </code>
              <Link
                href={`/${store.slug}`}
                target="_blank"
                className="text-xs text-green-600 hover:text-green-700 font-semibold whitespace-nowrap transition-colors"
              >
                Abrir →
              </Link>
            </div>
          </div>
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
}: {
  label: string
  value: number
  icon: React.ReactNode
  accent: "green" | "blue"
}) {
  const colors = {
    green: { bg: "bg-green-50", text: "text-green-600", value: "text-green-700" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", value: "text-blue-700" },
  }
  const c = colors[accent]

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <div className={`w-8 h-8 ${c.bg} rounded-lg flex items-center justify-center ${c.text}`}>{icon}</div>
      </div>
      <p className={`text-3xl font-black ${c.value}`}>{value}</p>
    </div>
  )
}
