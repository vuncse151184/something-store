"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import FlowerPetal from "./../flower-petal"
import { lora, playfairDisplay } from "@/fonts/font"

const bouquetImages = [
    "/images/rose-1.jpg",
    "/images/rose-2.jpg",
    "/images/rose-3.jpg",
]

export default function BouquetDetail() {
    const [currentImage, setCurrentImage] = useState(0)
    const [liked, setLiked] = useState(false)

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % bouquetImages.length)
    }

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + bouquetImages.length) % bouquetImages.length)
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex gap-4 items-center" onClick={() => window.history.back()}>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-rose-500 decoration-none">Back to Gallery</span>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${lora.className}`}>
                {/* Image Gallery with Animation */}
                <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg h-[500px] md:h-[600px]">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImage}
                            src={bouquetImages[currentImage]}
                            alt={`Bouquet view ${currentImage + 1}`}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        />
                    </AnimatePresence>

                    {/* Floating petals animation */}
                    {/* <div className="absolute inset-0 pointer-events-none">
            <FlowerPetal color="#FFD6E0" size={20} top="10%" left="20%" delay={0} />
            <FlowerPetal color="#FFC0CB" size={15} top="30%" left="70%" delay={1.2} />
            <FlowerPetal color="#FFAEB9" size={25} top="60%" left="15%" delay={0.5} />
            <FlowerPetal color="#FF69B4" size={18} top="75%" left="60%" delay={1.8} />
            <FlowerPetal color="#FFB6C1" size={22} top="40%" left="40%" delay={2.2} />
          </div> */}

                    {/* Navigation buttons */}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                        onClick={prevImage}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                        onClick={nextImage}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>

                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {bouquetImages.map((_, index) => (
                            <motion.div
                                key={index}
                                className={`h-2 w-2 rounded-full ${currentImage === index ? "bg-white" : "bg-white/50"}`}
                                animate={{ scale: currentImage === index ? 1.2 : 1 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setCurrentImage(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Bouquet Details */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Spring Elegance Bouquet</h1>
                            <motion.div whileTap={{ scale: 0.9 }} onClick={() => setLiked(!liked)}>
                                <Heart
                                    className={`h-8 w-8 cursor-pointer ${liked ? "fill-rose-500 text-rose-500" : "text-gray-400"}`}
                                    onClick={() => setLiked(!liked)}
                                />
                            </motion.div>
                        </div>
                        <div className="flex items-center mt-2 space-x-2">
                            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200">Limited Edition</Badge>
                            <Badge variant="outline">Seasonal</Badge>
                        </div>
                        <p className="text-2xl font-semibold text-gray-800 mt-4">$89.99</p>
                    </div>

                    <motion.div
                        className="prose prose-rose max-w-none"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <p>
                            This exquisite bouquet features a harmonious blend of seasonal blooms, carefully arranged to create a
                            stunning visual display. Each flower is hand-selected for its beauty and freshness, ensuring your bouquet
                            will remain vibrant for days to come.
                        </p>

                        <h3 className="text-lg font-semibold mt-6 mb-2">Bouquet Includes:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Premium roses in soft pink hues</li>
                            <li>Delicate baby's breath</li>
                            <li>Fragrant eucalyptus sprigs</li>
                            <li>Seasonal wildflowers</li>
                            <li>Decorative greenery</li>
                        </ul>
                    </motion.div>

                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-3">Select Delivery Date</h3>
                        <div className="flex flex-wrap gap-2">
                            {["Today", "Tomorrow", "In 2 Days"].map((day, index) => (
                                <motion.div key={day} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant={index === 0 ? "default" : "outline"}
                                        className={index === 0 ? "bg-rose-500 hover:bg-rose-600" : ""}
                                    >
                                        {day}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                            <Button className="w-full bg-rose-500 hover:bg-rose-600 text-lg py-6">Add to Cart</Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                            <Button variant="outline" className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 text-lg py-6">
                                Send as Gift
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
