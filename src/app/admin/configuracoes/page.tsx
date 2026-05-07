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

  const fieldClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-500 transition-all duration-200"

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="h-8 w-48 bg-slate-100 rounded-xl animate-pulse mb-8" />
        <div className="max-w-xl space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!values) return null

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Configurações da loja</h1>
        <p className="text-slate-500 text-sm">Personalize as informações do seu catálogo público</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5 mb-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide pb-2 border-b border-slate-100">
            Informações básicas
          </h2>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">
              Nome do negócio
            </label>
            <input
              type="text"
              required
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              className={fieldClass}
              placeholder="Ex: Doces da Ana"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">
              URL do catálogo
            </label>
            <div className="flex items-center gap-0 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500/25 focus-within:border-green-500 transition-all duration-200 bg-slate-50">
              <span className="text-sm text-slate-400 whitespace-nowrap pl-4 pr-1 font-mono">catalogo.app/</span>
              <input
                type="text"
                required
                value={values.slug}
                onChange={(e) => set("slug", e.target.value)}
                pattern="[a-z0-9\-]+"
                className="flex-1 px-2 py-3 bg-transparent text-sm text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">
              WhatsApp
            </label>
            <input
              type="text"
              required
              value={values.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              className={fieldClass}
              placeholder="5511999999999"
            />
            <p className="text-xs text-slate-400 mt-1.5">Formato: 55 + DDD + número</p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">
              Descrição
            </label>
            <textarea
              rows={3}
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              className={`${fieldClass} resize-none`}
              placeholder="Descreva seu negócio..."
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide pb-2 border-b border-slate-100 mb-5">
            Aparência
          </h2>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-3">
              Cor principal
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="color"
                  value={values.primaryColor}
                  onChange={(e) => set("primaryColor", e.target.value)}
                  className="h-12 w-16 rounded-xl border border-slate-200 cursor-pointer p-1 bg-slate-50"
                />
              </div>
              <div>
                <p className="text-sm font-mono font-semibold text-slate-700">{values.primaryColor}</p>
                <p className="text-xs text-slate-400 mt-0.5">Cor dos botões e destaques</p>
              </div>
              <div
                className="ml-auto w-10 h-10 rounded-xl shadow-sm border border-slate-100"
                style={{ backgroundColor: values.primaryColor }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl animate-fade-in mb-4">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-100 px-4 py-3 rounded-xl animate-fade-in mb-4">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Configurações salvas com sucesso!
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-7 py-3 rounded-xl text-sm transition-all duration-200 shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </>
          ) : "Salvar configurações"}
        </button>
      </form>
    </div>
  )
}
