import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="font-bold text-gray-900 text-lg">CatálogoDigital</span>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Criar catálogo grátis
          </Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <span className="inline-block bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
          100% gratuito para começar
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Seu catálogo online pronto
          <br />
          <span className="text-green-600">em minutos</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
          Cadastre seus produtos, compartilhe o link e receba pedidos diretamente pelo WhatsApp. Sem
          taxa, sem comissão, sem complicação.
        </p>
        <Link
          href="/register"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
        >
          Começar agora — é grátis
        </Link>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              emoji: "📦",
              title: "Cadastre seus produtos",
              desc: "Adicione fotos, preços e categorias em poucos cliques.",
            },
            {
              emoji: "🔗",
              title: "Compartilhe o link",
              desc: "Seu catálogo tem uma URL exclusiva para divulgar onde quiser.",
            },
            {
              emoji: "💬",
              title: "Receba pedidos no WhatsApp",
              desc: "O cliente monta o carrinho e envia o pedido já formatado para você.",
            },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="text-3xl mb-3">{emoji}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
