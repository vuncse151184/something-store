import { streamText, generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import dotenv from 'dotenv'

dotenv.config()

// Types
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  bouquets?: Bouquet[]
}

interface Bouquet {
  id: string
  name: string
  description: string
  meaning: string
  image: string
  price: string
}

interface UserIntent {
  occasion?: string
  emotion?: string
  recipient?: string
  keywords: string[]
}

interface RecommendationResult {
  text: string
  bouquets: Bouquet[]
}

interface BouquetScore {
  bouquetId: string
  score: number
}

// Configuration
class GeminiConfig {
  private static instance: GeminiConfig
  private client: ReturnType<typeof createGoogleGenerativeAI>

  private constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY is required")
    }
    
    console.log("Initializing Gemini with API key:", apiKey.substring(0, 10) + "...")
    
    this.client = createGoogleGenerativeAI({
      apiKey: apiKey,
    })
  }

  static getInstance(): GeminiConfig {
    if (!GeminiConfig.instance) {
      GeminiConfig.instance = new GeminiConfig()
    }
    return GeminiConfig.instance
  }

  getModel(modelName: string = "gemini-2.0-flash") {
    return this.client(modelName)
  }
}

// Constants
const BOUQUET_DATABASE: Bouquet[] = [
  {
    id: "1",
    name: "Love's Embrace",
    description: "A passionate arrangement of red roses and lilies",
    meaning: "Deep love and passion",
    image: "/images/rose-3.jpg",
    price: "$89.99",
  },
  {
    id: "2",
    name: "Peaceful Harmony",
    description: "White lilies and blue delphiniums create a serene arrangement",
    meaning: "Peace, tranquility, and harmony",
    image: "/images/rose-3.jpg",
    price: "$79.99",
  },
  {
    id: "3",
    name: "Joyful Celebration",
    description: "Vibrant sunflowers and gerbera daisies",
    meaning: "Happiness, joy, and celebration",
    image: "/images/rose-3.jpg",
    price: "$69.99",
  },
  {
    id: "4",
    name: "Sympathy & Remembrance",
    description: "Elegant white roses and chrysanthemums",
    meaning: "Remembrance, sympathy, and respect",
    image: "/images/rose-3.jpg",
    price: "$84.99",
  },
  {
    id: "5",
    name: "New Beginnings",
    description: "Fresh daisies and pink tulips",
    meaning: "New starts, innocence, and hope",
    image: "/images/rose-3.jpg",
    price: "$74.99",
  },
  {
    id: "6",
    name: "Gratitude Bouquet",
    description: "Pink and peach roses with eucalyptus",
    meaning: "Thankfulness and appreciation",
    image: "/images/rose-3.jpg",
    price: "$64.99",
  },
]

const SYSTEM_PROMPT = `You are a knowledgeable floral advisor with expertise in flower symbolism, color meanings, and appropriate arrangements for various occasions and emotions.

Your role is to:
1. Understand the customer's needs, occasion, and emotional context
2. Provide thoughtful recommendations based on flower meanings and symbolism
3. Explain why certain flowers are appropriate for specific situations
4. Be warm, empathetic, and helpful while maintaining professionalism
5. Consider cultural significance and traditional meanings of flowers
6. Suggest complementary flowers and arrangements when appropriate

Available bouquets and their meanings:
${BOUQUET_DATABASE.map(b => `${b.id}. ${b.name} - ${b.description} for ${b.meaning.toLowerCase()}`).join('\n')}

Provide concise but informative responses focusing on the meaning behind different flowers and why they're perfect for the customer's needs.`

// Intent Analysis Service
class IntentAnalyzer {
  private static readonly OCCASION_KEYWORDS = {
    romantic: ['love', 'romantic', 'anniversary', 'valentine', 'date', 'propose', 'engagement'],
    celebration: ['birthday', 'congratulations', 'graduation', 'promotion', 'achievement', 'success'],
    sympathy: ['sympathy', 'condolences', 'funeral', 'sorry', 'loss', 'grief', 'memorial'],
    gratitude: ['thank', 'appreciation', 'grateful', 'gratitude', 'thanks'],
    newbeginning: ['new', 'beginning', 'baby', 'birth', 'housewarming', 'job', 'fresh start'],
    wellness: ['get well', 'hospital', 'recovery', 'healing', 'sick', 'better']
  }

  private static readonly EMOTION_KEYWORDS = {
    happy: ['happy', 'joy', 'cheerful', 'bright', 'uplifting', 'smile'],
    peaceful: ['peace', 'calm', 'relax', 'serene', 'tranquil', 'zen'],
    loving: ['love', 'affection', 'caring', 'tender', 'sweet'],
    respectful: ['respect', 'honor', 'dignified', 'elegant', 'formal']
  }

