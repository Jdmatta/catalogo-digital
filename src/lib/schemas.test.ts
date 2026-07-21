import { describe, expect, it } from "vitest"
import { createProductSchema, createStoreSchema, registerSchema } from "./schemas"

describe("registerSchema", () => {
  it("aceita um cadastro válido", () => {
    const result = registerSchema.safeParse({
      name: "Jairo",
      email: "jairo@example.com",
      password: "123456",
    })
    expect(result.success).toBe(true)
  })

  it("rejeita e-mail inválido", () => {
    const result = registerSchema.safeParse({
      name: "Jairo",
      email: "nao-e-email",
      password: "123456",
    })
    expect(result.success).toBe(false)
  })

  it("rejeita senha curta demais", () => {
    const result = registerSchema.safeParse({
      name: "Jairo",
      email: "jairo@example.com",
      password: "123",
    })
    expect(result.success).toBe(false)
  })
})

describe("createStoreSchema", () => {
  it("rejeita slug com maiúscula ou espaço", () => {
    const result = createStoreSchema.safeParse({
      name: "Doces da Ana",
      slug: "Doces Da Ana",
      whatsapp: "11999999999",
    })
    expect(result.success).toBe(false)
  })

  it("rejeita whatsapp fora do padrão de dígitos", () => {
    const result = createStoreSchema.safeParse({
      name: "Doces da Ana",
      slug: "doces-da-ana",
      whatsapp: "(11) 99999-9999",
    })
    expect(result.success).toBe(false)
  })
})

describe("createProductSchema", () => {
  it("rejeita preço negativo", () => {
    const result = createProductSchema.safeParse({
      name: "Brigadeiro",
      price: -5,
    })
    expect(result.success).toBe(false)
  })

  it("aceita produto sem categoria (opcional)", () => {
    const result = createProductSchema.safeParse({
      name: "Brigadeiro",
      price: 5,
    })
    expect(result.success).toBe(true)
  })
})
