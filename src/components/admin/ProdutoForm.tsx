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

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do produto *</label>
        <input
          type="text"
          required
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ex: Brigadeiro tradicional"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          rows={3}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          placeholder="Ex: Feito com chocolate belga, embalado individualmente."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
        <input
          type="text"
          required
          inputMode="decimal"
          value={values.price}
          onChange={(e) => set("price", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ex: 5,00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL da imagem</label>
        <input
          type="url"
          value={values.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="https://..."
        />
        <p className="text-xs text-gray-400 mt-1">
          Cole o link de uma imagem do Imgur, Google Drive público ou similar.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
        <div className="flex gap-2">
          <select
            value={values.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Nova categoria..."
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          >
            Adicionar
          </button>
        </div>
      </div>

      {productId && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set("active", !values.active)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              values.active ? "bg-green-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                values.active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">
            {values.active ? "Produto ativo (visível no catálogo)" : "Produto inativo (oculto)"}
          </span>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {loading ? "Salvando..." : productId ? "Salvar alterações" : "Criar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
