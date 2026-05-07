import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-lg gradient-text">CatálogoDigital</span>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white px-4 py-2 rounded-xl transition-colors duration-200"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="btn-gradient text-sm font-semibold text-white px-5 py-2.5 rounded-xl"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 text-center">
        <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-zinc-300 font-medium">100% gratuito para começar</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
          Seu catálogo online
          <br />
          <span className="gradient-text">pronto em minutos</span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-lg mx-auto mb-10 leading-relaxed">
          Cadastre produtos, compartilhe o link e receba pedidos diretamente pelo WhatsApp — sem taxa, sem comissão.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="btn-gradient text-white font-semibold px-8 py-4 rounded-2xl text-base w-full sm:w-auto"
          >
            Criar meu catálogo — é grátis →
          </Link>
          <Link
            href="/login"
            className="glass hover:bg-white/[0.08] text-zinc-300 font-medium px-8 py-4 rounded-2xl text-base transition-all duration-200 w-full sm:w-auto"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
              title: "Cadastre seus produtos",
              desc: "Adicione fotos, preços e categorias em poucos cliques. Interface simples, resultado profissional.",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              ),
              title: "Compartilhe o link",
              desc: "Seu catálogo ganha uma URL exclusiva para divulgar no Instagram, WhatsApp ou onde quiser.",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                  <path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0012.05 0z" />
                </svg>
              ),
              title: "Receba no WhatsApp",
              desc: "O cliente monta o carrinho e envia o pedido já formatado direto para o seu WhatsApp.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="glass-card p-6 group hover:border-emerald-500/20 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="glass-card glow-emerald p-10 text-center">
          <h2 className="text-3xl font-bold mb-3">
            Pronto para <span className="gradient-text">começar?</span>
          </h2>
          <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
            Crie seu catálogo agora. É gratuito, não precisa de cartão de crédito.
          </p>
          <Link
            href="/register"
            className="btn-gradient inline-block text-white font-semibold px-8 py-4 rounded-2xl text-base"
          >
            Criar meu catálogo grátis →
          </Link>
        </div>
      </section>
    </main>
  )
}
