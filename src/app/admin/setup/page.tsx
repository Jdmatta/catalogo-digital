"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

  const fieldClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-500 transition-all duration-200"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-green-50/40 px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
              <span className="text-white font-black text-lg">C</span>
            </div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">CatálogoDigital</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500" />

          <div className="p-8">
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold">1</div>
              <div className="flex-1 h-0.5 bg-slate-200" />
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-400 text-xs font-bold">2</div>
              <div className="flex-1 h-0.5 bg-slate-200" />
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-400 text-xs font-bold">3</div>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Configure sua loja</h1>
              <p className="text-slate-500 text-sm mt-1.5">
                Essas informações aparecem no seu catálogo público.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">
                  Nome do negócio
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  onChange={(e) => {
                    const slugInput = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement
                    if (slugInput) slugInput.value = toSlug(e.target.value)
                  }}
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
                    name="slug"
                    type="text"
                    required
                    pattern="[a-z0-9\-]+"
                    title="Apenas letras minúsculas, números e hífens"
                    className="flex-1 px-2 py-3 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                    placeholder="doces-da-ana"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">
                  WhatsApp (com DDD)
                </label>
                <input name="whatsapp" type="text" required className={fieldClass} placeholder="5511999999999" />
                <p className="text-xs text-slate-400 mt-1.5">Formato: 55 + DDD + número</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">
                  Descrição <span className="text-slate-300 normal-case font-normal">(opcional)</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className={`${fieldClass} resize-none`}
                  placeholder="Ex: Doces artesanais feitos com amor. Encomendas para festas e eventos."
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl animate-fade-in">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 active:translate-y-0 mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Criando sua loja...
                  </span>
                ) : "Criar meu catálogo →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
