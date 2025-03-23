import { z } from "zod"
import { CarouselSchema } from "./carousel"


export const CardTypeSchema = z.enum([
  "basic",
  "list",
  "html"
])

export type CardType = z.infer<typeof CardTypeSchema>
export type Card = z.infer<typeof CarouselSchema>


export * from './carousel'