export type StoreWithProducts = {
  id: string
  slug: string
  name: string
  description: string | null
  logoUrl: string | null
  primaryColor: string
  whatsapp: string
  categories: CategoryWithProducts[]
}

export type CategoryWithProducts = {
  id: string
  name: string
  products: Product[]
}

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  active: boolean
}

export type CartItem = {
  product: Product
  quantity: number
}
