"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart, Leaf, Grid3X3, Grid2X2, LayoutGrid } from "lucide-react"
import clsx from "clsx"
import Header from "../components/Header"
import { use } from "react"
import Link from "next/link"
import FloatingChat from "../components/floating-chat"
import Image from "next/image"
import LoadingLogo from "../components/LoadingPage"
import FlowerCard from "./../components/flower-card"

interface Flower {
    id: number
    name: string
    category: string
    meaning: string
    symbolism: string
    description: string
    image: string
    color: string
    emotion: string
}
const roses: Flower[] = [
    {
        id: 1,
        name: "Red Rose",
        category: "Classic",
        meaning: "Deep Love & Passion",
        symbolism: "Ultimate symbol of romantic love",
        description: "Red roses represent deep emotions, courage, and respect. The timeless emblem of passionate love.",
        image: "/images/rose-1.jpg",
        color: "Crimson Red",
        emotion: "Passionate Love",
    },
    {
        id: 2,
        name: "White Rose",
        category: "Pure",
        meaning: "Purity & New Beginnings",
        symbolism: "Innocence and spirituality",
        description: "White roses symbolize purity, innocence, and new beginnings. Perfect for weddings and fresh starts.",
        image: "/images/rose-2.jpg",
        color: "Pure White",
        emotion: "Pure Love",
    },
    {
        id: 3,
        name: "Pink Rose",
        category: "Gentle",
        meaning: "Grace & Gratitude",
        symbolism: "Appreciation and admiration",
        description: "Pink roses express gratitude, grace, and admiration. Light pink conveys gentleness.",
        image: "/images/rose-3.jpg",
        color: "Soft Pink",
        emotion: "Gentle Affection",
    },
    {
        id: 4,
        name: "Yellow Rose",
        category: "Joyful",
        meaning: "Friendship & Joy",
        symbolism: "Warmth and happiness",
        description: "Yellow roses celebrate friendship and bring joy. They represent warmth and platonic love.",
        image: "/images/rose-1.jpg",
        color: "Sunny Yellow",
        emotion: "Pure Joy",
    },
    {
        id: 5,
        name: "Purple Rose",
        category: "Mystical",
        meaning: "Enchantment & Mystery",
        symbolism: "Love at first sight",
        description: "Purple roses represent enchantment and love at first sight. They convey majesty and wonder.",
        image: "/images/rose-2.jpg",
        color: "Royal Purple",
        emotion: "Enchanted Love",
    },
    {
        id: 6,
        name: "Orange Rose",
        category: "Energetic",
        meaning: "Enthusiasm & Desire",
        symbolism: "Energy and fascination",
        description: "Orange roses symbolize enthusiasm, passion, and energy. Perfect for expressing excitement.",
        image: "/images/rose-3.jpg",
        color: "Vibrant Orange",
        emotion: "Enthusiastic Desire",
    },
    {
        id: 7,
        name: "Black Rose",
        category: "Dramatic",
        meaning: "Rebirth & New Chapter",
        symbolism: "Transformation and mystery",
        description: "Black roses symbolize rebirth and new beginnings. They represent dramatic transformation.",
        image: "/images/rose-1.jpg",
        color: "Deep Black",
        emotion: "Mysterious Transformation",
    },
    {
        id: 8,
        name: "Peach Rose",
        category: "Warm",
        meaning: "Sincerity & Gratitude",
        symbolism: "Genuine appreciation",
        description: "Peach roses express sincerity, gratitude, and genuine appreciation. Perfect for showing thanks.",
        image: "/images/rose-1.jpg",
        color: "Warm Peach",
        emotion: "Sincere Gratitude",
    },
]


const categories = [
    {
        id: "All",
        en: "All",
        vi: "Tất cả"
    },
    {
        id: "Classic",
        en: "Classic",
        vi: "Cổ điển"
    },
    {
        id: "Pure",
        en: "Pure",
        vi: "Tinh khiết"
    },
    {
        id: "Gentle",
        en: "Gentle",
        vi: "Nhẹ nhàng"
    },
    {
        id: "Joyful",
        en: "Joyful",
        vi: "Vui tươi"
    },
    {
        id: "Mystical",
        en: "Mystical",
        vi: "Huyền bí"
    },
    {
        id: "Energetic",
        en: "Energetic",
        vi: "Năng động"
    },
    {
        id: "Dramatic",
        en: "Dramatic",
        vi: "Kịch tính"
    }
]

