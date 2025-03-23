import { z } from "zod"

// 定义图标类型
export const IconSchema = z.object({
  type: z.enum(["emoji", "lucide", "custom"]),
  value: z.string(),
  style: z.object({
    size: z.number().optional(),
    color: z.string().optional(),
    backgroundColor: z.string().optional()
  }).optional()
})

// 定义视觉元素类型
export const VisualElementSchema = z.object({
  type: z.enum(["icon", "illustration", "image", "chart"]),
  source: z.string(),
  alt: z.string().optional(),
  position: z.enum(["top", "left", "right", "bottom", "background"]).optional(),
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
  isExternal: z.boolean().optional()
})

// 导出类型
export type Icon = z.infer<typeof IconSchema>
export type VisualElement = z.infer<typeof VisualElementSchema>
export type BaseStyle = z.infer<typeof BaseStyleSchema>
export type Link = z.infer<typeof LinkSchema> 