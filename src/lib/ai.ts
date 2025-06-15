import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// Configure OpenAI with API key
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  bouquets?: any[]
}

type Bouquet = {
  id: string
  name: string
  description: string
  meaning: string
  image: string
  price: string
}

// Enhanced bouquet database with more detailed information
const bouquetDatabase: Bouquet[] = [
  {
    id: "1",
    name: "Love's Embrace",
    description: "A passionate arrangement of red roses and lilies",
    meaning: "Deep love and passion",
    image: "/placeholder.svg?height=200&width=200&text=Love's+Embrace",
    price: "$89.99",
  },
  {
    id: "2",
    name: "Peaceful Harmony",
    description: "White lilies and blue delphiniums create a serene arrangement",
    meaning: "Peace, tranquility, and harmony",
    image: "/placeholder.svg?height=200&width=200&text=Peaceful+Harmony",
    price: "$79.99",
  },
  {
    id: "3",
    name: "Joyful Celebration",
    description: "Vibrant sunflowers and gerbera daisies",
    meaning: "Happiness, joy, and celebration",
    image: "/placeholder.svg?height=200&width=200&text=Joyful+Celebration",
    price: "$69.99",
  },
  {
    id: "4",
    name: "Sympathy & Remembrance",
    description: "Elegant white roses and chrysanthemums",
    meaning: "Remembrance, sympathy, and respect",
    image: "/placeholder.svg?height=200&width=200&text=Sympathy+Remembrance",
    price: "$84.99",
  },
  {
    id: "5",
    name: "New Beginnings",
    description: "Fresh daisies and pink tulips",
    meaning: "New starts, innocence, and hope",
    image: "/placeholder.svg?height=200&width=200&text=New+Beginnings",
    price: "$74.99",
  },
  {
    id: "6",
    name: "Gratitude Bouquet",
    description: "Pink and peach roses with eucalyptus",
    meaning: "Thankfulness and appreciation",
    image: "/placeholder.svg?height=200&width=200&text=Gratitude+Bouquet",
    price: "$64.99",
  },
]

// Enhanced system prompt for better ChatGPT integration
const SYSTEM_PROMPT = `You are a knowledgeable floral advisor with expertise in flower symbolism, color meanings, and appropriate arrangements for various occasions and emotions.

Your role is to:
1. Understand the customer's needs, occasion, and emotional context
2. Provide thoughtful recommendations based on flower meanings and symbolism
3. Explain why certain flowers are appropriate for specific situations
4. Be warm, empathetic, and helpful while maintaining professionalism
5. Consider cultural significance and traditional meanings of flowers
6. Suggest complementary flowers and arrangements when appropriate

Available bouquets and their meanings:
1. Love's Embrace - Red roses and lilies for deep love and passion
2. Peaceful Harmony - White lilies and blue delphiniums for peace and tranquility
3. Joyful Celebration - Sunflowers and gerbera daisies for happiness and joy
4. Sympathy & Remembrance - White roses and chrysanthemums for remembrance and respect
5. New Beginnings - Daisies and pink tulips for new starts and hope
6. Gratitude Bouquet - Pink and peach roses with eucalyptus for thankfulness

Provide concise but informative responses focusing on the meaning behind different flowers and why they're perfect for the customer's needs.`

// Function to analyze user intent and extract keywords
function analyzeUserIntent(message: string): {
  occasion?: string
  emotion?: string
  recipient?: string
  keywords: string[]
} {
  const content = message.toLowerCase()
  const keywords: string[] = []
  
  // Occasion detection
  const occasions = {
    romantic: ['love', 'romantic', 'anniversary', 'valentine', 'date', 'propose', 'engagement'],
    celebration: ['birthday', 'congratulations', 'graduation', 'promotion', 'achievement', 'success'],
    sympathy: ['sympathy', 'condolences', 'funeral', 'sorry', 'loss', 'grief', 'memorial'],
    gratitude: ['thank', 'appreciation', 'grateful', 'gratitude', 'thanks'],
    newbeginning: ['new', 'beginning', 'baby', 'birth', 'housewarming', 'job', 'fresh start'],
    wellness: ['get well', 'hospital', 'recovery', 'healing', 'sick', 'better']
  }
  
  // Emotion detection
  const emotions = {
    happy: ['happy', 'joy', 'cheerful', 'bright', 'uplifting', 'smile'],
    peaceful: ['peace', 'calm', 'relax', 'serene', 'tranquil', 'zen'],
    loving: ['love', 'affection', 'caring', 'tender', 'sweet'],
    respectful: ['respect', 'honor', 'dignified', 'elegant', 'formal']
  }
  
  let detectedOccasion: string | undefined
  let detectedEmotion: string | undefined
  
  // Check for occasions
  for (const [occasion, terms] of Object.entries(occasions)) {
    if (terms.some(term => content.includes(term))) {
      detectedOccasion = occasion
      keywords.push(...terms.filter(term => content.includes(term)))
    }
  }
  
  // Check for emotions
  for (const [emotion, terms] of Object.entries(emotions)) {
    if (terms.some(term => content.includes(term))) {
      detectedEmotion = emotion
      keywords.push(...terms.filter(term => content.includes(term)))
    }
  }
  
  return {
    occasion: detectedOccasion,
    emotion: detectedEmotion,
    keywords: [...new Set(keywords)] // Remove duplicates
  }
}

