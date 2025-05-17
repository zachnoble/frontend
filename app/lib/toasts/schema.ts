import { z } from 'zod'

export const toastSchema = z.object({
	message: z.string(),
	type: z.custom<'success' | 'error'>(),
})

export const flashSessionValuesSchema = z.object({
	toast: toastSchema.optional(),
})

export const FLASH_SESSION = 'flash'

export type Toast = z.infer<typeof toastSchema>
