"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"

interface Bouquet {
  id: string
  name: string
  description: string
  meaning: string
  image: string
  price: string
}

interface BouquetSuggestionProps {
  bouquet: Bouquet
}

export default function BouquetSuggestion({ bouquet }: BouquetSuggestionProps) {
  return (
    <Card className="w-full bg-gray-800/80 border-gray-700 hover:border-purple-500/50 transition-colors">
      <CardContent className="p-3">
        <div className="aspect-square mb-3 overflow-hidden rounded-lg">
          <img
            src={bouquet.image || "/placeholder.svg"}
            alt={bouquet.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-100 text-sm leading-tight">{bouquet.name}</h4>

          <p className="text-xs text-gray-400 line-clamp-2">{bouquet.description}</p>

          <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-300 border-purple-500/30">
            {bouquet.meaning}
          </Badge>

          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-pink-400">{bouquet.price}</span>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-pink-400">
                <Heart className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                className="h-8 px-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                <span className="text-xs">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
