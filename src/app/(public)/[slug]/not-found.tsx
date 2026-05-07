import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="text-5xl mb-4">🔍</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Catálogo não encontrado</h1>
      <p className="text-gray-500 mb-6">
        Este link pode ter mudado ou o catálogo está desativado.
      </p>
      <Link
        href="/"
        className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
      >
        Criar meu catálogo
      </Link>
    </div>
  )
}
