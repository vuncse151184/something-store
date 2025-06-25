"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"

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
          <Image
            width={300}
            height={300}
            loading="lazy"
            src={bouquet.image || "/placeholder.svg"}
            alt={bouquet.name}
            className="w-full h-120 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-100 text-sm leading-tight">{bouquet.name}</h4>

          <p className="text-xs text-gray-400 line-clamp-2">{bouquet.description}</p>

          <Badge variant="secondary" className="text-xs line-clamp-2 bg-purple-900/50 text-purple-300 border-purple-500/30">
            {bouquet.meaning}
          </Badge>

          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-pink-400">{bouquet.price}</span>
           
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
