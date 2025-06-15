"use client"

import { motion } from "framer-motion"

interface BackdropProps {
    onClick: () => void
    isVisible: boolean
}

export default function Backdrop({ onClick, isVisible }: BackdropProps) {
    return (
        <motion.div
            className="fixed inset-0 bg-black/25 z-30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            onClick={onClick}
            style={{ pointerEvents: isVisible ? "auto" : "none" }}
        />
    )
}
