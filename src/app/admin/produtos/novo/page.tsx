import ProdutoForm from "@/components/admin/ProdutoForm"
import Link from "next/link"

export default function NovoProdutoPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/produtos" className="text-gray-400 hover:text-gray-600 text-sm">
          Produtos
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-700">Novo produto</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Novo produto</h1>

      <ProdutoForm />
    </div>
  )
}
