import { z } from 'zod'

declare global {
	interface Window {
		ENV: typeof env
	}
}

const schema = z.object({
	NODE_ENV: z.enum(['development', 'production']),
	PORT: z.coerce.number().default(8080),
	API_URL: z.string().min(1),
	SIGNATURE: z.string().min(1),
})

const { API_URL, NODE_ENV, PORT, SIGNATURE } = schema.parse(Bun.env)

export const env = {
	// Only include ENV variables which are safe to send to the client
	API_URL,
}

export const envPrivate = {
	NODE_ENV,
	SIGNATURE,
	PORT,
}
