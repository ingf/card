import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

import {
  // 轮播图卡片
  BasicCarouselSchema,
  ListCarouselSchema,
  MediaCarouselSchema,
  // Quote类型

  // 枚举
  CardTypeSchema,
} from "@/lib/schemas/card";
import { contentPrompt, content2HtmlTemplate } from "@/app/prompts/content";
import {
  listCardPrompt,
  basicCardPrompt,
} from "@/app/prompts/cardPrompt";

// const google = createGoogleGenerativeAI({
//   // custom settings
//   apiKey: process.env.GOOGLE_API_KEY || "",
//   baseURL: "https://api.genai.gd.edu.kg/google//v1beta/",
// });

// 验证必需的环境变量
const requiredEnvVars = [
  "AZURE_OPENAI_API_KEY",
  "AZURE_OPENAI_ENDPOINT",
  "AZURE_OPENAI_DEPLOYMENT_NAME",
  "AZURE_OPENAI_API_VERSION",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// 配置Azure OpenAI客户端
const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
});

// const model = google("gemini-1.5-pro-latest");

export const runtime = "edge";

// 定义不同类型卡片对应的 prompt
const cardPrompts: Record<z.infer<typeof CardTypeSchema>, string> = {
  list: listCardPrompt,
  basic: basicCardPrompt,
  html: content2HtmlTemplate,
};

// 获取对应的 schema
const getSchemaByType = (type: z.infer<typeof CardTypeSchema>) => {
  const schemaMap: Record<z.infer<typeof CardTypeSchema>, z.ZodType> = {
    basic: BasicCarouselSchema,
    list: ListCarouselSchema,
    html: MediaCarouselSchema,
  };

  return schemaMap[type] || ListCarouselSchema; // 默认返回 ListCardSchema
};

export async function POST(req: Request) {
  try {
    const { prompt, type = "list" } = await req.json();
    console.log("prompt: ", prompt, "type: ", type);

    if (!prompt || prompt.length === 0) {
      throw new Error("No prompt provided");
    }

    // 验证卡片类型是否有效
    if (!Object.keys(cardPrompts).includes(type)) {
      throw new Error(`Invalid card type: ${type}`);
    }

    // 获取对应的 schema 和 prompt
    const schema = getSchemaByType(type as z.infer<typeof CardTypeSchema>);
    const systemPrompt = cardPrompts[type as z.infer<typeof CardTypeSchema>];

    if (type === "html") {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(schema, "entities"),
      });

      // 等待内容生成完成
      const contentResponse = await completion;
      const contentData = JSON.parse(
        contentResponse.choices[0].message.content || "{}"
      );
      console.log("contentData: ", contentData);

      const item = contentData?.items[0];
      const { title, description } = item;

      console.log(`${title}\n${description}`);

      // 使用生成的内容构建 HTML 生成系统消息
      const htmlSystemMessage = content2HtmlTemplate.replace(
        "{{content}}",
        `${title}\n${description}`
      );
      console.log("htmlSystemMessage: ", htmlSystemMessage);

      // 调用 OpenAI API 生成 HTML
      const htmlResponse = await client.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: htmlSystemMessage },
          { role: "user", content: `${title}: ${description}` },
        ],
        temperature: 0.7,
      });

      const htmlResult = htmlResponse.choices[0].message.content;
      console.log("htmlResult: ", htmlResult);

      return Response.json({
        data: {
          html: htmlResult?.replace(/```html|```/g, ""),
        },
      });

      // // 构建系统消息，使用模板
      // const contentSystemMessage = contentPrompt.replace(
      //   "{{content}}",
      //   `${prompt}`
      // );

      // // 调用 OpenAI API 生成内容
      // const contentPromise = client.chat.completions.create({
      //   model: "gpt-4o-2024-08-06",
      //   messages: [
      //     { role: "system", content: contentSystemMessage },
      //     { role: "user", content: prompt },
      //   ],
      //   temperature: 0.7,
      //   max_tokens: 2500,
      //   response_format: zodResponseFormat(contentArraySchema, "content"),
      // });

      // // 等待内容生成完成
      // const contentResponse = await contentPromise;
      // const contentData = JSON.parse(
      //   contentResponse.choices[0].message.content || "{}"
      // );
      // console.log("contentData: ", contentData);

      // const item = contentData?.data?.items[0];
      // const { title, description } = item;

      // // 使用生成的内容构建 HTML 生成系统消息
      // const htmlSystemMessage = content2HtmlTemplate.replace(
      //   "{{content}}",
      //   `${title}\n${description}`
      // );

      // // 调用 OpenAI API 生成 HTML
      // const htmlResponse = await client.chat.completions.create({
      //   model: "gpt-4-turbo",
      //   messages: [
      //     { role: "system", content: htmlSystemMessage },
      //     { role: "user", content: "根据提供的内容生成 HTML 页面" },
      //   ],
      //   temperature: 0.7,
      //   max_tokens: 4000,
      //   response_format: zodResponseFormat(content2HtmlSchema, "content"),
      // });

      // const htmlResult = htmlResponse.choices[0].message.content;

      // return Response.json({
      //   data: {
      //     content: JSON.parse(contentData || "{}"),
      //     html: JSON.parse(htmlResult || "{}"),
      //   },
      // });
    } else {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(schema, "entities"),
      });

      return Response.json({
        data: JSON.parse(completion.choices[0].message.content || "{}"),
      });
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Invalid request";
    console.error("API错误:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
