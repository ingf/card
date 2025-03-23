// 轮播图卡片

import { z } from "zod"
import { BaseStyleSchema, IconSchema, LinkSchema, VisualElementSchema } from "./base"



// 定义基础卡片项属性（所有类型共享的属性）
export const BaseCarouselItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  icon: IconSchema.optional(),
  highlight: z.boolean().optional(),
  style: BaseStyleSchema.optional(),
  tags: z.array(z.string()).optional(),
  link: LinkSchema.optional(),
})

// 定义卡片项类型枚举
export const CarouselItemTypeSchema = z.enum([
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
export const BasicCarouselItemSchema = BaseCarouselItemSchema.extend({
  type: z.literal("basic"),
})

// 步骤卡片项
export const StepCarouselItemSchema = BaseCarouselItemSchema.extend({
  type: z.literal("step"),
  actionStep: z.string(),
  stepNumber: z.number().optional(),
  isCompleted: z.boolean().optional(),
})

// 列表卡片项
export const ListCarouselItemSchema = BaseCarouselItemSchema.extend({
  type: z.literal("list"),
  bulletPoints: z.array(z.string()),
  bulletStyle: z.enum(["disc", "circle", "square", "numbered", "alpha", "roman"]).optional(),
})

// 统计数据卡片项
export const StatCarouselItemSchema = BaseCarouselItemSchema.extend({
  type: z.literal("stat"),
  value: z.union([z.number(), z.string()]),
  percentage: z.number().optional(),
  trend: z.enum(["up", "down", "neutral"]).optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
})

// 媒体卡片项
export const MediaCarouselItemSchema = BaseCarouselItemSchema.extend({
  type: z.literal("media"),
  visualElement: VisualElementSchema,
  caption: z.string().optional(),
})

// 位置卡片项
export const LocationCarouselItemSchema = BaseCarouselItemSchema.extend({
  type: z.literal("location"),
  location: z.string(),
  address: z.string().optional(),
  mapUrl: z.string().optional(),
})

// 键值对卡片项
export const KeyValueCarouselItemSchema = BaseCarouselItemSchema.extend({
  type: z.literal("keyValue"),
  keyValue: z.record(z.string()),
  layout: z.enum(["horizontal", "vertical"]).optional(),
})

// 模板文本卡片项
export const TemplateCarouselItemSchema = BaseCarouselItemSchema.extend({
  type: z.literal("template"),
  templateText: z.string(),
  variables: z.record(z.string()).optional(),
})

// 合并所有卡片项类型
export const CarouselItemSchema = z.discriminatedUnion("type", [
  BasicCarouselItemSchema,
  StepCarouselItemSchema,
  ListCarouselItemSchema,
  StatCarouselItemSchema,
  MediaCarouselItemSchema,
  LocationCarouselItemSchema,
  KeyValueCarouselItemSchema,
  TemplateCarouselItemSchema,
])

// 定义布局类型
export const LayoutSchema = z.object({
  type: z.enum(["grid", "list", "carousel", "tabs", "accordion", "timeline", "comparison"]),
  columns: z.number().optional(),
  alignment: z.enum(["left", "center", "right"]).optional(),
  spacing: z.enum(["small", "medium", "large"]).optional(),
  itemStyle: z.enum(["card", "bordered", "minimal", "numbered", "icon", "image"]).optional(),
  showDividers: z.boolean().optional(),
  showNumbers: z.boolean().optional(),
  showIcons: z.boolean().optional(),
  animation: z.enum(["none", "fade", "slide", "zoom"]).optional(),
  maxHeight: z.string().optional(), // 支持最大高度设置
  aspectRatio: z.string().optional(), // 支持宽高比设置
})

// 定义主题类型
export const ThemeSchema = z.object({
  primaryColor: z.string(), // 用于数字标记的颜色
  backgroundColor: z.string(),
  textColor: z.string(),
  accentColor: z.string().optional(), // 用于强调色
  fontFamily: z.string().optional(),
  borderRadius: z.string().optional(),
  cardStyle: z.enum(["flat", "outlined", "elevated", "glass"]).optional(),
  colorScheme: z.enum(["light", "dark", "auto"]).optional(),
  animation: z.enum(["none", "fade", "slide", "zoom"]).optional(),
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
export const CarouselTypeSchema = z.enum([
  "basic",    // 基础卡片
  "list",     // 列表卡片
  "steps",    // 步骤卡片
  "stats",    // 统计卡片
  "media",    // 媒体卡片
  "location", // 位置卡片
  "keyValue", // 键值对卡片
  "template", // 模板卡片
  "html",     // html卡片
])

// 定义基础卡片属性（所有卡片类型共享的属性）
export const BaseCarouselSchema = z.object({
  title: z.string(), // 主标题
  subtitle: z.string().optional(), // 副标题
  description: z.string().optional(), // 卡片整体描述
  // theme: ThemeSchema,
  footer: z.object({
    text: z.string().optional(),
    showAttribution: z.boolean().optional(),
    links: z.array(z.object({
      text: z.string(),
      url: z.string(),
      icon: z.string().optional(),
    })).optional(),
  }).optional(),
})

// 基础卡片
export const BasicCarouselSchema = BaseCarouselSchema.extend({
  type: z.literal("basic"),
  layout: LayoutSchema.optional(),
  items: z.array(BasicCarouselItemSchema),
})

// 列表卡片
export const ListCarouselSchema = BaseCarouselSchema.extend({
  type: z.literal("list"),
  layout: LayoutSchema.extend({
    type: z.literal("list"),
  }).optional(),
  items: z.array(ListCarouselItemSchema),
})

// 步骤卡片
export const StepsCarouselSchema = BaseCarouselSchema.extend({
  type: z.literal("steps"),
  layout: LayoutSchema.extend({
    type: z.enum(["list", "timeline"]),
    showNumbers: z.literal(true),
  }).optional(),
  items: z.array(StepCarouselItemSchema),
  isSequential: z.boolean().optional(),
})

// 统计卡片
export const StatsCarouselSchema = BaseCarouselSchema.extend({
  type: z.literal("stats"),
  layout: LayoutSchema.extend({
    type: z.enum(["grid", "list"]),
    columns: z.number().optional(),
  }).optional(),
  items: z.array(StatCarouselItemSchema),
  showComparison: z.boolean().optional(),
})

// 媒体卡片
export const MediaCarouselSchema = BaseCarouselSchema.extend({
  type: z.literal("media"),
  layout: LayoutSchema.extend({
    type: z.enum(["grid", "carousel"]),
  }).optional(),
  items: z.array(MediaCarouselItemSchema),
  aspectRatio: z.string().optional(),
})

// 位置卡片
export const LocationCarouselSchema = BaseCarouselSchema.extend({
  type: z.literal("location"),
  layout: LayoutSchema.optional(),
  items: z.array(LocationCarouselItemSchema),
  showMap: z.boolean().optional(),
})

// 键值对卡片
export const KeyValueCarouselSchema = BaseCarouselSchema.extend({
  type: z.literal("keyValue"),
  layout: LayoutSchema.optional(),
  items: z.array(KeyValueCarouselItemSchema),
})

// 模板卡片
export const TemplateCarouselSchema = BaseCarouselSchema.extend({
  type: z.literal("template"),
  layout: LayoutSchema.optional(),
  items: z.array(TemplateCarouselItemSchema),
  globalVariables: z.record(z.string()).optional(),
})

// 合并所有卡片类型
export const CarouselSchema = z.discriminatedUnion("type", [
  BasicCarouselSchema,
  ListCarouselSchema,
  StepsCarouselSchema,
  StatsCarouselSchema,
  MediaCarouselSchema,
  LocationCarouselSchema,
  KeyValueCarouselSchema,
  TemplateCarouselSchema,
])

export type BaseCarouselItem = z.infer<typeof BaseCarouselItemSchema>
export type CarouselItemType = z.infer<typeof CarouselItemTypeSchema>
export type BasicCarouselItem = z.infer<typeof BasicCarouselItemSchema>
export type StepCarouselItem = z.infer<typeof StepCarouselItemSchema>
export type ListCarouselItem = z.infer<typeof ListCarouselItemSchema>
export type StatCarouselItem = z.infer<typeof StatCarouselItemSchema>
export type MediaCarouselItem = z.infer<typeof MediaCarouselItemSchema>
export type LocationCarouselItem = z.infer<typeof LocationCarouselItemSchema>
export type KeyValueCarouselItem = z.infer<typeof KeyValueCarouselItemSchema>
export type TemplateCarouselItem = z.infer<typeof TemplateCarouselItemSchema>
export type CarouselItem = z.infer<typeof CarouselItemSchema>
export type Layout = z.infer<typeof LayoutSchema>
export type Theme = z.infer<typeof ThemeSchema>
export type CarouselType = z.infer<typeof CarouselTypeSchema>
export type BaseCarousel = z.infer<typeof BaseCarouselSchema>
export type BasicCarousel = z.infer<typeof BasicCarouselSchema>
export type ListCarousel = z.infer<typeof ListCarouselSchema>
export type StepsCarousel = z.infer<typeof StepsCarouselSchema>
export type StatsCarousel = z.infer<typeof StatsCarouselSchema>
export type MediaCarousel = z.infer<typeof MediaCarouselSchema>
export type LocationCarousel = z.infer<typeof LocationCarouselSchema>
export type KeyValueCarousel = z.infer<typeof KeyValueCarouselSchema>
export type TemplateCarousel = z.infer<typeof TemplateCarouselSchema>
export type Carousel = z.infer<typeof CarouselSchema>