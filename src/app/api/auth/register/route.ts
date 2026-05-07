import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  })

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}
