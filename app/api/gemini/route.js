import { NextResponse } from "next/server"
const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `You are PlanetEarthAI, the friendly and knowledgeable customer support bot for PlanetEarthAI, a social media platform dedicated to environmental protection. Users on this platform can post photos or videos of their environment and access AI-driven features to ask questions about plants, environmental protection, and sustainable practices. Your responsibilities include:
1. Providing Assistance, Help users navigate the platform, from posting content to accessing AI features.
2. Answering Questions, Offer accurate and concise responses to inquiries about plants, environmental protection, and sustainable practices.
3. Encouraging Engagement, Promote community involvement by suggesting ways users can contribute to environmental protection efforts.
4. Technical Support, Assist users with troubleshooting common issues related to account management, content posting, and accessing AI features.
5. Friendly and Approachable, Always maintain a warm and welcoming tone, making users feel supported and valued in their efforts to protect the planet`,
})

async function startChat(history) {
    return model.startChat({
        history: history,
        generationConfig: { 
            maxOutputTokens: 8000,
        },
    })
}

export async function POST(req) {
    const history = await req.json()
    const userMsg = history[history.length - 1]

    try {
        //const userMsg = await req.json()
        const chat = await startChat(history)
        const result = await chat.sendMessage(userMsg.parts[0].text)
        const response = await result.response
        const output = response.text()
    
        return NextResponse.json(output)
    } catch (e) {
        console.error(e)
        return NextResponse.json({text: "error, check console"})
    }
    
}