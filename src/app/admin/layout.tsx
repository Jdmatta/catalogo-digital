import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const initial = session.user?.name?.[0]?.toUpperCase() ?? session.user?.email?.[0]?.toUpperCase() ?? "U"

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col shadow-sm">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm shadow-green-200 group-hover:shadow-green-300 transition-shadow duration-200">
              <span className="text-white font-black text-sm">C</span>
            </div>
            <span className="font-bold text-slate-900 tracking-tight">CatálogoDigital</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.12em] px-3 mb-2">Menu</p>

          <NavLink href="/admin" icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }>Dashboard</NavLink>

          <NavLink href="/admin/produtos" icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }>Produtos</NavLink>

          <NavLink href="/admin/configuracoes" icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }>Configurações</NavLink>
        </nav>

        {/* User */}
        <div className="px-3 pb-4 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-7 h-7 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-700 truncate">{session.user?.name ?? "Usuário"}</p>
              <p className="text-[10px] text-slate-400 truncate">{session.user?.email}</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 px-3 py-2 mt-1 rounded-xl hover:bg-red-50 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 min-w-0">{children}</main>
    </div>
  )
}

function NavLink({
  href,
  children,
  icon,
}: {
  href: string
  children: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium group"
    >
      <span className="text-slate-400 group-hover:text-green-600 transition-colors duration-200">{icon}</span>
      {children}
    </Link>
  )
}
