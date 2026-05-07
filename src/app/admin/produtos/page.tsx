"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Category = { id: string; name: string }
type Product = {
  id: string
  name: string
  price: number
  imageUrl: string | null
  active: boolean
  category: Category | null
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch("/api/produtos")
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleActive(product: Product) {
    await fetch(`/api/produtos/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active }),
    })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este produto?")) return
    await fetch(`/api/produtos/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          + Novo produto
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium mb-2">Nenhum produto ainda</p>
          <p className="text-sm">Clique em &quot;+ Novo produto&quot; para começar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Produto</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Categoria</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Preço</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xl">
                          📦
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {p.category?.name ?? (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    R$ {p.price.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        p.active
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {p.active ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/produtos/${p.id}`}
                        className="text-gray-400 hover:text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
