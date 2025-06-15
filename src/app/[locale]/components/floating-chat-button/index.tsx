"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import { motion } from "framer-motion"
import NotificationBadge from "./../notification-badge"
import { AnimatePresence } from "framer-motion"

interface FloatingChatButtonProps {
    toggleChat: () => void
    isOpen: boolean
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ toggleChat, isOpen }) => {
    const [hasNotification, setHasNotification] = useState(true)

    useEffect(() => {
        if (isOpen && hasNotification) {
            setHasNotification(false)
        }
    }, [isOpen, hasNotification])

    return (
        <Button
            onClick={toggleChat}
            size="lg"
            className={`rounded-full w-14 h-14 shadow-lg relative ${isOpen ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
            aria-label={isOpen ? "Close chat" : "Open chat"}
            aria-expanded={isOpen}
            aria-controls="chat-panel"
        >
            <NotificationBadge show={!isOpen && hasNotification} />
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isOpen ? "close" : "open"}
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
                </motion.div>
            </AnimatePresence>
        </Button>
    )
}

export default FloatingChatButton
