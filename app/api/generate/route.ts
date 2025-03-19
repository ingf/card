import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

import {
  BasicCardSchema,
  ListCardSchema,
  StepsCardSchema,
  StatsCardSchema,
  MediaCardSchema,
  LocationCardSchema,
  KeyValueCardSchema,
  TemplateCardSchema,
  CardTypeSchema
} from "@/lib/schemas/card";
import { z } from "zod";

// const google = createGoogleGenerativeAI({
//   // custom settings
//   apiKey: process.env.GOOGLE_API_KEY || "",
//   baseURL: "https://api.genai.gd.edu.kg/google//v1beta/",
// });

// 验证必需的环境变量
const requiredEnvVars = [
  'AZURE_OPENAI_API_KEY',
  'AZURE_OPENAI_ENDPOINT',
  'AZURE_OPENAI_DEPLOYMENT_NAME',
  'AZURE_OPENAI_API_VERSION'
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
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

// const model = google("gemini-1.5-pro-latest");

export const runtime = "edge";

// 定义不同类型卡片对应的 prompt
const cardPrompts: Record<z.infer<typeof CardTypeSchema>, string> = {
  list: `你是一个高级信息卡片生成器。根据用户输入生成丰富的JSON数据，用于渲染列表格式的信息卡片和海报。

请根据用户的输入内容，生成一个结构化的列表信息卡片，包含以下元素：
1. 主标题（简洁有力）和副标题（必须提供，对主题进行补充说明）
2. 卡片项目列表，每个项目必须包含：
   - 标题（简洁明了，5-10字为宜）
   - 详细描述（严格控制在80-100字之间，确保不会出现滚动条）
   - 列表要点（3-5个简短的要点，每个要点控制在15-20字以内）
3. 生成4个高质量卡片项目，确保内容丰富且有实用价值
4. 每个项目的内容应该是独立且完整的，不要简单重复
5. 使用列表布局展示内容

内容质量要求：
- 确保每个卡片项目的描述简洁精炼但有深度，严格遵守字数限制
- 提供具体的要点和建议，避免冗长的解释
- 内容应该专业、准确，并具有教育价值
- 使用简明易懂的语言，避免过于技术性的术语

生成的JSON应符合预定义的模式，包括标题、副标题、项目列表（4个高质量项目）和布局设置。`,

  basic: `你是一个高级信息卡片生成器。根据用户输入生成丰富的JSON数据，用于渲染基础格式的信息卡片和海报。

请根据用户的输入内容，生成一个结构化的基础信息卡片，包含以下元素：
1. 主标题（简洁有力）和副标题（必须提供，对主题进行补充说明）
2. 卡片项目列表，每个项目必须包含：
   - 标题（简洁明了，5-10字为宜）
   - 详细描述（严格控制在80-100字之间，确保不会出现滚动条）
3. 生成4个高质量卡片项目，确保内容丰富且有实用价值
4. 每个项目的内容应该是独立且完整的，不要简单重复
5. 使用网格布局展示内容

内容质量要求：
- 确保每个卡片项目的描述简洁精炼但有深度，严格遵守字数限制
- 提供具体的要点和建议，避免冗长的解释
- 内容应该专业、准确，并具有教育价值
- 使用简明易懂的语言，避免过于技术性的术语

生成的JSON应符合预定义的模式，包括标题、副标题、项目列表（4个高质量项目）和布局设置。`,

  steps: `你是一个高级信息卡片生成器。根据用户输入生成丰富的JSON数据，用于渲染步骤格式的信息卡片和海报。

请根据用户的输入内容，生成一个结构化的步骤信息卡片，包含以下元素：
1. 主标题（简洁有力）和副标题（必须提供，对主题进行补充说明）
2. 卡片项目列表，每个项目必须包含：
   - 标题（简洁明了，表示步骤名称，5-10字为宜）
   - 详细描述（严格控制在80-100字之间，确保不会出现滚动条）
   - 行动步骤（具体可执行的建议，控制在30-40字以内）
   - 步骤编号（从1开始的序号）
3. 生成4-6个高质量步骤项目，确保内容丰富且有实用价值，步骤之间有逻辑连贯性
4. 每个步骤的内容应该是独立且完整的，不要简单重复
5. 使用时间线布局展示内容，显示步骤编号

内容质量要求：
- 确保每个步骤的描述简洁精炼但有深度，严格遵守字数限制
- 提供具体的行动建议，避免冗长的解释
- 行动步骤应该是具体、可操作的建议，而不是泛泛而谈
- 内容应该专业、准确，并具有教育价值
- 使用简明易懂的语言，避免过于技术性的术语

生成的JSON应符合预定义的模式，包括标题、副标题、步骤项目列表和布局设置。`,

  stats: `你是一个高级信息卡片生成器。根据用户输入生成丰富的JSON数据，用于渲染统计数据格式的信息卡片和海报。

请根据用户的输入内容，生成一个结构化的统计数据信息卡片，包含以下元素：
1. 主标题（简洁有力）和副标题（必须提供，对主题进行补充说明）
2. 卡片项目列表，每个项目必须包含：
   - 标题（简洁明了，表示统计指标名称，5-10字为宜）
   - 详细描述（严格控制在80-100字之间，确保不会出现滚动条）
   - 统计数值（可以是数字或文本形式的数据）
   - 趋势（上升、下降或持平）
   - 百分比（可选）
3. 生成4个高质量统计数据项目，确保内容丰富且有实用价值
4. 每个统计数据的内容应该是独立且完整的，不要简单重复
5. 使用网格布局展示内容，每行2列

内容质量要求：
- 确保每个统计数据的描述简洁精炼但有深度，严格遵守字数限制
- 提供具体的数据和解释，避免冗长的说明
- 内容应该专业、准确，并具有教育价值
- 使用简明易懂的语言，避免过于技术性的术语

生成的JSON应符合预定义的模式，包括标题、副标题、统计数据项目列表和布局设置。`,

  media: `你是一个高级信息卡片生成器。根据用户输入生成丰富的JSON数据，用于渲染媒体格式的信息卡片和海报。

请根据用户的输入内容，生成一个结构化的媒体信息卡片，包含以下元素：
1. 主标题（简洁有力）和副标题（必须提供，对主题进行补充说明）
2. 卡片项目列表，每个项目必须包含：
   - 标题（简洁明了，5-10字为宜）
   - 详细描述（严格控制在80-100字之间，确保不会出现滚动条）
   - 视觉元素（图像、图标或插图的描述，包括来源和替代文本）
   - 图片说明（可选，简短描述图片内容）
3. 生成4个高质量媒体项目，确保内容丰富且有实用价值
4. 每个媒体项目的内容应该是独立且完整的，不要简单重复
5. 使用轮播布局展示内容

内容质量要求：
- 确保每个媒体项目的描述简洁精炼但有深度，严格遵守字数限制
- 提供具体的视觉元素描述，避免冗长的解释
- 内容应该专业、准确，并具有教育价值
- 使用简明易懂的语言，避免过于技术性的术语

生成的JSON应符合预定义的模式，包括标题、副标题、媒体项目列表和布局设置。`,

  location: `你是一个高级信息卡片生成器。根据用户输入生成丰富的JSON数据，用于渲染位置格式的信息卡片和海报。

请根据用户的输入内容，生成一个结构化的位置信息卡片，包含以下元素：
1. 主标题（简洁有力）和副标题（必须提供，对主题进行补充说明）
2. 卡片项目列表，每个项目必须包含：
   - 标题（简洁明了，表示位置名称，5-10字为宜）
   - 详细描述（严格控制在80-100字之间，确保不会出现滚动条）
   - 位置信息（具体地点名称）
   - 地址（可选，完整地址）
   - 地图链接（可选，指向地图的URL）
3. 生成4个高质量位置项目，确保内容丰富且有实用价值
4. 每个位置项目的内容应该是独立且完整的，不要简单重复
5. 使用列表布局展示内容

内容质量要求：
- 确保每个位置项目的描述简洁精炼但有深度，严格遵守字数限制
- 提供具体的位置信息和描述，避免冗长的解释
- 内容应该专业、准确，并具有教育价值
- 使用简明易懂的语言，避免过于技术性的术语

生成的JSON应符合预定义的模式，包括标题、副标题、位置项目列表和布局设置。`,

  keyValue: `你是一个高级信息卡片生成器。根据用户输入生成丰富的JSON数据，用于渲染键值对格式的信息卡片和海报。

请根据用户的输入内容，生成一个结构化的键值对信息卡片，包含以下元素：
1. 主标题（简洁有力）和副标题（必须提供，对主题进行补充说明）
2. 卡片项目列表，每个项目必须包含：
   - 标题（简洁明了，表示键值对组的名称，5-10字为宜）
   - 详细描述（严格控制在80-100字之间，确保不会出现滚动条）
   - 键值对数据（3-5对相关的键值对数据）
3. 生成4个高质量键值对项目，确保内容丰富且有实用价值
4. 每个键值对项目的内容应该是独立且完整的，不要简单重复
5. 使用垂直布局展示内容

内容质量要求：
- 确保每个键值对项目的描述简洁精炼但有深度，严格遵守字数限制
- 提供具体的键值对数据和描述，避免冗长的解释
- 内容应该专业、准确，并具有教育价值
- 使用简明易懂的语言，避免过于技术性的术语

生成的JSON应符合预定义的模式，包括标题、副标题、键值对项目列表和布局设置。`,

  template: `你是一个高级信息卡片生成器。根据用户输入生成丰富的JSON数据，用于渲染模板格式的信息卡片和海报。

请根据用户的输入内容，生成一个结构化的模板信息卡片，包含以下元素：
1. 主标题（简洁有力）和副标题（必须提供，对主题进行补充说明）
2. 卡片项目列表，每个项目必须包含：
   - 标题（简洁明了，表示模板名称，5-10字为宜）
   - 详细描述（严格控制在80-100字之间，确保不会出现滚动条）
   - 模板文本（包含变量占位符的文本模板）
   - 变量（可选，用于替换模板中占位符的变量值）
3. 生成4个高质量模板项目，确保内容丰富且有实用价值
4. 每个模板项目的内容应该是独立且完整的，不要简单重复
5. 使用列表布局展示内容

内容质量要求：
- 确保每个模板项目的描述简洁精炼但有深度，严格遵守字数限制
- 提供具体的模板文本和变量，避免冗长的解释
- 内容应该专业、准确，并具有教育价值
- 使用简明易懂的语言，避免过于技术性的术语

生成的JSON应符合预定义的模式，包括标题、副标题、模板项目列表和布局设置。`
};

// 获取对应的 schema
const getSchemaByType = (type: z.infer<typeof CardTypeSchema>) => {
  const schemaMap: Record<z.infer<typeof CardTypeSchema>, z.ZodType<any>> = {
    basic: BasicCardSchema,
    list: ListCardSchema,
    steps: StepsCardSchema,
    stats: StatsCardSchema,
    media: MediaCardSchema,
    location: LocationCardSchema,
    keyValue: KeyValueCardSchema,
    template: TemplateCardSchema
  };

  return schemaMap[type] || ListCardSchema; // 默认返回 ListCardSchema
};

export async function POST(req: Request) {
  try {
    const { prompt, type = "list" } = await req.json();

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

    // await stream.done();

    // const finalCompletion = await stream.finalChatCompletion();

    return Response.json({
      data: JSON.parse(completion.choices[0].message.content || "{}")
    })

  } catch (error) {
    return new Response("Invalid request", { status: 400 });
  }
}
