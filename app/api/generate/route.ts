import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamObject } from "ai";

import { CardSchema } from "@/lib/schemas/card";

const google = createGoogleGenerativeAI({
  // custom settings
  apiKey: process.env.GOOGLE_API_KEY || "",
  baseURL: "https://api.genai.gd.edu.kg/google//v1beta/",
});

const model = google("gemini-1.5-pro-latest");

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("prompt", prompt);

    if (!prompt || prompt.length === 0) {
      throw new Error("No prompt provided");
    }

    const result = await streamObject({
      model,
      schema: CardSchema,
      messages: [
        {
          role: "system",
          content: "你是一个信息卡片生成器。根据用户输入生成JSON数据。",
        },
        { role: "user", content: prompt },
      ],
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error("Error:", error);
    return new Response("Invalid request", { status: 400 });
  }
}
