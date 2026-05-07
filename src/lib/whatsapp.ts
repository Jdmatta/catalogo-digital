import type { CartItem } from "@/types"

export function buildWhatsAppUrl(phone: string, items: CartItem[], storeName: string): string {
  const lines = items.map(
    ({ product, quantity }) =>
      `• ${quantity}x ${product.name} — R$ ${(product.price * quantity).toFixed(2).replace(".", ",")}`
  )

  const total = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)

  const message = [
    `Olá! Gostaria de fazer um pedido pelo catálogo de *${storeName}*:`,
    "",
    ...lines,
    "",
    `*Total: R$ ${total.toFixed(2).replace(".", ",")}*`,
  ].join("\n")

  const cleanPhone = phone.replace(/\D/g, "")
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}