  static analyze(message: string): UserIntent {
    const content = message.toLowerCase()
    const keywords: string[] = []
    
    let detectedOccasion: string | undefined
    let detectedEmotion: string | undefined
    
    // Analyze occasions
    for (const [occasion, terms] of Object.entries(this.OCCASION_KEYWORDS)) {
      const matchedTerms = terms.filter(term => content.includes(term))
      if (matchedTerms.length > 0) {
        detectedOccasion = occasion
        keywords.push(...matchedTerms)
      }
    }
    
    // Analyze emotions
    for (const [emotion, terms] of Object.entries(this.EMOTION_KEYWORDS)) {
      const matchedTerms = terms.filter(term => content.includes(term))
      if (matchedTerms.length > 0) {
        detectedEmotion = emotion
        keywords.push(...matchedTerms)
      }
    }
    
    return {
      occasion: detectedOccasion,
      emotion: detectedEmotion,
      keywords: [...new Set(keywords)]
    }
  }
}

// Bouquet Recommendation Engine
class BouquetRecommendationEngine {
  private static readonly SCORING_RULES = {
    'love': { bouquetIds: ['1'], weight: 3 },
    'romantic': { bouquetIds: ['1'], weight: 3 },
    'anniversary': { bouquetIds: ['1'], weight: 3 },
    'peace': { bouquetIds: ['2'], weight: 3 },
    'calm': { bouquetIds: ['2'], weight: 2 },
    'tranquil': { bouquetIds: ['2'], weight: 2 },
    'happy': { bouquetIds: ['3'], weight: 3 },
    'joy': { bouquetIds: ['3'], weight: 3 },
    'celebration': { bouquetIds: ['3'], weight: 3 },
    'birthday': { bouquetIds: ['3'], weight: 3 },
    'sympathy': { bouquetIds: ['4'], weight: 3 },
    'condolences': { bouquetIds: ['4'], weight: 3 },
    'funeral': { bouquetIds: ['4'], weight: 3 },
    'new': { bouquetIds: ['5'], weight: 2 },
    'beginning': { bouquetIds: ['5'], weight: 3 },
    'baby': { bouquetIds: ['5'], weight: 3 },
    'thank': { bouquetIds: ['6'], weight: 3 },
    'grateful': { bouquetIds: ['6'], weight: 3 },
    'appreciation': { bouquetIds: ['6'], weight: 3 }
  }

  static recommend(userRequest: string, aiResponse: string, maxRecommendations: number = 3): Bouquet[] {
    const userIntent = IntentAnalyzer.analyze(userRequest)
    const responseIntent = IntentAnalyzer.analyze(aiResponse)
    
    const allKeywords = [...userIntent.keywords, ...responseIntent.keywords]
    const scores = this.calculateScores(allKeywords)
    
    const sortedBouquets = this.sortByScore(scores)
    
    return sortedBouquets.length > 0 
      ? sortedBouquets.slice(0, maxRecommendations)
      : this.getDefaultRecommendations(maxRecommendations)
  }

  private static calculateScores(keywords: string[]): Map<string, number> {
    const scores = new Map<string, number>()
    
    keywords.forEach(keyword => {
      const rule = this.SCORING_RULES[keyword as keyof typeof this.SCORING_RULES]
      if (rule) {
        rule.bouquetIds.forEach(id => {
          const currentScore = scores.get(id) || 0
          scores.set(id, currentScore + rule.weight)
        })
      }
    })
    
    return scores
  }

  private static sortByScore(scores: Map<string, number>): Bouquet[] {
    return Array.from(scores.entries())
      .sort(([,a], [,b]) => b - a)
      .map(([id]) => BOUQUET_DATABASE.find(b => b.id === id))
      .filter((bouquet): bouquet is Bouquet => bouquet !== undefined)
  }

  private static getDefaultRecommendations(count: number): Bouquet[] {
    return [BOUQUET_DATABASE[0], BOUQUET_DATABASE[2], BOUQUET_DATABASE[4]].slice(0, count)
  }
}

// AI Service
class GeminiAIService {
  private geminiConfig: GeminiConfig

  constructor() {
    this.geminiConfig = GeminiConfig.getInstance()
  }

  async generateStreamingResponse(
    messages: Message[],
    onChunk: (chunk: string) => void
  ): Promise<string> {
    console.log("Starting streaming response generation...")
    
    const formattedMessages = this.formatMessages(messages)
    const model = this.geminiConfig.getModel()
    
    console.log("Formatted messages:", formattedMessages)
    
    try {
      const result = streamText({
        model,
        messages: formattedMessages,
        system: SYSTEM_PROMPT,
        temperature: 0.7,
        maxTokens: 500,
      })
      
      let fullText = ""
      
      // Process the stream
      for await (const chunk of result.textStream) {
        console.log("Received chunk:", chunk)
        fullText += chunk
        onChunk(chunk)
      }
      
      console.log("Streaming completed. Full text:", fullText)
      return fullText
      
    } catch (error) {
      console.error("Error in streaming:", error)
      throw error
    }
  }

