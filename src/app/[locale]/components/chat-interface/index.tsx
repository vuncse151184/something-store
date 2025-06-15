"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Flower2, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { generateBouquetRecommendation } from "@/lib/ai"
import BouquetSuggestion from "./../bouqet-suggestion"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  bouquets?: Bouquet[]
}

type Bouquet = {
  id: string
  name: string
  description: string
  meaning: string
  image: string
  price: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your bouquet advisor. I can help you find the perfect flowers based on the occasion, meaning, or emotion you want to convey. What kind of message would you like your flowers to express?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setStreamingContent("")

    try {
      // Generate bouquet recommendations
      const { text, bouquets } = await generateBouquetRecommendation([...messages, userMessage], (chunk) => {
        setStreamingContent((prev) => prev + chunk)
      })
      console.log("Generated bouquets:", bouquets)
      console.log("Generated text:", text)
      // After streaming completes, add the full message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: text,
          bouquets: bouquets,
        },
      ])
      setStreamingContent("")
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error while finding bouquet recommendations. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              <div
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3",
                  message.role === "user" ? "bg-gray-800" : "bg-gray-800/50",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
                    message.role === "user" ? "bg-purple-700" : "bg-pink-700",
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Flower2 className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-300">
                    {message.role === "user" ? "You" : "Bouquet Advisor"}
                  </p>
                  <div className="prose prose-sm max-w-none prose-invert">
                    <p className="text-gray-300">{message.content}</p>
                  </div>
                </div>
              </div>

              {/* Bouquet suggestions */}
              {message.bouquets && message.bouquets.length > 0 && (
                <div className="pl-11">
                  <div className="grid grid-cols-1 gap-3">
                    {message.bouquets.map((bouquet) => (
                      <BouquetSuggestion key={bouquet.id} bouquet={bouquet} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Streaming message */}
          {streamingContent && (
            <div className="flex items-start gap-3 rounded-lg p-3 bg-gray-800/50">
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-pink-700">
                <Flower2 className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-300">Bouquet Advisor</p>
                <div className="prose prose-sm max-w-none prose-invert">
                  <p className="text-gray-300">
                    {streamingContent}
                    <span className="inline-block w-1.5 h-4 ml-0.5 bg-pink-500 animate-pulse" />
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t border-gray-800 p-3 bg-gray-900">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about flower meanings or occasions..."
            className="min-h-10 max-h-32 resize-none text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus-visible:ring-purple-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  )
}
