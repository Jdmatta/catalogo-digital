import { describe, it, expect } from "vitest"
import { buildWhatsAppUrl } from "./whatsapp"
import type { CartItem } from "@/types"

function makeItem(id: string, name: string, price: number, quantity: number): CartItem {
  return {
    product: { id, name, description: null, price, imageUrl: null, active: true },
    quantity,
  }
}

describe("buildWhatsAppUrl", () => {
  describe("phone number sanitization", () => {
    it("strips non-numeric characters from phone", () => {
      const url = buildWhatsAppUrl("(11) 9 8888-7777", [makeItem("1", "X", 10, 1)], "Loja")
      expect(url).toContain("wa.me/11988887777")
    })

    it("keeps a plain numeric phone unchanged", () => {
      const url = buildWhatsAppUrl("5511987654321", [makeItem("1", "X", 10, 1)], "Loja")
      expect(url).toContain("wa.me/5511987654321")
    })
  })

  describe("URL structure", () => {
    it("starts with the correct wa.me base URL", () => {
      const url = buildWhatsAppUrl("11999999999", [makeItem("1", "X", 10, 1)], "Loja")
      expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/)
    })

    it("URL-encodes the message text", () => {
      const url = buildWhatsAppUrl("11999999999", [makeItem("1", "Café", 5, 1)], "Loja")
      // The query string should contain percent-encoded characters
      const textParam = url.split("?text=")[1]
      expect(textParam).not.toContain(" ")
    })
  })

  describe("message content", () => {
    it("includes the store name in the greeting", () => {
      const url = buildWhatsAppUrl("11999999999", [makeItem("1", "X", 10, 1)], "Minha Loja")
      const decoded = decodeURIComponent(url.split("?text=")[1])
      expect(decoded).toContain("Minha Loja")
    })

    it("includes product name and quantity in message", () => {
      const url = buildWhatsAppUrl("11999999999", [makeItem("1", "Camiseta", 50, 2)], "Loja")
      const decoded = decodeURIComponent(url.split("?text=")[1])
      expect(decoded).toContain("2x Camiseta")
    })

    it("formats item price with comma as decimal separator", () => {
      const url = buildWhatsAppUrl("11999999999", [makeItem("1", "Item", 19.9, 1)], "Loja")
      const decoded = decodeURIComponent(url.split("?text=")[1])
      expect(decoded).toContain("R$ 19,90")
    })

    it("multiplies price by quantity in the line item", () => {
      const url = buildWhatsAppUrl("11999999999", [makeItem("1", "Item", 10, 3)], "Loja")
      const decoded = decodeURIComponent(url.split("?text=")[1])
      expect(decoded).toContain("R$ 30,00")
    })

    it("calculates total across multiple items", () => {
      const items = [makeItem("1", "A", 10, 2), makeItem("2", "B", 5.5, 2)]
      const url = buildWhatsAppUrl("11999999999", items, "Loja")
      const decoded = decodeURIComponent(url.split("?text=")[1])
      // 10*2 + 5.5*2 = 31.00
      expect(decoded).toContain("Total: R$ 31,00")
    })

    it("lists all items when cart has multiple products", () => {
      const items = [makeItem("1", "Produto A", 10, 1), makeItem("2", "Produto B", 20, 1)]
      const url = buildWhatsAppUrl("11999999999", items, "Loja")
      const decoded = decodeURIComponent(url.split("?text=")[1])
      expect(decoded).toContain("Produto A")
      expect(decoded).toContain("Produto B")
    })
  })
})
