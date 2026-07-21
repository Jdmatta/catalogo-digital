import { describe, expect, it } from "vitest"
import { buildWhatsAppUrl } from "./whatsapp"
import type { CartItem } from "@/types"

const produto = (overrides: Partial<CartItem["product"]> = {}): CartItem["product"] => ({
  id: "prod-1",
  name: "Brigadeiro tradicional",
  description: null,
  price: 5,
  imageUrl: null,
  active: true,
  ...overrides,
})

describe("buildWhatsAppUrl", () => {
  it("monta a URL do wa.me com o telefone limpo (só dígitos)", () => {
    const url = buildWhatsAppUrl("(11) 99999-9999", [{ product: produto(), quantity: 1 }], "Doces da Ana")
    expect(url.startsWith("https://wa.me/11999999999?text=")).toBe(true)
  })

  it("calcula o total somando preço x quantidade de cada item", () => {
    const items: CartItem[] = [
      { product: produto({ price: 5 }), quantity: 2 },
      { product: produto({ id: "prod-2", price: 7.5 }), quantity: 1 },
    ]
    const url = buildWhatsAppUrl("11999999999", items, "Doces da Ana")
    const message = decodeURIComponent(url.split("?text=")[1])
    // 2x5 + 1x7,50 = 17,50
    expect(message).toContain("Total: R$ 17,50")
  })

  it("lista cada produto do carrinho na mensagem", () => {
    const items: CartItem[] = [
      { product: produto({ name: "Bolo de cenoura" }), quantity: 1 },
    ]
    const url = buildWhatsAppUrl("11999999999", items, "Doces da Ana")
    const message = decodeURIComponent(url.split("?text=")[1])
    expect(message).toContain("1x Bolo de cenoura")
  })
})
