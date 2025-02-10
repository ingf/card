import { z } from "zod"

// 定义图标类型
export const IconSchema = z.object({
  type: z.enum(["emoji", "lucide", "custom"]),
  value: z.string(),
  style: z.object({
    size: z.number().optional().default(24),
    color: z.string().optional(),
    backgroundColor: z.string().optional()
  }).optional()
})

// 定义单个条目的内容
export const CardItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(), // 主要描述文本
  actionStep: z.string(), // 行动步骤，这个图里每个项目都有
  icon: IconSchema.optional(),
  visualElement: z.object({
    type: z.enum(["icon", "illustration"]),
    source: z.string(),
    alt: z.string().optional()
  }).optional()
})

// 定义整个卡片的数据结构
export const CardSchema = z.object({
  title: z.string(), // 主标题，如 "9 WAYS TO BUILD SELF-DISCIPLINE"
  layout: z.object({
    type: z.enum(["grid", "list"]).default("grid"),
    columns: z.number().min(1).max(4).default(2),
    spacing: z.number().optional(),
    itemStyle: z.object({
      borderRadius: z.number().optional(),
      padding: z.number().optional(),
      shadow: z.enum(["none", "sm", "md", "lg"]).optional(),
      numberStyle: z.object({
        show: z.boolean().default(true),
        color: z.string().optional(),
        size: z.number().optional()
      }).optional()
    }).optional()
  }).optional(),
  theme: z.object({
    primaryColor: z.string().default("#FF9966"), // 用于数字标记的颜色
    backgroundColor: z.string().default("#FFFFFF"),
    textColor: z.string().default("#000000"),
    accentColor: z.string().optional() // 用于强调色
  }).optional(),
  items: z.array(CardItemSchema)
})

export type Icon = z.infer<typeof IconSchema>
export type CardItem = z.infer<typeof CardItemSchema>
export type Card = z.infer<typeof CardSchema> 