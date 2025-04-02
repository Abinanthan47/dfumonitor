// app/api/chat/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate response
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper function to format messages for Gemini API
function formatMessages(messages) {
  const formattedMessages = [];
  let systemPrompt = null;

  for (const message of messages) {
    if (message.role === "system") {
      systemPrompt = message.content;
      continue;
    }

    formattedMessages.push({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    });
  }

  // Insert system prompt at the beginning if it exists
  if (systemPrompt) {
    formattedMessages.unshift({
      role: "user",
      parts: [
        {
          text: `Instructions for you to follow in this conversation: ${systemPrompt}`,
        },
      ],
    });
    formattedMessages.unshift({
      role: "model",
      parts: [{ text: "." }],
    });
  }

  return formattedMessages;
}