// Enhanced bouquet recommendation logic
function getSmartBouquetRecommendations(userRequest: string, chatGPTResponse: string): Bouquet[] {
  const analysis = analyzeUserIntent(userRequest)
  const responseAnalysis = analyzeUserIntent(chatGPTResponse)
  
  // Combine keywords from both user request and ChatGPT response
  const allKeywords = [...analysis.keywords, ...responseAnalysis.keywords]
  
  let recommendedBouquets: Bouquet[] = []
  const scores = new Map<string, number>()
  
  // Score-based recommendation system
  const scoringRules = {
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
  
  // Calculate scores
  allKeywords.forEach(keyword => {
    const rule = scoringRules[keyword as keyof typeof scoringRules]
    if (rule) {
      rule.bouquetIds.forEach(id => {
        const currentScore = scores.get(id) || 0
        scores.set(id, currentScore + rule.weight)
      })
    }
  })
  
  // Sort by score and get top recommendations
  const sortedBouquets = Array.from(scores.entries())
    .sort(([,a], [,b]) => b - a)
    .map(([id]) => bouquetDatabase.find(b => b.id === id))
    .filter(Boolean) as Bouquet[]
  
  recommendedBouquets = sortedBouquets.slice(0, 3)
  
  // Fallback: if no specific matches, provide diverse selection
  if (recommendedBouquets.length === 0) {
    recommendedBouquets = [bouquetDatabase[0], bouquetDatabase[2], bouquetDatabase[4]]
  }
  
  return recommendedBouquets
}

// Main function with enhanced ChatGPT integration
export async function generateBouquetRecommendation(
  messages: Message[],
  onChunk: (chunk: string) => void,
): Promise<{ text: string; bouquets: Bouquet[] }> {
  try {
    // Validate input
    if (!messages || messages.length === 0) {
      throw new Error("No messages provided")
    }
    console.log("Received messages for bouquet recommendation:", process.env.OPENAI_API_KEY)
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured")
    }
    
    // Format messages for OpenAI API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }))
    
    console.log("Formatted messages for OpenAI:", formattedMessages)
    
    // Initialize OpenAI model with enhanced configuration
    const model = openai("gpt-4o")
    
    // Use streamText with enhanced configuration
    const result = streamText({
      model: model,
      messages: formattedMessages,
      system: SYSTEM_PROMPT,
      temperature: 0.7, // Balanced creativity and consistency
      maxTokens: 500, // Reasonable response length
      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          onChunk(chunk.text)
        }
      },
    })
    
    // Get the complete response
    const text = await result.text
    console.log("Generated ChatGPT response:", text)
    
    // Get user's latest message for analysis
    const userRequest = messages[messages.length - 1].content
    
    // Use enhanced recommendation logic
    const recommendedBouquets = getSmartBouquetRecommendations(userRequest, text)
    
    console.log("Recommended bouquets:", recommendedBouquets.map(b => b.name))
    
    return { text, bouquets: recommendedBouquets }
    
  } catch (error) {
    console.error("Error in generateBouquetRecommendation:", error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("OpenAI API configuration error. Please check your API key.")
      }
      if (error.message.includes("quota") || error.message.includes("billing")) {
        throw new Error("OpenAI API quota exceeded. Please check your billing status.")
      }
      if (error.message.includes("rate limit")) {
        throw new Error("Rate limit exceeded. Please try again in a moment.")
      }
    }
    
    throw new Error("Failed to generate bouquet recommendations. Please try again.")
  }
}

// Optional: Function to get bouquet details by ID
export function getBouquetById(id: string): Bouquet | undefined {
  return bouquetDatabase.find(bouquet => bouquet.id === id)
}

// Optional: Function to get all available bouquets
export function getAllBouquets(): Bouquet[] {
  return bouquetDatabase
}

// Optional: Function to search bouquets by keyword
export function searchBouquets(query: string): Bouquet[] {
  const searchTerm = query.toLowerCase()
  return bouquetDatabase.filter(bouquet => 
    bouquet.name.toLowerCase().includes(searchTerm) ||
    bouquet.description.toLowerCase().includes(searchTerm) ||
    bouquet.meaning.toLowerCase().includes(searchTerm)
  )
}