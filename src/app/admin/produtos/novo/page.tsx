import ProdutoForm from "@/components/admin/ProdutoForm"
import Link from "next/link"

export default function NovoProdutoPage() {
  return (
    <div className="animate-fade-in">
      <nav className="flex items-center gap-2 mb-8 text-sm">
        <Link href="/admin/produtos" className="text-slate-400 hover:text-slate-700 transition-colors font-medium">
          Produtos
        </Link>
        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-700 font-medium">Novo produto</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Novo produto</h1>
        <p className="text-slate-500 text-sm">Preencha as informações do produto</p>
      </div>

      <ProdutoForm />
    </div>
  )
}
