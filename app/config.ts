import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const publicSchema = z.object({
	API_URL: z.string().min(1),
})

export const publicConfig = publicSchema.parse({
	API_URL: process.env.API_URL,
})

const privateSchema = publicSchema.extend({
	SIGNATURE: z.string().min(16),
})

export const privateConfig = privateSchema.parse({
	...publicConfig,
	SIGNATURE: process.env.SIGNATURE,
})