type ViewMode = "grid-2" | "grid-3" | "grid-4"

export default function FlowerShowcase({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params) // Unwrap the Promise to get the locale
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [viewMode, setViewMode] = useState<ViewMode>("grid-3")
    const [favorites, setFavorites] = useState<number[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isReady, setIsReady] = useState(false)
    console.log("selectedCategory", selectedCategory)

    const toggleChat = () => {
        setIsOpen((prev) => !prev)

    }
    const headerRef = useRef(null)
    const isHeaderInView = useInView(headerRef, { once: true })

    const filteredRoses = selectedCategory === "All" ? roses : roses.filter((rose) => rose.category === selectedCategory)
    console.log("Filtered Roses", filteredRoses)
    const toggleFavorite = (id: number) => {
        setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
    }
    const onViewModeChange = (mode: ViewMode) => {
        console.log("Clicked")
        setViewMode(mode)
        setIsReady(true)
        //Delay to simulate loading
        setTimeout(() => {
            setIsReady(false)
        }, 1500) // Adjust the delay as needed
    }
    const getGridClasses = () =>
        clsx(
            "grid",
            "grid-cols-1",
            "sm:grid-cols-2",
            {
                "lg:grid-cols-3": viewMode === "grid-3",
                "md:grid-cols-3 lg:grid-cols-4": viewMode === "grid-4"
            }
        )
    console.log("LOcale", locale)
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-purple-900">
            {/* Header Section */}
            <Header locale={locale} />
            <div className="py-12" />
            {isReady ? (
                <LoadingLogo />) : (
                <>
                    <div className="container mx-auto px-4 mb-8">
                        <div className="flex justify-end gap-2 mb-6">
                            {["grid-2", "grid-3", "grid-4"].map((mode) => {
                                const Icon = mode === "grid-2" ? Grid2X2 : mode === "grid-3" ? Grid3X3 : LayoutGrid
                                return (
                                    <Button
                                        key={mode}
                                        variant={viewMode === mode ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => onViewModeChange(mode as ViewMode)}
                                        className={clsx(
                                            viewMode === mode ? "bg-rose-500 hover:bg-rose-600" : "bg-gray-800/50 border-gray-600 !text-white hover:bg-rose-500/20"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Button>
                                )
                            })}
                        </div>

                        {/* Category Filter */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 1 }}
                            className="flex flex-wrap justify-center gap-3 px-4 mb-16"
                        >
                            {categories.map((cat, index) => {
                                const category = (locale === "vi" || locale === "en") ? cat[locale] : cat.en
                                return (

                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.2 + index * 0.1 }}
                                    >
                                        <Button
                                            key={cat.id}
                                            variant={selectedCategory === cat.id ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={clsx(
                                                "rounded-full px-4 py-2 text-sm",
                                                selectedCategory === cat.id
                                                    ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                                                    : "bg-gray-800/50 border-gray-600 !text-gray-300 hover:bg-rose-500/20 hover:border-rose-400"
                                            )}
                                        >
                                            {category}
                                        </Button>
                                    </motion.div>
                                )
                            })}

                        </motion.div>
                    </div>


                    <div className="container mx-auto px-4 pb-12">
                        <div className={clsx(getGridClasses(), "gap-6  ")}>
                            <AnimatePresence mode="popLayout">
                                {filteredRoses.map((rose, index) => (
                                    <motion.div
                                        key={rose.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: index * 0.02 }}
                                    >
                                        <FlowerCard
                                            rose={rose}
                                            index={index}
                                            locale={locale}
                                            isFavorite={favorites.includes(rose.id)}
                                            onToggleFavorite={() => toggleFavorite(rose.id)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="fixed bottom-10 right-0 ">
                            <FloatingChat />
                        </div>
                    </div>
                </>
            )
            }

        </div >
    )
}




