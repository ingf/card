// 卡片汇总

import { z } from "zod"
import { CarouselSchema } from "./carousel"
import { QuoteSchema } from "./quote"


export const CardTypeSchema = z.enum([
  "basic",
  "list",
  "html"
])

export type CardType = z.infer<typeof CardTypeSchema>
export type CardSchema = z.infer<typeof CarouselSchema> | z.infer<typeof QuoteSchema>

export * from './carousel'
export * from './quote'