"use client"

import { useEffect, useState } from "react"

type StoreData = {
  name: string
  slug: string
  whatsapp: string
  description: string
  primaryColor: string
}

export default function ConfiguracoesPage() {
  const [values, setValues] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/store")
      .then((r) => r.json())
      .then((data) => {
        setValues({
          name: data.name ?? "",
          slug: data.slug ?? "",
          whatsapp: data.whatsapp ?? "",
          description: data.description ?? "",
          primaryColor: data.primaryColor ?? "#16a34a",
        })
        setLoading(false)
      })
  }, [])

  function set(field: keyof StoreData, value: string) {
    setValues((v) => (v ? { ...v, [field]: value } : v))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)

    const res = await fetch("/api/store", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    setSaving(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erro ao salvar.")
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-xl">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!values) return null

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Configurações da loja</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do negócio</label>
          <input
            type="text"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL do catálogo</label>
          <input
            type="text"
            required
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
            pattern="[a-z0-9\-]+"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
          <input
            type="text"
            required
            value={values.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="5511999999999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            rows={3}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cor principal</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={values.primaryColor}
              onChange={(e) => set("primaryColor", e.target.value)}
              className="h-10 w-16 rounded-lg border border-gray-300 cursor-pointer p-1"
            />
            <span className="text-sm text-gray-500 font-mono">{values.primaryColor}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        {success && (
          <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            Configurações salvas com sucesso.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {saving ? "Salvando..." : "Salvar configurações"}
        </button>
      </form>
    </div>
  )
}
