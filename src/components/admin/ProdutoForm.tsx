"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
      toast.error(data.error ?? "Erro ao salvar produto.")
      return
    }

    toast.success(productId ? "Produto atualizado!" : "Produto criado!")
    router.push("/admin/produtos")
    router.refresh()
  }

  const fieldClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-500 transition-all duration-200"

  const labelClass = "block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2"

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5 mb-5">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide pb-2 border-b border-slate-100">
          Informações do produto
        </h2>

        <div>
          <label className={labelClass}>Nome do produto *</label>
          <input
            type="text"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className={fieldClass}
            placeholder="Ex: Brigadeiro tradicional"
          />
        </div>

        <div>
          <label className={labelClass}>Descrição</label>
          <textarea
            rows={3}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className={`${fieldClass} resize-none`}
            placeholder="Ex: Feito com chocolate belga, embalado individualmente."
          />
        </div>

        <div>
          <label className={labelClass}>Preço (R$) *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
            <input
              type="text"
              required
              inputMode="decimal"
              value={values.price}
              onChange={(e) => set("price", e.target.value)}
              className={`${fieldClass} pl-10`}
              placeholder="5,00"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>URL da imagem</label>
          <input
            type="url"
            value={values.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            className={fieldClass}
            placeholder="https://..."
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Cole o link de uma imagem do Imgur, Google Drive público ou similar.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 mb-5">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide pb-2 border-b border-slate-100">
          Categoria
        </h2>

        <div>
          <label className={labelClass}>Selecionar categoria</label>
          <select
            value={values.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className={fieldClass}
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Nova categoria</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
              className={`${fieldClass} flex-1`}
              placeholder="Nome da categoria..."
            />
            <button
              type="button"
              onClick={addCategory}
              className="px-4 py-3 text-sm border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-600 font-medium whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0"
            >
              + Adicionar
            </button>
          </div>
        </div>
      </div>

      {productId && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide pb-2 border-b border-slate-100 mb-4">
            Visibilidade
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {values.active ? "Produto ativo" : "Produto inativo"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {values.active ? "Visível no catálogo público" : "Oculto do catálogo público"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("active", !values.active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                values.active ? "bg-green-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  values.active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-7 py-3 rounded-xl text-sm transition-all duration-200 shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </>
          ) : productId ? "Salvar alterações" : "Criar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 font-semibold px-7 py-3 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
