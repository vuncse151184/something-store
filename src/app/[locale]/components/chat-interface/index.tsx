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
  isStreaming?: boolean
}

type Bouquet = {
  id: string
  name: string
  description: string
  meaning: string
  image: string
  price: string
}

// Enhanced streaming state
type StreamingState = {
  messageId: string
  content: string
  bouquets: Bouquet[]
  isAnalyzing: boolean
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
  const [streamingState, setStreamingState] = useState<StreamingState | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingState])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Enhanced bouquet analysis during streaming
  const analyzeBouquetsFromStream = (userMessage: string, streamContent: string): Bouquet[] => {
    // Simple keyword-based analysis for real-time suggestions
    const content = (userMessage + " " + streamContent).toLowerCase()
    const suggestions: Bouquet[] = []

    // Immediate suggestions based on keywords
    if (content.includes('love') || content.includes('romantic') || content.includes('anniversary')) {
      suggestions.push({
        id: "1",
        name: "Love's Embrace",
        description: "A passionate arrangement of red roses and lilies",
        meaning: "Deep love and passion",
        image: "/images/rose-3.jpg",
        price: "$89.99",
      })
    }

    if (content.includes('peace') || content.includes('calm') || content.includes('tranquil')) {
      suggestions.push({
        id: "2",
        name: "Peaceful Harmony",
        description: "White lilies and blue delphiniums create a serene arrangement",
        meaning: "Peace, tranquility, and harmony",
        image: "/images/rose-3.jpg",
        price: "$79.99",
      })
    }

    if (content.includes('happy') || content.includes('joy') || content.includes('celebration') || content.includes('birthday')) {
      suggestions.push({
        id: "3",
        name: "Joyful Celebration",
        description: "Vibrant sunflowers and gerbera daisies",
        meaning: "Happiness, joy, and celebration",
        image: "/images/rose-3.jpg",
        price: "$69.99",
      })
    }

    if (content.includes('sympathy') || content.includes('sorry') || content.includes('condolences')) {
      suggestions.push({
        id: "4",
        name: "Sympathy & Remembrance",
        description: "Elegant white roses and chrysanthemums",
        meaning: "Remembrance, sympathy, and respect",
        image: "/images/rose-3.jpg",
        price: "$84.99",
      })
    }

    if (content.includes('new') || content.includes('beginning') || content.includes('baby') || content.includes('fresh')) {
      suggestions.push({
        id: "5",
        name: "New Beginnings",
        description: "Fresh daisies and pink tulips",
        meaning: "New starts, innocence, and hope",
        image: "/images/rose-3.jpg",
        price: "$74.99",
      })
    }

    if (content.includes('thank') || content.includes('grateful') || content.includes('appreciation')) {
      suggestions.push({
        id: "6",
        name: "Gratitude Bouquet",
        description: "Pink and peach roses with eucalyptus",
        meaning: "Thankfulness and appreciation",
        image: "/images/rose-3.jpg",
        price: "$64.99",
      })
    }

    // Remove duplicates and limit to 3
    const uniqueSuggestions = suggestions.filter((item, index, self) =>
      index === self.findIndex(t => t.id === item.id)
    )

    return uniqueSuggestions.slice(0, 3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    const assistantMessageId = (Date.now() + 1).toString()

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Initialize streaming state
    setStreamingState({
      messageId: assistantMessageId,
      content: "",
      bouquets: [],
      isAnalyzing: true
    })

    try {
      let accumulatedContent = ""
      let lastBouquetUpdate = 0

      const result = await generateBouquetRecommendation(
        [...messages, userMessage],
        (chunk) => {
          console.log("Received chunk:", chunk) // Debug log
          accumulatedContent += chunk
          const now = Date.now()

          // Update streaming content immediately
          setStreamingState(prev => prev ? {
            ...prev,
            content: accumulatedContent
          } : null)

          // Analyze bouquets every 300ms or when significant content is added
          if (now - lastBouquetUpdate > 300 || accumulatedContent.length % 30 === 0) {
            const streamingBouquets = analyzeBouquetsFromStream(userMessage.content, accumulatedContent)

            setStreamingState(prev => prev ? {
              ...prev,
              bouquets: streamingBouquets,
              isAnalyzing: streamingBouquets.length === 0
            } : null)

            lastBouquetUpdate = now
          }
        }
      )

      console.log("Final result:", result) // Debug log

      // Handle the result properly - it might just be text or an object
      let finalText = ""
      let finalBouquets: Bouquet[] = []

      if (typeof result === 'string') {
        finalText = result
      } else if (result && typeof result === 'object') {
        finalText = result.text || accumulatedContent || "No response generated"
        finalBouquets = result.bouquets || []
      } else {
        finalText = accumulatedContent || "No response generated"
      }

      // If we don't have bouquets from the API, use the ones from streaming analysis
      if (finalBouquets.length === 0 && streamingState?.bouquets) {
        finalBouquets = streamingState.bouquets
      }

      console.log("Final bouquets:", finalBouquets)
      console.log("Final text:", finalText)

      // Add the complete message
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: finalText,
          bouquets: finalBouquets,
        },
      ])

      // Clear streaming state
      setStreamingState(null)

    } catch (error) {
      console.error("Error generating response:", error)

      // If we have accumulated content, use it
      const fallbackContent = streamingState?.content || "Sorry, I encountered an error while finding bouquet recommendations. Please try again."
      const fallbackBouquets = streamingState?.bouquets || []

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: fallbackContent,
          bouquets: fallbackBouquets,
        },
      ])
      setStreamingState(null)
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
                    {message.role === "user" ? "You" : "Trợ lý tư vấn hoa"}
                  </p>
                  <div className="prose prose-sm max-w-none prose-invert">
                    <p className="text-gray-300 text-sm">{message.content}</p>
                  </div>
                </div>
              </div>

              {/* Bouquet suggestions for completed messages */}
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

          {/* Streaming message with real-time bouquet suggestions */}
          {streamingState && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg p-3 bg-gray-800/50">
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-pink-700">
                  <Flower2 className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-300">Trợ lý tư vấn hoa</p>
                  <div className="prose prose-sm max-w-none prose-invert">
                    <p className="text-gray-300 text-sm">
                      {streamingState.content}
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-pink-500 animate-pulse" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Real-time bouquet suggestions during streaming */}
              {streamingState.bouquets.length > 0 && (
                <div className="pl-11">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs text-gray-400">Suggested bouquets:</span>
                    {streamingState.isAnalyzing && (
                      <Loader2 className="h-3 w-3 animate-spin text-pink-500" />
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {streamingState.bouquets.map((bouquet, index) => (
                      <div
                        key={bouquet.id}
                        className="animate-in slide-in-from-left duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <BouquetSuggestion bouquet={bouquet} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis indicator when no bouquets yet */}
              {streamingState.bouquets.length === 0 && streamingState.isAnalyzing && (
                <div className="pl-11">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Analyzing your request for bouquet suggestions...</span>
                  </div>
                </div>
              )}
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