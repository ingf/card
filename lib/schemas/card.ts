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

// 定义基础样式
export const BaseStyleSchema = z.object({
  backgroundColor: z.string().optional(),
  borderColor: z.string().optional(),
  textColor: z.string().optional(),
  padding: z.string().optional(),
  borderRadius: z.string().optional(),
  shadow: z.enum(["none", "sm", "md", "lg"]).optional(),
})

// 定义链接
export const LinkSchema = z.object({
  url: z.string(),
  text: z.string().optional(),
  isExternal: z.boolean().optional().default(false)
})

// 定义基础卡片项属性（所有类型共享的属性）
export const BaseCardItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  icon: IconSchema.optional(),
  highlight: z.boolean().optional().default(false),
  style: BaseStyleSchema.optional(),
  tags: z.array(z.string()).optional(),
  link: LinkSchema.optional(),
})

// 定义卡片项类型枚举
export const CardItemTypeSchema = z.enum([
  "basic",       // 基础卡片项
  "step",        // 步骤卡片项
  "list",        // 列表卡片项
  "stat",        // 统计数据卡片项
  "media",       // 媒体卡片项
  "location",    // 位置卡片项
  "keyValue",    // 键值对卡片项
  "template",    // 模板文本卡片项
])

// 基础卡片项
export const BasicCardItemSchema = BaseCardItemSchema.extend({
  type: z.literal("basic"),
})

// 步骤卡片项
export const StepCardItemSchema = BaseCardItemSchema.extend({
  type: z.literal("step"),
  actionStep: z.string(),
  stepNumber: z.number().optional(),
  isCompleted: z.boolean().optional().default(false),
})

// 列表卡片项
export const ListCardItemSchema = BaseCardItemSchema.extend({
  type: z.literal("list"),
  bulletPoints: z.array(z.string()),
  bulletStyle: z.enum(["disc", "circle", "square", "numbered", "alpha", "roman"]).optional().default("disc"),
})

// 统计数据卡片项
export const StatCardItemSchema = BaseCardItemSchema.extend({
  type: z.literal("stat"),
  value: z.union([z.number(), z.string()]),
  percentage: z.number().optional(),
  trend: z.enum(["up", "down", "neutral"]).optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
})

// 媒体卡片项
export const MediaCardItemSchema = BaseCardItemSchema.extend({
  type: z.literal("media"),
  visualElement: VisualElementSchema,
  caption: z.string().optional(),
})

// 位置卡片项
export const LocationCardItemSchema = BaseCardItemSchema.extend({
  type: z.literal("location"),
  location: z.string(),
  address: z.string().optional(),
  mapUrl: z.string().optional(),
})

// 键值对卡片项
export const KeyValueCardItemSchema = BaseCardItemSchema.extend({
  type: z.literal("keyValue"),
  keyValue: z.record(z.string()),
  layout: z.enum(["horizontal", "vertical"]).optional().default("vertical"),
})

// 模板文本卡片项
export const TemplateCardItemSchema = BaseCardItemSchema.extend({
  type: z.literal("template"),
  templateText: z.string(),
  variables: z.record(z.string()).optional(),
})

// 合并所有卡片项类型
export const CardItemSchema = z.discriminatedUnion("type", [
  BasicCardItemSchema,
  StepCardItemSchema,
  ListCardItemSchema,
  StatCardItemSchema,
  MediaCardItemSchema,
  LocationCardItemSchema,
  KeyValueCardItemSchema,
  TemplateCardItemSchema,
])

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

// 定义卡片类型枚举
export const CardTypeSchema = z.enum([
  "basic",    // 基础卡片
  "list",     // 列表卡片
  "steps",    // 步骤卡片
  "stats",    // 统计卡片
  "media",    // 媒体卡片
  "location", // 位置卡片
  "keyValue", // 键值对卡片
  "template", // 模板卡片
])

