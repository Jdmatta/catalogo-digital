import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-zinc-950 flex text-white">
      {/* Sidebar */}
      <aside className="w-60 bg-zinc-900/80 border-r border-white/[0.06] flex flex-col py-6 px-4 gap-1 fixed h-full">
        <Link href="/admin" className="px-3 mb-6 block">
          <span className="text-base font-bold gradient-text">CatálogoDigital</span>
        </Link>

        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-3 mb-2">
          Menu
        </p>

        <NavLink
          href="/admin"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          href="/admin/produtos"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        >
          Produtos
        </NavLink>

        <NavLink
          href="/admin/configuracoes"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        >
          Configurações
        </NavLink>

        {/* Bottom */}
        <div className="mt-auto border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {session.user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <p className="text-xs text-zinc-400 truncate">{session.user?.email}</p>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair da conta
          </Link>
        </div>
      </aside>

      <main className="flex-1 ml-60 p-8 min-h-screen">{children}</main>
    </div>
  )
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] px-3 py-2.5 rounded-xl transition-all duration-200"
    >
      <span className="text-zinc-500 group-hover:text-emerald-400 transition-colors">{icon}</span>
      {children}
    </Link>
  )
}
