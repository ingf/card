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
  }).optional(), // 可选链接
  // 新增字段，支持更多类型的内容
  bulletPoints: z.array(z.string()).optional(), // 支持列表项
  percentage: z.number().optional(), // 支持百分比显示
  imageUrl: z.string().optional(), // 支持图片URL
  date: z.string().optional(), // 支持日期显示
  location: z.string().optional(), // 支持位置信息
  keyValue: z.record(z.string()).optional(), // 支持键值对显示
  templateText: z.string().optional(), // 支持模板文本（如面试话术）
})

// 定义布局类型
export const LayoutSchema = z.object({
  type: z.enum(["grid", "list", "carousel", "tabs", "accordion", "timeline", "comparison"]),
  columns: z.number().optional(),
  alignment: z.enum(["left", "center", "right"]).optional(),
  spacing: z.enum(["small", "medium", "large"]).optional(),
  itemStyle: z.enum(["card", "bordered", "minimal", "numbered", "icon", "image"]).optional(),
  showDividers: z.boolean().optional().default(false),
  showNumbers: z.boolean().optional().default(false),
  showIcons: z.boolean().optional().default(false),
  animation: z.enum(["none", "fade", "slide", "zoom"]).optional().default("none"),
  maxHeight: z.string().optional(), // 支持最大高度设置
  aspectRatio: z.string().optional(), // 支持宽高比设置
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
  animation: z.enum(["none", "fade", "slide", "zoom"]).optional().default("none"),
  // 新增主题属性
  headerStyle: z.object({
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    borderBottom: z.boolean().optional(),
    padding: z.string().optional(),
  }).optional(),
  footerStyle: z.object({
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    borderTop: z.boolean().optional(),
    padding: z.string().optional(),
  }).optional(),
  itemStyle: z.object({
    backgroundColor: z.string().optional(),
    borderColor: z.string().optional(),
    borderWidth: z.string().optional(),
    shadow: z.enum(["none", "sm", "md", "lg"]).optional(),
    margin: z.string().optional(),
  }).optional(),
  highlightStyle: z.object({
    backgroundColor: z.string().optional(),
    borderColor: z.string().optional(),
    textColor: z.string().optional(),
  }).optional(),
})

// 定义卡片类型
export const CardTypeSchema = z.enum([
  "list", // 列表卡片
  "steps", // 步骤卡片
])

// 定义整个卡片的数据结构
export const CardSchema = z.object({
  title: z.string(), // 主标题
  subtitle: z.string().optional(), // 副标题
  description: z.string().optional(), // 卡片整体描述
  layout: LayoutSchema.optional(),
  theme: ThemeSchema,
  items: z.array(CardItemSchema),
  footer: z.object({
    text: z.string().optional(),
    showAttribution: z.boolean().optional().default(false),
    links: z.array(z.object({
      text: z.string(),
      url: z.string(),
      icon: z.string().optional(),
    })).optional(),
  }).optional(),
  // 新增字段
  type: CardTypeSchema.optional(), // 卡片类型
  header: z.object({
    icon: IconSchema.optional(),
    visualElement: VisualElementSchema.optional(),
    actions: z.array(z.object({
      text: z.string(),
      icon: z.string().optional(),
      action: z.string(),
    })).optional(),
  }).optional(),
  metadata: z.object({
    author: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    source: z.string().optional(),
  }).optional(),
  interactivity: z.object({
    isExpandable: z.boolean().optional().default(false),
    isSwipeable: z.boolean().optional().default(false),
    hasSearch: z.boolean().optional().default(false),
    hasFilters: z.boolean().optional().default(false),
    hasSorting: z.boolean().optional().default(false),
  }).optional(),
})

export type Icon = z.infer<typeof IconSchema>
export type VisualElement = z.infer<typeof VisualElementSchema>
export type CardItem = z.infer<typeof CardItemSchema>
export type Layout = z.infer<typeof LayoutSchema>
export type Theme = z.infer<typeof ThemeSchema>
export type CardType = z.infer<typeof CardTypeSchema>
export type Card = z.infer<typeof CardSchema>