// 定义基础卡片属性（所有卡片类型共享的属性）
export const BaseCardSchema = z.object({
  title: z.string(), // 主标题
  subtitle: z.string().optional(), // 副标题
  description: z.string().optional(), // 卡片整体描述
  // theme: ThemeSchema,
  footer: z.object({
    text: z.string().optional(),
    showAttribution: z.boolean().optional().default(false),
    links: z.array(z.object({
      text: z.string(),
      url: z.string(),
      icon: z.string().optional(),
    })).optional(),
  }).optional(),
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

// 基础卡片
export const BasicCardSchema = BaseCardSchema.extend({
  type: z.literal("basic"),
  layout: LayoutSchema.optional(),
  items: z.array(BasicCardItemSchema),
})

// 列表卡片
export const ListCardSchema = BaseCardSchema.extend({
  type: z.literal("list"),
  layout: LayoutSchema.extend({
    type: z.literal("list"),
  }).optional(),
  items: z.array(ListCardItemSchema),
})

// 步骤卡片
export const StepsCardSchema = BaseCardSchema.extend({
  type: z.literal("steps"),
  layout: LayoutSchema.extend({
    type: z.enum(["list", "timeline"]),
    showNumbers: z.literal(true).default(true),
  }).optional(),
  items: z.array(StepCardItemSchema),
  isSequential: z.boolean().optional().default(true),
})

// 统计卡片
export const StatsCardSchema = BaseCardSchema.extend({
  type: z.literal("stats"),
  layout: LayoutSchema.extend({
    type: z.enum(["grid", "list"]),
    columns: z.number().optional().default(2),
  }).optional(),
  items: z.array(StatCardItemSchema),
  showComparison: z.boolean().optional().default(false),
})

// 媒体卡片
export const MediaCardSchema = BaseCardSchema.extend({
  type: z.literal("media"),
  layout: LayoutSchema.extend({
    type: z.enum(["grid", "carousel"]),
  }).optional(),
  items: z.array(MediaCardItemSchema),
  aspectRatio: z.string().optional(),
})

// 位置卡片
export const LocationCardSchema = BaseCardSchema.extend({
  type: z.literal("location"),
  layout: LayoutSchema.optional(),
  items: z.array(LocationCardItemSchema),
  showMap: z.boolean().optional().default(true),
})

// 键值对卡片
export const KeyValueCardSchema = BaseCardSchema.extend({
  type: z.literal("keyValue"),
  layout: LayoutSchema.optional(),
  items: z.array(KeyValueCardItemSchema),
})

// 模板卡片
export const TemplateCardSchema = BaseCardSchema.extend({
  type: z.literal("template"),
  layout: LayoutSchema.optional(),
  items: z.array(TemplateCardItemSchema),
  globalVariables: z.record(z.string()).optional(),
})

// 合并所有卡片类型
export const CardSchema = z.discriminatedUnion("type", [
  BasicCardSchema,
  ListCardSchema,
  StepsCardSchema,
  StatsCardSchema,
  MediaCardSchema,
  LocationCardSchema,
  KeyValueCardSchema,
  TemplateCardSchema,
])

export type Icon = z.infer<typeof IconSchema>
export type VisualElement = z.infer<typeof VisualElementSchema>
export type BaseStyle = z.infer<typeof BaseStyleSchema>
export type Link = z.infer<typeof LinkSchema>
export type BaseCardItem = z.infer<typeof BaseCardItemSchema>
export type CardItemType = z.infer<typeof CardItemTypeSchema>
export type BasicCardItem = z.infer<typeof BasicCardItemSchema>
export type StepCardItem = z.infer<typeof StepCardItemSchema>
export type ListCardItem = z.infer<typeof ListCardItemSchema>
export type StatCardItem = z.infer<typeof StatCardItemSchema>
export type MediaCardItem = z.infer<typeof MediaCardItemSchema>
export type LocationCardItem = z.infer<typeof LocationCardItemSchema>
export type KeyValueCardItem = z.infer<typeof KeyValueCardItemSchema>
export type TemplateCardItem = z.infer<typeof TemplateCardItemSchema>
export type CardItem = z.infer<typeof CardItemSchema>
export type Layout = z.infer<typeof LayoutSchema>
export type Theme = z.infer<typeof ThemeSchema>
export type CardType = z.infer<typeof CardTypeSchema>
export type BaseCard = z.infer<typeof BaseCardSchema>
export type BasicCard = z.infer<typeof BasicCardSchema>
export type ListCard = z.infer<typeof ListCardSchema>
export type StepsCard = z.infer<typeof StepsCardSchema>
export type StatsCard = z.infer<typeof StatsCardSchema>
export type MediaCard = z.infer<typeof MediaCardSchema>
export type LocationCard = z.infer<typeof LocationCardSchema>
export type KeyValueCard = z.infer<typeof KeyValueCardSchema>
export type TemplateCard = z.infer<typeof TemplateCardSchema>
export type Card = z.infer<typeof CardSchema>