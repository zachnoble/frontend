import { z } from 'zod'

export const toastSchema = z.object({
	message: z.string(),
	type: z.custom<'success' | 'error'>(),
})

export type Toast = z.infer<typeof toastSchema>

export const flashSessionValuesSchema = z.object({
	toast: toastSchema.optional(),
})

export type FlashSessionValues = z.infer<typeof flashSessionValuesSchema>

export const FLASH_SESSION = 'flash'
