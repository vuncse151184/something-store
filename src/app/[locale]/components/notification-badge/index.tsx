"use client"

import { motion, AnimatePresence } from "framer-motion"

interface NotificationBadgeProps {
    show: boolean
}

export default function NotificationBadge({ show }: NotificationBadgeProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                />
            )}
        </AnimatePresence>
    )
}
