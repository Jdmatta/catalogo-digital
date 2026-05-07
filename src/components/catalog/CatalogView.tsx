"use client"

import { useState, useEffect } from "react"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import type { CartItem } from "@/types"

function getCartKey(slug: string) {
  return `cart_${slug}`
}

function loadCart(slug: string): CartItem[] {
  try {
    const raw = localStorage.getItem(getCartKey(slug))
    if (!raw) return []
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

function saveCart(slug: string, cart: CartItem[]): void {
  try {
    localStorage.setItem(getCartKey(slug), JSON.stringify(cart))
  } catch {
    // localStorage bloqueado (modo privado, cota cheia) — falha silenciosa
  }
}

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  active: boolean
}

type Category = {
  id: string
  name: string
  products: Product[]
}

type Store = {
  slug: string
  name: string
  description: string | null
  logoUrl: string | null
  primaryColor: string
  whatsapp: string
  categories: Category[]
  products: Product[]
}

export function CatalogView({ store }: { store: Store }) {
  const [cart, setCart] = useState<CartItem[]>(() => loadCart(store.slug))
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    saveCart(store.slug, cart)
  }, [cart, store.slug])

  const allProducts: Product[] = [
    ...store.products,
    ...store.categories.flatMap((c) => c.products),
  ]

  const visibleProducts =
    activeCategory === "all"
      ? allProducts
      : store.categories.find((c) => c.id === activeCategory)?.products ?? []

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  function removeFromCart(productId: string) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === productId)
      if (!existing) return prev
      if (existing.quantity === 1) return prev.filter((i) => i.product.id !== productId)
      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      )
    })
  }

  function getQty(productId: string) {
    return cart.find((i) => i.product.id === productId)?.quantity ?? 0
  }

  const primary = store.primaryColor

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="w-10 h-10 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm"
                style={{ backgroundColor: primary }}
              >
                {store.name[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-black text-slate-900 leading-tight tracking-tight">{store.name}</h1>
              {store.description && (
                <p className="text-xs text-slate-500 leading-tight mt-0.5">{store.description}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:scale-105 active:scale-100"
            aria-label="Ver carrinho"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm animate-fade-in"
                style={{ backgroundColor: primary }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Filtro por categoria */}
        {store.categories.length > 0 && (
          <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-full font-semibold transition-all duration-200 ${
                activeCategory === "all"
                  ? "text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
              style={activeCategory === "all" ? { backgroundColor: primary } : {}}
            >
              Todos
            </button>
            {store.categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-full font-semibold transition-all duration-200 ${
                  activeCategory === c.id
                    ? "text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                style={activeCategory === c.id ? { backgroundColor: primary } : {}}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Produtos */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-28">
        {visibleProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-slate-400 font-medium">Nenhum produto disponível.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleProducts.map((product, i) => {
              const qty = getQty(product.id)
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="p-4 flex gap-4 items-start">
                    {product.imageUrl ? (
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-4xl">
                        📦
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 leading-tight text-base">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                      )}
                      <p className="text-base font-black text-slate-900 mt-2.5">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>

                    <div className="flex-shrink-0 flex items-center self-center">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all duration-150 hover:scale-110 active:scale-95"
                            style={{ borderColor: primary, color: primary }}
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-black text-slate-900 text-base">{qty}</span>
                          <button
                            onClick={() => addToCart(product)}
                            className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-lg transition-all duration-150 hover:scale-110 active:scale-95 shadow-sm"
                            style={{ backgroundColor: primary }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xl transition-all duration-150 hover:scale-110 active:scale-95 shadow-sm"
                          style={{ backgroundColor: primary }}
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Botão flutuante do carrinho */}
      {cartCount > 0 && !cartOpen && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-20">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full max-w-sm text-white font-bold py-4 px-5 rounded-2xl shadow-2xl flex items-center justify-between transition-all duration-200 hover:-translate-y-1 active:translate-y-0 hover:shadow-2xl"
            style={{ backgroundColor: primary }}
          >
            <span className="bg-white/20 text-white text-sm font-black px-2.5 py-1 rounded-xl">
              {cartCount} {cartCount === 1 ? "item" : "itens"}
            </span>
            <span className="font-bold">Ver pedido</span>
            <span className="font-black text-base">R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
          </button>
        </div>
      )}

      {/* Drawer do carrinho */}
      {cartOpen && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl animate-slide-up">
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-black text-slate-900 text-lg tracking-tight">Seu pedido</h2>
                <p className="text-xs text-slate-500 mt-0.5">{cartCount} {cartCount === 1 ? "item" : "itens"}</p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm leading-tight">{product.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      R$ {product.price.toFixed(2).replace(".", ",")} × {quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold leading-none transition-all duration-150 hover:scale-110 active:scale-95"
                      style={{ borderColor: primary, color: primary }}
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-black text-slate-900">{quantity}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold transition-all duration-150 hover:scale-110 active:scale-95"
                      style={{ backgroundColor: primary }}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-black text-slate-900 w-16 text-right flex-shrink-0">
                    R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-5 pt-4 pb-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Total do pedido</span>
                <span className="font-black text-2xl text-slate-900">
                  R$ {cartTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <a
                href={buildWhatsAppUrl(store.whatsapp, cart, store.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: primary }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enviar pedido pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
