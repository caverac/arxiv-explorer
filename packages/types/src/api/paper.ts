import { z } from 'zod'

export const SummarizePaperRequestSchema = z.object({
  code: z.string(),
  title: z.string(),
  href: z.string(),
})

export const SummarizePaperResponseSchema = z.object({
  summary: z.string(),
  follow_up_projects: z.array(z.string()),
  references: z.array(z.string()),
})

export const PaperSchema = z.object({
  id: z.number().int(),
  code: z.string(),
  title: z.string(),
  href: z.string(),
  summary: z.string(),
  embedding: z.array(z.number()),
})

export const CreatePaperRequestSchema = z.object({
  title: z.string(),
  summary: z.string(),
  embedding: z.array(z.number()),
  code: z.string(),
  href: z.string(),
})

export type SummarizePaperRequest = z.infer<typeof SummarizePaperRequestSchema>
export type SummarizePaperResponse = z.infer<
  typeof SummarizePaperResponseSchema
>
export type Paper = z.infer<typeof PaperSchema>
export type CreatePaperRequest = z.infer<typeof CreatePaperRequestSchema>
