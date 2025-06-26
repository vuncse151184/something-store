"use client"


import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl" 
import Image from "next/image"
import { Heart, Sparkles, Leaf } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"  
import { useMobile } from "@/app/hooks/useMobileHook" 
import BouquetMeaningModal from "../bouqet-meaning-modal"

import { motion, useInView } from "framer-motion"
import { Badge } from "@/components/ui/badge"

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

interface FlowerCardProps {
    rose: Flower
    index: number
    locale: string
    isFavorite: boolean
    onToggleFavorite: () => void
}

export default function FlowerCard({ rose, index, locale, isFavorite, onToggleFavorite }: FlowerCardProps) {
    const cardRef = useRef(null)
    const isInView = useInView(cardRef, { once: true, margin: "-50px" })
    const t = useTranslations("WhatsNew")
    const chatRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const isMobile = useMobile()
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => {
        setIsOpen(true)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                chatRef.current &&
                !chatRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    // Handle escape key to close
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (isOpen && event.key === "Escape") {
                setIsOpen(false)
            }
        }

        document.addEventListener("keydown", handleEscKey)
        return () => {
            document.removeEventListener("keydown", handleEscKey)
        }
    }, [isOpen])
    console.log("isOpen", isOpen)
    const onClose = () => {
        setIsOpen(false)
    }
    return (
        <>

            {isOpen && (

                // <motion.div
                //     ref={chatRef}
                //     id="chat-panel"
                //     className={`fixed z-500 bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-800 ${isMobile
                //         ? "inset-x-4 bottom-20 top-20"
                //         : `bottom-20 right-24 h-[500px] w-[400px]}`
                //         }`}
                //     initial={isMobile ? { y: "100%" } : { scale: 0.8, opacity: 0, x: 80, y: 20 }}
                //     animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1, x: 0, y: 0 }}
                //     exit={isMobile ? { y: "100%" } : { scale: 0.8, opacity: 0, x: 80, y: 20 }}
                //     transition={{ type: "spring", damping: 25, stiffness: 300 }}
                //     layout
                // >

                <BouquetMeaningModal bouquet={rose} isOpen={isOpen} onClose={onClose} />

                // </motion.div>
            )}


            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group z-10"
            >

                {/* <Link href={`/${locale}/bouquet/1`}> */}
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:bg-gray-800/60">
                    {/* Oval Image Container */}
                    <div className="relative mb-4">
                        <div className="w-full aspect-square max-w-48 mx-auto relative">
                            {/* Decorative ring */}
                            <div
                                className="absolute inset-0 rounded-full opacity-20"
                                style={{
                                    background: `conic-gradient(from 0deg, ${rose.color === "Crimson Red"
                                        ? "#ef4444"
                                        : rose.color === "Pure White"
                                            ? "#f8fafc"
                                            : rose.color === "Soft Pink"
                                                ? "#f472b6"
                                                : rose.color === "Sunny Yellow"
                                                    ? "#facc15"
                                                    : rose.color === "Royal Purple"
                                                        ? "#a855f7"
                                                        : rose.color === "Vibrant Orange"
                                                            ? "#f97316"
                                                            : rose.color === "Deep Black"
                                                                ? "#1f2937"
                                                                : "#fb923c"
                                        }40, transparent, ${rose.color === "Crimson Red"
                                            ? "#ef4444"
                                            : rose.color === "Pure White"
                                                ? "#f8fafc"
                                                : rose.color === "Soft Pink"
                                                    ? "#f472b6"
                                                    : rose.color === "Sunny Yellow"
                                                        ? "#facc15"
                                                        : rose.color === "Royal Purple"
                                                            ? "#a855f7"
                                                            : rose.color === "Vibrant Orange"
                                                                ? "#f97316"
                                                                : rose.color === "Deep Black"
                                                                    ? "#1f2937"
                                                                    : "#fb923c"
                                        }40)`,
                                }}
                            />

                            {/* Main oval container */}
                            <div className="absolute inset-2 rounded-full overflow-hidden bg-gray-700/50 border-2 border-gray-600">


                                <Image
                                    src={rose.image || "/placeholder.svg"} alt={rose.name}
                                    className="w-full h-full object-cover"
                                    priority
                                    width={300}
                                    height={300}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>

                            {/* Favorite button */}
                            <button
                                onClick={onToggleFavorite}
                                className="absolute top-0 right-0 w-8 h-8 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-600 hover:bg-gray-700/80 transition-colors"
                            >
                                <Heart
                                    className={`h-4 w-4 transition-colors ${isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-rose-400"
                                        }`}
                                />
                            </button>

                            {/* Floating elements */}
                            <TooltipProvider>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div onClick={() => openModal()} className="absolute hover:cursor-pointer hover:scale-110 -top-1 -left-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <Sparkles className="h-3 w-3 text-white" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('getBouquetMeaning')}</p>
                                    </TooltipContent>
                                </Tooltip>

                            </TooltipProvider>

                            <div className="absolute z-0 -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                                <Leaf className="h-2.5 w-2.5 text-white" />
                            </div>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="text-center space-y-3">
                        <div className="space-y-1">
                            <Badge
                                className={`text-xs px-2 py-1 ${rose.category === "Classic"
                                    ? "bg-red-900/50 text-red-300 border border-red-700/50"
                                    : rose.category === "Pure"
                                        ? "bg-gray-700/50 text-gray-300 border border-gray-600/50"
                                        : rose.category === "Gentle"
                                            ? "bg-pink-900/50 text-pink-300 border border-pink-700/50"
                                            : rose.category === "Joyful"
                                                ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700/50"
                                                : rose.category === "Mystical"
                                                    ? "bg-purple-900/50 text-purple-300 border border-purple-700/50"
                                                    : rose.category === "Energetic"
                                                        ? "bg-orange-900/50 text-orange-300 border border-orange-700/50"
                                                        : rose.category === "Dramatic"
                                                            ? "bg-gray-900/80 text-gray-200 border border-gray-600/50"
                                                            : "bg-orange-900/50 text-orange-300 border border-orange-700/50"
                                    }`}
                            >
                                {rose.category}
                            </Badge>

                            <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors">{rose.name}</h3>

                            <p className="text-sm font-medium bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                                {rose.meaning}
                            </p>
                        </div>



                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full border border-gray-500"
                                    style={{
                                        backgroundColor:
                                            rose.color === "Crimson Red"
                                                ? "#ef4444"
                                                : rose.color === "Pure White"
                                                    ? "#ffffff"
                                                    : rose.color === "Soft Pink"
                                                        ? "#f472b6"
                                                        : rose.color === "Sunny Yellow"
                                                            ? "#facc15"
                                                            : rose.color === "Royal Purple"
                                                                ? "#a855f7"
                                                                : rose.color === "Vibrant Orange"
                                                                    ? "#f97316"
                                                                    : rose.color === "Deep Black"
                                                                        ? "#1f2937"
                                                                        : "#fb923c",
                                    }}
                                />
                                <span className="text-gray-400">{rose.emotion}</span>
                            </div>

                            <p className="text-gray-400 text-xs leading-relaxed">{rose.description}</p>
                        </div>
                    </div>
                </div>
                {/* </Link> */}

            </motion.div>
        </>
    )
}