  async generateDirectResponse(messages: Message[]): Promise<string> {
    console.log("Starting direct response generation...")
    
    const formattedMessages = this.formatMessages(messages)
    const model = this.geminiConfig.getModel()
    
    try {
      const result = await generateText({
        model,
        messages: formattedMessages,
        system: SYSTEM_PROMPT,
        temperature: 0.7,
        maxTokens: 500,
      })
      
      console.log("Direct response generated:", result.text)
      return result.text
      
    } catch (error) {
      console.error("Error in direct generation:", error)
      throw error
    }
  }

  private formatMessages(messages: Message[]) {
    return messages.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }))
  }
}

// Main Service Class
export class BouquetRecommendationService {
  private aiService: GeminiAIService

  constructor() {
    this.aiService = new GeminiAIService()
  }

  async generateRecommendation(
    messages: Message[],
    onChunk?: (chunk: string) => void
  ): Promise<RecommendationResult> {
    try {
      console.log("Starting recommendation generation...")
      this.validateInput(messages)
      
      const userRequest = this.getLatestUserMessage(messages)
      console.log("User request:", userRequest)
      
      let text = ""
      let accumulatedText = ""
      
      // Generate AI response with streaming or direct
      if (onChunk) {
        console.log("Using streaming response...")
        text = await this.aiService.generateStreamingResponse(messages, (chunk) => {
          accumulatedText += chunk
          onChunk(chunk)
        })
      } else {
        console.log("Using direct response...")
        text = await this.aiService.generateDirectResponse(messages)
      }
      
      // Use accumulated text if available, otherwise use the returned text
      const finalText = accumulatedText || text
      
      // Get bouquet recommendations
      const bouquets = BouquetRecommendationEngine.recommend(userRequest, finalText)
      
      console.log("Generated response:", finalText)
      console.log("Recommended bouquets:", bouquets.map(b => b.name))
      
      return { text: finalText, bouquets }
      
    } catch (error) {
      console.error("Error in generateRecommendation:", error)
      throw this.handleError(error)
    }
  }

  private validateInput(messages: Message[]): void {
    if (!messages || messages.length === 0) {
      throw new Error("No messages provided")
    }
  }

  private getLatestUserMessage(messages: Message[]): string {
    const userMessages = messages.filter(msg => msg.role === "user")
    if (userMessages.length === 0) {
      throw new Error("No user messages found")
    }
    return userMessages[userMessages.length - 1].content
  }

  private handleError(error: unknown): Error {
    console.error("Error in generateBouquetRecommendation:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return new Error("Gemini API configuration error. Please check your API key.")
      }
      if (error.message.includes("quota") || error.message.includes("billing")) {
        return new Error("Gemini API quota exceeded. Please check your billing status.")
      }
      if (error.message.includes("rate limit")) {
        return new Error("Rate limit exceeded. Please try again in a moment.")
      }
    }
    
    return new Error("Failed to generate bouquet recommendations. Please try again.")
  }
}

// Utility Functions
export class BouquetUtilities {
  static getBouquetById(id: string): Bouquet | undefined {
    return BOUQUET_DATABASE.find(bouquet => bouquet.id === id)
  }

  static getAllBouquets(): Bouquet[] {
    return [...BOUQUET_DATABASE]
  }

  static searchBouquets(query: string): Bouquet[] {
    const searchTerm = query.toLowerCase()
    return BOUQUET_DATABASE.filter(bouquet => 
      bouquet.name.toLowerCase().includes(searchTerm) ||
      bouquet.description.toLowerCase().includes(searchTerm) ||
      bouquet.meaning.toLowerCase().includes(searchTerm)
    )
  }
}

// Main Export Functions (for backward compatibility)
export async function generateBouquetRecommendation(
  messages: Message[],
  onChunk: (chunk: string) => void,
): Promise<RecommendationResult> {
  const service = new BouquetRecommendationService()
  return service.generateRecommendation(messages, onChunk)
}

export const getBouquetById = BouquetUtilities.getBouquetById
export const getAllBouquets = BouquetUtilities.getAllBouquets
export const searchBouquets = BouquetUtilities.searchBouquets

console.log("Bouquet Recommendation Service initialized.")

// Export types
export type { Message, Bouquet, UserIntent, RecommendationResult }