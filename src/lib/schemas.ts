import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(100),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(100),
})

const slugPattern = /^[a-z0-9-]+$/
const whatsappPattern = /^\d{10,15}$/
const hexColorPattern = /^#[0-9a-fA-F]{6}$/

export const createStoreSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(100),
  slug: z
    .string()
    .min(3, "URL muito curta")
    .max(60)
    .regex(slugPattern, "Use apenas letras minúsculas, números e hífens"),
  whatsapp: z
    .string()
    .regex(whatsappPattern, "WhatsApp deve conter entre 10 e 15 dígitos (somente números)"),
  description: z.string().max(500).optional(),
})

export const updateStoreSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z.string().min(3).max(60).regex(slugPattern).optional(),
  whatsapp: z.string().regex(whatsappPattern).optional(),
  description: z.string().max(500).nullable().optional(),
  primaryColor: z.string().regex(hexColorPattern, "Cor inválida").optional(),
})

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(200),
  description: z.string().max(1000).optional(),
  price: z.number({ invalid_type_error: "Preço inválido" }).nonnegative("Preço deve ser positivo"),
  imageUrl: z.string().url("URL de imagem inválida").optional().or(z.literal("")),
  categoryId: z.string().cuid().optional().or(z.literal("")),
})

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  price: z.number().nonnegative().optional(),
  imageUrl: z.string().url().nullable().optional().or(z.literal("")),
  categoryId: z.string().cuid().nullable().optional().or(z.literal("")),
  active: z.boolean().optional(),
})

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(100),
})
