"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

const flowerTypes = [
  { name: "Roses", color: "#FF69B4" },
  { name: "Tulips", color: "#FF6347" },
  { name: "Lilies", color: "#FFF0F5" },
  { name: "Daisies", color: "#FFFACD" },
  { name: "Sunflowers", color: "#FFD700" },
]

export default function BouquetCustomizer() {
  const [selectedFlowers, setSelectedFlowers] = useState<string[]>([])
  const [quantity, setQuantity] = useState(10)

  const toggleFlower = (flowerName: string) => {
    if (selectedFlowers.includes(flowerName)) {
      setSelectedFlowers(selectedFlowers.filter((name) => name !== flowerName))
    } else {
      setSelectedFlowers([...selectedFlowers, flowerName])
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Customize Your Bouquet</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Select Flowers</h3>
        <div className="flex flex-wrap gap-2">
          {flowerTypes.map((flower) => (
            <motion.div key={flower.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={selectedFlowers.includes(flower.name) ? "default" : "outline"}
                className={selectedFlowers.includes(flower.name) ? "" : "border-gray-200"}
                style={{
                  backgroundColor: selectedFlowers.includes(flower.name) ? flower.color : "transparent",
                  color: selectedFlowers.includes(flower.name) ? "white" : "black",
                  borderColor: flower.color,
                }}
                onClick={() => toggleFlower(flower.name)}
              >
                {flower.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Quantity: {quantity} stems</h3>
        <Slider defaultValue={[10]} max={24} min={6} step={1} onValueChange={(value) => setQuantity(value[0])} />
      </div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button className="w-full bg-rose-500 hover:bg-rose-600">Apply Customization</Button>
      </motion.div>
    </div>
  )
}
