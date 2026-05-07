import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-4 gap-1">
        <span className="text-sm font-bold text-gray-900 px-3 mb-4">CatálogoDigital</span>

        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/produtos">Produtos</NavLink>
        <NavLink href="/admin/configuracoes">Configurações</NavLink>

        <div className="mt-auto">
          <p className="text-xs text-gray-400 px-3 truncate">{session.user?.email}</p>
          <Link
            href="/api/auth/signout"
            className="block text-sm text-red-500 hover:text-red-700 px-3 py-2 mt-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            Sair
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
    >
      {children}
    </Link>
  )
}
