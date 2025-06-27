"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Flower2, X, Minimize2, FlowerIcon, Expand } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatInterface from "./../chat-interface"
import { useMobile } from "@/app/hooks/useMobileHook"

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasNotification, setHasNotification] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isMobile = useMobile()

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (hasNotification) {
      setHasNotification(false)
    }
    if (!isOpen) {
      setIsExpanded(false) // Reset expanded state when opening
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Handle click outside to close
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

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, isMobile])

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-black/60 z-1000 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      )}

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            id="chat-panel"
            className={`fixed z-500 bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-800 ${isMobile
                ? "inset-x-4 bottom-20 top-20"
                : `bottom-20 right-24 h-[500px] ${isExpanded ? "w-[900px] h-[550px] " : "w-[400px]"}`
              }`}
            initial={isMobile ? { y: "100%" } : { scale: 0.8, opacity: 0, x: 80, y: 20 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1, x: 0, y: 0 }}
            exit={isMobile ? { y: "100%" } : { scale: 0.8, opacity: 0, x: 80, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            layout
          >
            {/* Chat Header with Floral Pattern */}
            <div className="relative overflow-hidden z-500"> 
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-900 to-pink-800 relative z-10">
                <div className="flex items-center space-x-2">
                  <Flower2 className="h-5 w-5 text-pink-200" />
                  <h3 className="font-medium text-white">
                    Trợ lý tư vấn hoa {isExpanded && !isMobile && "(Expanded View)"}
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  {!isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/10 rounded-full"
                      onClick={toggleExpand}
                      aria-label={isExpanded ? "Minimize chat width" : "Expand chat width"}
                    >
                      {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/10 rounded-full"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <ChatInterface isExpanded={isExpanded} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-4 z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <Button
          ref={buttonRef}
          onClick={toggleChat}
          size="lg"
          className={`rounded-full w-12 h-12 shadow-lg px-0 relative bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 border-none`}
          aria-label={isOpen ? "Close bouquet advisor" : "Open bouquet advisor"}
          aria-expanded={isOpen}
          aria-controls="chat-panel"
        >
          {/* Notification Badge */}
          <AnimatePresence>
            {!isOpen && hasNotification && (
              <motion.div
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-pink-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              />
            )}
          </AnimatePresence>

          {/* Button Icon */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-6 w-6 text-white" /> : <FlowerIcon className="h-6 w-6 text-white" />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </motion.div>
    </>
  )
}
