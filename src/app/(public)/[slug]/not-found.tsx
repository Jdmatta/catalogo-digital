import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-green-50/30 px-4 text-center">
      <div className="animate-fade-in">
        <div className="w-20 h-20 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center text-4xl mx-auto mb-6">
          🔍
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Catálogo não encontrado</h1>
        <p className="text-slate-500 mb-8 max-w-sm">
          Este link pode ter mudado ou o catálogo está desativado.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition-all duration-200 shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 active:translate-y-0"
        >
          Criar meu catálogo grátis
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
