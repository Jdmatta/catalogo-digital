import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn().mockResolvedValue("hashed_pw") },
}))

import { POST } from "./route"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

const mockFindUnique = prisma.user.findUnique as ReturnType<typeof vi.fn>
const mockCreate = prisma.user.create as ReturnType<typeof vi.fn>
const mockHash = bcrypt.hash as ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
})

describe("POST /api/auth/register", () => {
  describe("input validation", () => {
    it("returns 400 when name is missing", async () => {
      const res = await POST(makeRequest({ email: "a@b.com", password: "123456" }))
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toBeDefined()
    })

    it("returns 400 when email is missing", async () => {
      const res = await POST(makeRequest({ name: "Ana", password: "123456" }))
      expect(res.status).toBe(400)
    })

    it("returns 400 when password is missing", async () => {
      const res = await POST(makeRequest({ name: "Ana", email: "a@b.com" }))
      expect(res.status).toBe(400)
    })
  })

  describe("duplicate email", () => {
    it("returns 409 when email is already registered", async () => {
      mockFindUnique.mockResolvedValue({ id: "existing-id", email: "a@b.com" })

      const res = await POST(makeRequest({ name: "Ana", email: "a@b.com", password: "123456" }))
      expect(res.status).toBe(409)
      const body = await res.json()
      expect(body.error).toBeDefined()
    })
  })

  describe("successful registration", () => {
    beforeEach(() => {
      mockFindUnique.mockResolvedValue(null)
      mockCreate.mockResolvedValue({ id: "new-id", email: "ana@loja.com" })
    })

    it("returns 201 with id and email", async () => {
      const res = await POST(makeRequest({ name: "Ana", email: "ana@loja.com", password: "secret" }))
      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body.id).toBe("new-id")
      expect(body.email).toBe("ana@loja.com")
    })

    it("hashes the password before storing", async () => {
      await POST(makeRequest({ name: "Ana", email: "ana@loja.com", password: "plaintext" }))
      expect(mockHash).toHaveBeenCalledWith("plaintext", 10)
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ password: "hashed_pw" }) })
      )
    })

    it("does not return the password in the response", async () => {
      const res = await POST(makeRequest({ name: "Ana", email: "ana@loja.com", password: "secret" }))
      const body = await res.json()
      expect(body.password).toBeUndefined()
    })
  })
})
