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
          content: `你是一个高级信息卡片生成器。根据用户输入生成丰富的JSON数据，用于渲染信息卡片。

请根据用户的输入内容，生成一个结构化的信息卡片，包含以下元素：
1. 主标题和可选的副标题
2. 卡片项目列表，每个项目包含标题、描述和可选的行动步骤
3. 适合内容的布局类型（grid、list、masonry、carousel、timeline、tabs、accordion）
4. 美观的主题配色方案
5. 适当的视觉元素位置和样式

支持的布局类型：
- grid: 网格布局，适合展示平等重要性的项目
- list: 列表布局，适合线性阅读的内容
- masonry: 瀑布流布局，适合不同高度的内容
- carousel: 轮播布局，适合浏览多个项目
- timeline: 时间线布局，适合展示有序或时间相关的内容
- tabs: 标签页布局，适合分类内容
- accordion: 手风琴布局，适合需要展开/折叠的详细内容

请根据内容的性质选择最合适的布局类型，并设置适当的主题颜色。对于特别重要的项目，可以设置highlight为true来突出显示。

生成的JSON应符合预定义的模式，包括标题、项目列表、布局和主题设置。`,
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
