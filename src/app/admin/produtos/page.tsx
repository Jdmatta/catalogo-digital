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
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Produtos</h1>
          <p className="text-zinc-400 text-sm mt-0.5">Gerencie o seu catálogo</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
        >
          + Novo produto
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-white/[0.04] rounded-xl animate-pulse border border-white/[0.06]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-1">Nenhum produto ainda</p>
          <p className="text-sm text-zinc-500 mb-6">Adicione seu primeiro produto para aparecer no catálogo.</p>
          <Link href="/admin/produtos/novo" className="btn-gradient text-white text-sm font-semibold px-6 py-2.5 rounded-xl inline-block">
            + Novo produto
          </Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/[0.06]">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Produto</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Categoria</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Preço</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-9 h-9 rounded-lg object-cover bg-zinc-800 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-base">
                          📦
                        </div>
                      )}
                      <span className="font-medium text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500">
                    {p.category?.name ?? <span className="text-zinc-700">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-white font-semibold">
                    R$ {p.price.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200 ${
                        p.active
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25"
                          : "bg-zinc-800 text-zinc-500 border border-white/[0.08] hover:bg-zinc-700"
                      }`}
                    >
                      {p.active ? "● Ativo" : "○ Inativo"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/produtos/${p.id}`}
                        className="text-zinc-400 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/[0.08] transition-all"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-zinc-500 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
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
