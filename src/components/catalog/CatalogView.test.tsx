import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CatalogView } from "./CatalogView"

function makeProduct(id: string, name: string, price = 10) {
  return { id, name, description: null, price, imageUrl: null, active: true }
}

const baseStore = {
  name: "Loja Teste",
  description: null,
  logoUrl: null,
  primaryColor: "#000000",
  whatsapp: "11999999999",
  categories: [],
  products: [],
}

describe("CatalogView — cart behavior", () => {
  it("shows the add button for every product", () => {
    const store = { ...baseStore, products: [makeProduct("1", "Camiseta")] }
    render(<CatalogView store={store} />)
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument()
  })

  it("adds a product to the cart when + is clicked", async () => {
    const store = { ...baseStore, products: [makeProduct("1", "Camiseta")] }
    render(<CatalogView store={store} />)
    await userEvent.click(screen.getByRole("button", { name: "+" }))
    // Badge inside the header cart button shows count 1
    const cartBtn = screen.getByRole("button", { name: "Ver carrinho" })
    expect(within(cartBtn).getByText("1")).toBeInTheDocument()
  })

  it("increments quantity when the same product is added twice", async () => {
    const store = { ...baseStore, products: [makeProduct("1", "Camiseta")] }
    render(<CatalogView store={store} />)
    await userEvent.click(screen.getByRole("button", { name: "+" }))
    const buttons = screen.getAllByRole("button", { name: "+" })
    await userEvent.click(buttons[buttons.length - 1])
    // Badge inside the header cart button should now show 2
    const cartBtn = screen.getByRole("button", { name: "Ver carrinho" })
    expect(within(cartBtn).getByText("2")).toBeInTheDocument()
  })

  it("decrements quantity when − is clicked", async () => {
    const store = { ...baseStore, products: [makeProduct("1", "Camiseta")] }
    render(<CatalogView store={store} />)
    await userEvent.click(screen.getByRole("button", { name: "+" }))
    const addBtns = screen.getAllByRole("button", { name: "+" })
    await userEvent.click(addBtns[addBtns.length - 1])
    // Quantity is 2; click − once → badge should read 1
    await userEvent.click(screen.getByRole("button", { name: "−" }))
    const cartBtn = screen.getByRole("button", { name: "Ver carrinho" })
    expect(within(cartBtn).getByText("1")).toBeInTheDocument()
  })

  it("removes item from cart when − is clicked at quantity 1", async () => {
    const store = { ...baseStore, products: [makeProduct("1", "Camiseta")] }
    render(<CatalogView store={store} />)
    await userEvent.click(screen.getByRole("button", { name: "+" }))
    await userEvent.click(screen.getByRole("button", { name: "−" }))
    // The cart badge should be gone / cart count is 0
    expect(screen.queryByText("1")).not.toBeInTheDocument()
  })

  it("shows the floating cart button only when cart is not empty", async () => {
    const store = { ...baseStore, products: [makeProduct("1", "Camiseta", 25)] }
    render(<CatalogView store={store} />)
    expect(screen.queryByText("Ver pedido")).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "+" }))
    expect(screen.getByText("Ver pedido")).toBeInTheDocument()
  })
})

describe("CatalogView — category filtering", () => {
  const catStore = {
    ...baseStore,
    products: [makeProduct("uncategorized", "Produto Sem Categoria")],
    categories: [
      { id: "cat1", name: "Roupas", products: [makeProduct("p1", "Camiseta")] },
      { id: "cat2", name: "Calçados", products: [makeProduct("p2", "Tênis")] },
    ],
  }

  it("shows all products when Todos is selected", () => {
    render(<CatalogView store={catStore} />)
    expect(screen.getByText("Camiseta")).toBeInTheDocument()
    expect(screen.getByText("Tênis")).toBeInTheDocument()
    expect(screen.getByText("Produto Sem Categoria")).toBeInTheDocument()
  })

  it("shows only the selected category products when a category is clicked", async () => {
    render(<CatalogView store={catStore} />)
    await userEvent.click(screen.getByRole("button", { name: "Roupas" }))
    expect(screen.getByText("Camiseta")).toBeInTheDocument()
    expect(screen.queryByText("Tênis")).not.toBeInTheDocument()
  })

  it("returns to showing all products when Todos is clicked again", async () => {
    render(<CatalogView store={catStore} />)
    await userEvent.click(screen.getByRole("button", { name: "Roupas" }))
    await userEvent.click(screen.getByRole("button", { name: "Todos" }))
    expect(screen.getByText("Camiseta")).toBeInTheDocument()
    expect(screen.getByText("Tênis")).toBeInTheDocument()
  })
})

describe("CatalogView — cart drawer", () => {
  it("opens the cart drawer when the floating button is clicked", async () => {
    const store = { ...baseStore, products: [makeProduct("1", "Camiseta", 30)] }
    render(<CatalogView store={store} />)
    await userEvent.click(screen.getByRole("button", { name: "+" }))
    await userEvent.click(screen.getByText("Ver pedido"))
    expect(screen.getByText("Seu pedido")).toBeInTheDocument()
  })

  it("shows the WhatsApp link in the cart drawer", async () => {
    const store = { ...baseStore, products: [makeProduct("1", "Camiseta", 30)] }
    render(<CatalogView store={store} />)
    await userEvent.click(screen.getByRole("button", { name: "+" }))
    await userEvent.click(screen.getByText("Ver pedido"))
    const link = screen.getByRole("link", { name: /whatsapp/i })
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me/"))
  })

  it("displays correct total in the drawer", async () => {
    const store = { ...baseStore, products: [makeProduct("1", "Item", 49.9)] }
    render(<CatalogView store={store} />)
    await userEvent.click(screen.getByRole("button", { name: "+" }))
    await userEvent.click(screen.getByText("Ver pedido"))
    // The "Total" label and price share a flex row — scope within that row
    const totalLabel = screen.getByText("Total do pedido")
    const totalRow = totalLabel.closest("div")!
    expect(within(totalRow).getByText("R$ 49,90")).toBeInTheDocument()
  })

  it("closes the drawer when the ✕ button is clicked", async () => {
    const store = { ...baseStore, products: [makeProduct("1", "Camiseta", 30)] }
    render(<CatalogView store={store} />)
    await userEvent.click(screen.getByRole("button", { name: "+" }))
    await userEvent.click(screen.getByText("Ver pedido"))
    await userEvent.click(screen.getByRole("button", { name: "✕" }))
    expect(screen.queryByText("Seu pedido")).not.toBeInTheDocument()
  })
})
