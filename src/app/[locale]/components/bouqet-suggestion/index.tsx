"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type Bouquet = {
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg min-w-[70%] overflow-hidden border border-gray-800 bg-gray-800/50 hover:bg-gray-800/80 transition-colors"
        >
            <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/3 h-32 sm:h-auto relative">
                    <Image
                        src={bouquet.image || "/placeholder.svg?height=200&width=200"}
                        alt={bouquet.name}
                        className="!w-36 h-full object-cover"
                        loading="lazy"
                        fill
                        sizes="100vw"
                    />
                    <div className="absolute top-2 right-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full bg-black/30 hover:bg-black/50 text-white"
                        >
                            <Heart className="h-2 w-2" />
                        </Button>
                    </div>
                </div>
                <div className="p-2 flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-medium text-[12px] text-gray-100">{bouquet.name}</h3>

                    </div>
                    {/* <p className="text-sm text-gray-400  mt-1">{bouquet.description}</p>
                    <div className="mt-3">
                        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Ý nghĩa</h4>
                        <p className="text-sm text-gray-300  mt-1">{bouquet.meaning}</p>
                    </div> */}
                    <div className="mt-3 ">
                        {/* <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white"
                        >
                            View Details
                        </Button> */}
                        <span className="text-pink-400 text-sm font-semibold">{bouquet.price}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
