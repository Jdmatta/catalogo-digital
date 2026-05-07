import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm shadow-green-200">
              <span className="text-white font-black text-sm">C</span>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">CatálogoDigital</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 font-medium"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-semibold shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50/60 -z-10" />
        <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-green-200/25 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-24 -left-48 w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-6xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200/80 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            100% gratuito para pequenos negócios
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-slate-900 leading-[1.05] tracking-tight mb-6 animate-fade-in-delay-1">
            Seu catálogo online
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-500 bg-clip-text text-transparent">
              pronto em minutos
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-delay-2">
            Cadastre seus produtos, compartilhe o link e receba pedidos pelo WhatsApp.{" "}
            <span className="text-slate-700 font-semibold">Sem taxa. Sem comissão. Sem complicação.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-1 active:translate-y-0"
            >
              Criar meu catálogo — é grátis
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium text-base transition-colors"
            >
              Já tenho conta
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] font-black text-green-600 tracking-[0.15em] uppercase mb-3">Como funciona</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">Simples assim</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Em três passos, seu negócio tem presença digital profissional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                emoji: "📦",
                title: "Cadastre seus produtos",
                desc: "Adicione fotos, preços e categorias em poucos cliques. Interface simples, resultado profissional.",
                gradient: "from-blue-500 to-indigo-600",
                soft: "bg-blue-50",
              },
              {
                step: "02",
                emoji: "🔗",
                title: "Compartilhe o link",
                desc: "Seu catálogo tem uma URL exclusiva para divulgar no Instagram, WhatsApp ou onde quiser.",
                gradient: "from-violet-500 to-purple-600",
                soft: "bg-violet-50",
              },
              {
                step: "03",
                emoji: "💬",
                title: "Receba pedidos",
                desc: "O cliente monta o carrinho e envia o pedido já formatado direto no seu WhatsApp.",
                gradient: "from-green-500 to-emerald-600",
                soft: "bg-green-50",
              },
            ].map(({ step, emoji, title, desc, gradient, soft }) => (
              <div
                key={title}
                className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-default"
              >
                <div className={`w-14 h-14 ${soft} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {emoji}
                </div>
                <div className={`text-[10px] font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent tracking-[0.18em] uppercase mb-3`}>
                  Passo {step}
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-3 leading-snug">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { value: "100%", label: "Gratuito para começar" },
              { value: "0%", label: "Taxa sobre seus pedidos" },
              { value: "∞", label: "Produtos no catálogo" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">{value}</div>
                <div className="text-slate-500 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-28 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
            Pronto para vender mais?
          </h2>
          <p className="text-green-100 text-lg mb-10 leading-relaxed">
            Crie seu catálogo agora e comece a receber pedidos pelo WhatsApp ainda hoje.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-green-700 font-bold px-9 py-4 rounded-2xl text-base transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
          >
            Criar meu catálogo agora — é grátis
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">C</span>
            </div>
            <span className="font-bold text-white tracking-tight">CatálogoDigital</span>
          </div>
          <p className="text-slate-500 text-sm">Feito com ❤️ para pequenos negócios brasileiros</p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-slate-400 hover:text-slate-300 text-sm transition-colors">Entrar</Link>
            <Link href="/register" className="text-slate-400 hover:text-slate-300 text-sm transition-colors">Criar conta</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
