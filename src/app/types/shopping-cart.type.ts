export type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    category: string
    inStock: boolean
}
export type ShoppingCart = {
    items: CartItem[]
    totalQuantity: number
    totalPrice: number
    currency: string
    discount?: number
    appliedCoupons?: string[]
}