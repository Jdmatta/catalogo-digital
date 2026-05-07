"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Category = { id: string; name: string }

type FormValues = {
  name: string
  description: string
  price: string
  imageUrl: string
  categoryId: string
  active: boolean
}

type Props = {
  productId?: string
  initialValues?: Partial<FormValues>
}

const empty: FormValues = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  categoryId: "",
  active: true,
}

export default function ProdutoForm({ productId, initialValues }: Props) {
  const router = useRouter()
  const [values, setValues] = useState<FormValues>({ ...empty, ...initialValues })
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then(setCategories)
  }, [])

  function set(field: keyof FormValues, value: string | boolean) {
    setValues((v) => ({ ...v, [field]: value }))
  }

  async function addCategory() {
    if (!newCategory.trim()) return
    const res = await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory.trim() }),
    })
    const cat = await res.json()
    setCategories((c) => [...c, cat])
    setValues((v) => ({ ...v, categoryId: cat.id }))
    setNewCategory("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const body = {
      name: values.name,
      description: values.description || null,
      price: parseFloat(values.price.replace(",", ".")),
      imageUrl: values.imageUrl || null,
      categoryId: values.categoryId || null,
      active: values.active,
    }

    const res = await fetch(productId ? `/api/produtos/${productId}` : "/api/produtos", {
      method: productId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erro ao salvar produto.")
      return
    }

    router.push("/admin/produtos")
    router.refresh()
  }

  const labelClass = "block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider"
  const inputClass = "input-dark"

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className={labelClass}>Nome do produto *</label>
        <input
          type="text"
          required
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          className={inputClass}
          placeholder="Ex: Brigadeiro tradicional"
        />
      </div>

      <div>
        <label className={labelClass}>Descrição</label>
        <textarea
          rows={3}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className={`${inputClass} resize-none`}
          placeholder="Ex: Feito com chocolate belga, embalado individualmente."
        />
      </div>

      <div>
        <label className={labelClass}>Preço (R$) *</label>
        <input
          type="text"
          required
          inputMode="decimal"
          value={values.price}
          onChange={(e) => set("price", e.target.value)}
          className={inputClass}
          placeholder="Ex: 5,00"
        />
      </div>

      <div>
        <label className={labelClass}>URL da imagem</label>
        <input
          type="url"
          value={values.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          className={inputClass}
          placeholder="https://..."
        />
        <p className="text-xs text-zinc-600 mt-1.5">
          Cole o link de uma imagem do Imgur, Google Drive público ou similar.
        </p>
      </div>

      <div>
        <label className={labelClass}>Categoria</label>
        <select
          value={values.categoryId}
          onChange={(e) => set("categoryId", e.target.value)}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="" className="bg-zinc-900">Sem categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="bg-zinc-900">
              {c.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
            className={`${inputClass} flex-1`}
            placeholder="Nova categoria..."
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-4 py-2.5 text-sm border border-white/[0.10] bg-white/[0.06] hover:bg-white/[0.10] text-zinc-300 rounded-xl transition-all duration-200"
          >
            Adicionar
          </button>
        </div>
      </div>

      {productId && (
        <div className="flex items-center gap-3 py-1">
          <button
            type="button"
            onClick={() => set("active", !values.active)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
              values.active
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-zinc-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                values.active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-zinc-300">
            {values.active ? "Produto ativo — visível no catálogo" : "Produto inativo — oculto"}
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-gradient text-white font-semibold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {loading ? "Salvando..." : productId ? "Salvar alterações" : "Criar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="glass hover:bg-white/[0.08] text-zinc-300 font-medium px-6 py-2.5 rounded-xl text-sm transition-all duration-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
