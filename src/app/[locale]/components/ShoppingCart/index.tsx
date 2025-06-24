import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag, Heart } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { CartItem } from '@/app/types/shopping-cart.type'

interface ShoppingCartProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    totalItems: number
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
    cartItems: CartItem[]
}


const ShoppingCart = ({ isOpen, setIsOpen, totalItems, setCartItems, cartItems }: ShoppingCartProps) => {

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity === 0) {
            removeItem(id)
            return
        }
        setCartItems((items: CartItem[]) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }

    const removeItem = (id: string) => {
        setCartItems((items: CartItem[]) => items.filter((item) => item.id !== id))
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.08
    const shipping = subtotal > 50 ? 0 : 8.99
    const total = subtotal + tax + shipping

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; // Cleanup in case component unmounts
        };
    }, [isOpen]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-xl max-h-[90vh] overflow-hidden bg-gray-900/95 backdrop-blur-sm border-2 border-purple-500/30 shadow-2xl">
                <CardHeader className="h-16 flex justify-center inset-0 bg-gradient-to-r from-purple-900 to-pink-800 text-white border-b border-purple-400/30">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold flex  items-center gap-2">
                            <ShoppingBag className="w-6 h-6" />
                            Your Garden Cart

                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                        >
                            ✕
                        </Button>
                    </div>

                </CardHeader>

                <CardContent className="p-0 bg-gray-900">
                    {cartItems.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-800/50 to-pink-800/50 rounded-full flex items-center justify-center border border-purple-500/30">
                                <ShoppingBag className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-200 mb-2">Your cart is empty</h3>
                            <p className="text-gray-400 mb-4">Add some beautiful flowers to get started!</p>
                            <Button
                                onClick={() => setIsOpen(false)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="  p-4 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-colors"
                                    >
                                        <div className="relative">
                                            <Image
                                                width={80}
                                                height={80}
                                                src={item.image}
                                                alt={item.name}
                                                priority
                                                className="w-20 h-20 object-cover rounded-lg shadow-md border border-gray-600"
                                            />
                                            {!item.inStock && (
                                                <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">Out of Stock</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-gray-100 truncate">{item.name}</h4>
                                            <Badge
                                                variant="secondary"
                                                className="text-xs bg-purple-900/50 text-purple-300 border border-purple-500/30"
                                            >
                                                {item.category}
                                            </Badge>
                                            <p className="text-lg font-bold text-pink-400 mt-1">${item.price.toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 p-0 rounded-full border-purple-500/30 bg-gray-800 hover:bg-purple-800/50 text-gray-300 hover:text-white"
                                                disabled={!item.inStock}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <span className="w-8 text-center font-semibold text-gray-200">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 p-0 rounded-full border-purple-500/30 bg-gray-800 hover:bg-purple-800/50 text-gray-300 hover:text-white"
                                                disabled={!item.inStock}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <p className="font-bold text-gray-100">${(item.price * item.quantity).toFixed(2)}</p>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-8 h-8 p-0 text-gray-400 hover:text-pink-400 hover:bg-pink-900/20"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.id)}
                                                    className="w-8 h-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 border-t border-purple-500/20">


                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-800/30 hover:text-purple-200 bg-gray-800"
                                    >
                                        Continue Shopping
                                    </Button>
                                    <Button
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold"
                                        disabled={cartItems.some((item) => !item.inStock)}
                                    >
                                        {/* 🌸 Checkout */}
                                        Checkout
                                    </Button>
                                </div>

                                {cartItems.some((item) => !item.inStock) && (
                                    <div className="mt-3 p-2 bg-orange-900/30 border border-orange-500/30 rounded-lg">
                                        <p className="text-xs text-orange-300 text-center">
                                            ⚠️ Some items are out of stock. Please remove them to continue.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ShoppingCart