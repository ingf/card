// 引用卡片

import { z } from "zod"
import { BaseStyleSchema, IconSchema, LinkSchema, VisualElementSchema } from "./base"

// 定义引用来源类型
export const QuoteSourceSchema = z.object({
  author: z.string(),
  title: z.string().optional(),
  publication: z.string().optional(),
  date: z.string().optional(),
  url: z.string().optional(),
  icon: IconSchema.optional(),
})

// 定义引用布局类型
export const QuoteLayoutSchema = z.object({
  type: z.enum(["block", "inline"]),
  alignment: z.enum(["left", "center", "right"]).optional(),
  indentation: z.number().optional(),
  showQuoteMarks: z.boolean().optional(),
  style: z.enum(["modern", "classic", "minimal"]).optional(),
  maxWidth: z.string().optional(),
  backgroundColor: z.string().optional(),
  borderStyle: z.enum(["none", "left", "all"]).optional(),
})

// 定义基础引用属性
export const BaseQuoteSchema = z.object({
  id: z.string(),
  content: z.string(),
  source: QuoteSourceSchema,
  style: BaseStyleSchema.optional(),
  tags: z.array(z.string()).optional(),
  link: LinkSchema.optional(),
  visualElement: VisualElementSchema.optional(),
})

// 块状引用卡片
export const BlockQuoteSchema = BaseQuoteSchema.extend({
  type: z.literal("block"),
  layout: QuoteLayoutSchema.extend({
    type: z.literal("block"),
  }),
  subtitle: z.string().optional(),
  footnote: z.string().optional(),
  highlightedText: z.array(z.string()).optional(),
})

// 行内引用卡片
export const InlineQuoteSchema = BaseQuoteSchema.extend({
  type: z.literal("inline"),
  layout: QuoteLayoutSchema.extend({
    type: z.literal("inline"),
  }),
  inlineContext: z.string().optional(),
  popoverContent: z.string().optional(),
})

// 合并所有引用卡片类型
export const QuoteSchema = z.discriminatedUnion("type", [
  BlockQuoteSchema,
  InlineQuoteSchema,
])

// 导出类型定义
export type QuoteSource = z.infer<typeof QuoteSourceSchema>
export type QuoteLayout = z.infer<typeof QuoteLayoutSchema>
export type BaseQuote = z.infer<typeof BaseQuoteSchema>
export type BlockQuote = z.infer<typeof BlockQuoteSchema>
export type InlineQuote = z.infer<typeof InlineQuoteSchema>
export type Quote = z.infer<typeof QuoteSchema>


