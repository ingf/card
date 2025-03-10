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
          content: `你是一个高级信息卡片生成器。根据用户输入生成丰富的JSON数据，用于渲染多种格式的信息卡片和海报。

请根据用户的输入内容，生成一个结构化的信息卡片，包含以下元素：
1. 主标题（简洁有力）和副标题（必须提供，对主题进行补充说明）
2. 卡片项目列表，每个项目必须包含：
   - 标题（简洁明了，5-10字为宜）
   - 详细描述（标准化长度：简单海报模式下显示的内容控制在50字以内，完整描述控制在150-200字之间）
   - 行动步骤（具体可执行的建议，控制在50字以内）
3. 生成5-7个卡片项目，确保内容丰富且有实用价值
4. 每个项目的内容应该是独立且完整的，不要简单重复
5. 使用轮播布局（carousel）展示内容
6. 设置美观的主题配色方案

内容结构要求：
- 确保内容既适合简单海报展示（只显示标题和简短描述）
- 也适合复杂海报展示（显示完整内容、详细描述和行动步骤）
- 每个项目的标题应该是自成一体的，能单独在简单海报上展示
- 描述部分必须严格遵循以下格式：
  * 第一句或前两句（50字以内）作为简单海报的摘要，以句号结束
  * 后面的内容作为详细描述，总字数控制在150-200字之间
- 行动步骤应该简明扼要，便于在海报上展示，控制在50字以内

内容质量要求：
- 确保每个卡片项目的描述详细且有深度，但不要超出规定字数
- 提供具体的例子、数据或案例来支持观点
- 行动步骤应该是具体、可操作的建议，而不是泛泛而谈
- 内容应该专业、准确，并具有教育价值
- 使用简明易懂的语言，避免过于技术性的术语

生成的JSON应符合预定义的模式，包括标题、副标题、项目列表（至少5个项目）、布局和主题设置。

注意：确保生成的内容在不同格式的海报中都能良好展示，无论是简单的单行标题海报，还是包含详细内容的复杂海报。所有卡片项目的内容长度必须标准化，以确保在切换不同卡片时保持一致的视觉效果。`,
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
