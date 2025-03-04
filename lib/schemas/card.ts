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

// 定义视觉元素类型
export const VisualElementSchema = z.object({
  type: z.enum(["icon", "illustration", "image", "chart"]),
  source: z.string(),
  alt: z.string().optional(),
  position: z.enum(["top", "left", "right", "bottom", "background"]).optional().default("left"),
  style: z.object({
    width: z.string().optional(),
    height: z.string().optional(),
    borderRadius: z.string().optional(),
    opacity: z.number().optional(),
  }).optional()
})

// 定义单个条目的内容
export const CardItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(), // 主要描述文本
  actionStep: z.string().optional(), // 行动步骤，可选
  icon: IconSchema.optional(),
  visualElement: VisualElementSchema.optional(),
  highlight: z.boolean().optional().default(false), // 是否高亮显示
  style: z.object({
    backgroundColor: z.string().optional(),
    borderColor: z.string().optional(),
    textColor: z.string().optional(),
    padding: z.string().optional(),
    borderRadius: z.string().optional(),
    shadow: z.enum(["none", "sm", "md", "lg"]).optional(),
  }).optional(),
  tags: z.array(z.string()).optional(), // 标签列表
  link: z.object({
    url: z.string(),
    text: z.string().optional(),
    isExternal: z.boolean().optional().default(false)
  }).optional() // 可选链接
})

// 定义布局类型
export const LayoutSchema = z.object({
  type: z.enum([
    "grid",
    "list",
    "masonry",
    "carousel",
    "timeline",
    "tabs",
    "accordion",
    "education",
    "finance"
  ]).default("grid"),
  columns: z.number().optional().default(2),
  alignment: z.enum(["start", "center", "end"]).optional().default("start"),
  spacing: z.enum(["none", "small", "medium", "large"]).optional().default("medium"),
  itemStyle: z.enum(["card", "minimal", "bordered"]).optional().default("card"),
  templateStyle: z.object({
    headerBgColor: z.string().optional(),
    bodyBgColor: z.string().optional(),
    borderColor: z.string().optional(),
    headerFont: z.string().optional(),
    bodyFont: z.string().optional(),
    numberBgColor: z.string().optional(),
    dividerStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
    dotColor: z.string().optional()
  }).optional()
})

// 定义主题类型
export const ThemeSchema = z.object({
  primaryColor: z.string().default("#FF9966"), // 用于数字标记的颜色
  backgroundColor: z.string().default("#FFFFFF"),
  textColor: z.string().default("#000000"),
  accentColor: z.string().optional(), // 用于强调色
  fontFamily: z.string().optional(),
  borderRadius: z.string().optional().default("0.5rem"),
  cardStyle: z.enum(["flat", "outlined", "elevated", "glass"]).optional().default("elevated"),
  colorScheme: z.enum(["light", "dark", "auto"]).optional().default("light"),
  animation: z.enum(["none", "fade", "slide", "zoom"]).optional().default("none")
})

// 定义整个卡片的数据结构
export const CardSchema = z.object({
  title: z.string(), // 主标题
  subtitle: z.string().optional(), // 副标题
  description: z.string().optional(), // 卡片整体描述
  layout: LayoutSchema.optional(),
  theme: ThemeSchema.optional(),
  items: z.array(CardItemSchema),
  footer: z.object({
    text: z.string().optional(),
    showAttribution: z.boolean().optional().default(false)
  }).optional()
})

export type Icon = z.infer<typeof IconSchema>
export type VisualElement = z.infer<typeof VisualElementSchema>
export type CardItem = z.infer<typeof CardItemSchema>
export type Layout = z.infer<typeof LayoutSchema>
export type Theme = z.infer<typeof ThemeSchema>
export type Card = z.infer<typeof CardSchema>