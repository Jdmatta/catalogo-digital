"use client"

import { useState } from "react"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import type { CartItem } from "@/types"

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
  name: string
  description: string | null
  logoUrl: string | null
  primaryColor: string
  whatsapp: string
  categories: Category[]
  products: Product[]
}

export function CatalogView({ store }: { store: Store }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [cartOpen, setCartOpen] = useState(false)

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
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${primary}cc, ${primary})` }}
              >
                {store.name[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-bold text-white leading-tight text-base">{store.name}</h1>
              {store.description && (
                <p className="text-xs text-zinc-400 leading-tight mt-0.5">{store.description}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] transition-all duration-200"
            aria-label="Ver carrinho"
          >
            <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg"
                style={{ backgroundColor: primary }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Category tabs */}
        {store.categories.length > 0 && (
          <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className="whitespace-nowrap text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 flex-shrink-0"
              style={
                activeCategory === "all"
                  ? { backgroundColor: primary, color: "#fff" }
                  : { backgroundColor: "rgba(255,255,255,0.06)", color: "rgb(161,161,170)" }
              }
            >
              Todos
            </button>
            {store.categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className="whitespace-nowrap text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 flex-shrink-0"
                style={
                  activeCategory === c.id
                    ? { backgroundColor: primary, color: "#fff" }
                    : { backgroundColor: "rgba(255,255,255,0.06)", color: "rgb(161,161,170)" }
                }
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Products */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {visibleProducts.length === 0 ? (
          <div className="text-center py-24 text-zinc-600">
            <div className="text-4xl mb-3">📦</div>
            <p className="font-medium">Nenhum produto disponível.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleProducts.map((product) => {
              const qty = getQty(product.id)
              return (
                <div
                  key={product.id}
                  className="bg-zinc-900 border border-white/[0.07] rounded-2xl p-4 flex gap-4 items-start hover:border-white/[0.12] transition-all duration-200"
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-zinc-800"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-zinc-800 border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-3xl">
                      📦
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white leading-tight">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                    <p className="text-base font-bold text-white mt-2">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex items-center">
                    {qty > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all duration-150 hover:opacity-80"
                          style={{ borderColor: primary, color: primary }}
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-bold text-white text-sm">{qty}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-lg transition-all duration-150 hover:opacity-80 shadow-lg"
                          style={{ backgroundColor: primary }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xl transition-all duration-150 hover:opacity-80 hover:scale-110 shadow-lg"
                        style={{ backgroundColor: primary }}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Floating cart button */}
      {cartCount > 0 && !cartOpen && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-20">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full max-w-sm text-white font-bold py-4 px-5 rounded-2xl shadow-2xl flex items-center justify-between transition-all duration-200 active:scale-95 hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${primary}ee, ${primary})`,
              boxShadow: `0 8px 32px ${primary}55`,
            }}
          >
            <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              {cartCount} {cartCount === 1 ? "item" : "itens"}
            </span>
            <span className="text-sm">Ver pedido</span>
            <span className="text-sm font-bold">R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <div className="relative bg-zinc-900 border-t border-white/[0.08] rounded-t-3xl max-h-[82vh] flex flex-col">
            {/* Drawer handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <h2 className="font-bold text-white text-lg">Seu pedido</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.14] flex items-center justify-center text-zinc-400 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 bg-white/[0.04] rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{product.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      R$ {product.price.toFixed(2).replace(".", ",")} × {quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold leading-none text-sm transition-all hover:opacity-80"
                      style={{ borderColor: primary, color: primary }}
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-md transition-all hover:opacity-80"
                      style={{ backgroundColor: primary }}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-bold text-white w-16 text-right flex-shrink-0">
                    R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-5 py-5 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-5">
                <span className="font-semibold text-zinc-400">Total do pedido</span>
                <span className="font-bold text-2xl text-white">
                  R$ {cartTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <a
                href={buildWhatsAppUrl(store.whatsapp, cart, store.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${primary}ee, ${primary})`,
                  boxShadow: `0 8px 24px ${primary}44`,
                }}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
