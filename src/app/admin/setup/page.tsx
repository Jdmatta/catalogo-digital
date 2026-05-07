"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SetupPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function toSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = e.currentTarget
    const name = (form.elements.namedItem("name") as HTMLInputElement).value
    const slug = (form.elements.namedItem("slug") as HTMLInputElement).value
    const whatsapp = (form.elements.namedItem("whatsapp") as HTMLInputElement).value
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value

    const res = await fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, whatsapp, description }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erro ao criar loja.")
      return
    }

    router.push("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Configure sua loja</h1>
          <p className="text-gray-500 text-sm mt-1">
            Essas informações aparecem no seu catálogo público.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do negócio</label>
            <input
              name="name"
              type="text"
              required
              onChange={(e) => {
                const slugInput = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement
                if (slugInput) slugInput.value = toSlug(e.target.value)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Doces da Ana"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL do catálogo</label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400 whitespace-nowrap">catalogo.vercel.app/</span>
              <input
                name="slug"
                type="text"
                required
                pattern="[a-z0-9\-]+"
                title="Apenas letras minúsculas, números e hífens"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="doces-da-ana"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp (com DDD)
            </label>
            <input
              name="whatsapp"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="5511999999999"
            />
            <p className="text-xs text-gray-400 mt-1">Formato internacional: 55 + DDD + número</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Ex: Doces artesanais feitos com amor. Encomendas para festas e eventos."
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {loading ? "Criando loja..." : "Criar meu catálogo"}
          </button>
        </form>
      </div>
    </div>
  )
}
