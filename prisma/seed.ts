import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("123456", 10)

  const user = await prisma.user.upsert({
    where: { email: "demo@catalogo.com" },
    update: {},
    create: { name: "Ana Confeiteira", email: "demo@catalogo.com", password },
  })

  const store = await prisma.store.upsert({
    where: { slug: "doces-da-ana" },
    update: {},
    create: {
      name: "Doces da Ana",
      slug: "doces-da-ana",
      description: "Doces artesanais feitos com amor. Encomendas para festas e eventos.",
      whatsapp: "5511999999999",
      primaryColor: "#16a34a",
      ownerId: user.id,
    },
  })

  const [cats, bolos] = await Promise.all([
    prisma.category.upsert({
      where: { id: "cat-1" },
      update: {},
      create: { id: "cat-1", name: "Doces unitários", storeId: store.id },
    }),
    prisma.category.upsert({
      where: { id: "cat-2" },
      update: {},
      create: { id: "cat-2", name: "Bolos e tortas", storeId: store.id },
    }),
  ])

  const produtos = [
    {
      name: "Brigadeiro tradicional",
      description: "Feito com chocolate belga, embalado individualmente.",
      price: 5.0,
      categoryId: cats.id,
    },
    {
      name: "Brigadeiro de Nutella",
      description: "Recheado com Nutella e granulado colorido.",
      price: 7.0,
      categoryId: cats.id,
    },
    {
      name: "Beijinho de coco",
      description: "Com coco ralado fresco e cravo na decoração.",
      price: 5.0,
      categoryId: cats.id,
    },
    {
      name: "Cajuzinho de amendoim",
      description: "Receita tradicional com amendoim torrado e açúcar.",
      price: 4.5,
      categoryId: cats.id,
    },
    {
      name: "Bolo de chocolate",
      description: "Bolo fofinho de chocolate com recheio de ganache. Serve 15 pessoas.",
      price: 89.9,
      categoryId: bolos.id,
    },
    {
      name: "Bolo de cenoura com cobertura",
      description: "Bolo de cenoura alto com cobertura de chocolate cremoso.",
      price: 79.9,
      categoryId: bolos.id,
    },
    {
      name: "Torta de morango",
      description: "Massa folhada com creme de confeiteiro e morangos frescos.",
      price: 99.9,
      categoryId: bolos.id,
    },
  ]

  for (const p of produtos) {
    await prisma.product.upsert({
      where: { id: `prod-${p.name}` },
      update: {},
      create: { id: `prod-${p.name}`, storeId: store.id, ...p },
    })
  }

  console.log("✅ Seed concluído.")
  console.log("   Login: demo@catalogo.com / 123456")
  console.log("   Catálogo público: /doces-da-ana")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
