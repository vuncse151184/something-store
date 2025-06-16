import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"


export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json()

        // Format messages for the API
        const formattedMessages = messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
        }))

        // Create the prompt from the conversation history
        const prompt =
            formattedMessages
                .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
                .join("\n\n") + "\n\nAssistant:"

        // Create a streaming response
        const stream = streamText({
            model: openai("gpt-4o"),
            prompt,
            system: "You are a helpful AI assistant that provides accurate and concise information.",
            maxTokens: 500,
        })

        // Return the stream as a response
        return (stream.toDataStreamResponse())
    } catch (error) {
        console.error("Error in chat API:", error)
        return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
    }
}
