import { z } from 'zod'

const defaultOptions: z.RawCreateParams = {
	message: 'Please select an option',
}

export function optionSchema(options = defaultOptions) {
	return z.object(
		{
			id: z.string(),
			name: z.string(),
		},
		{
			message: 'Please select an option',
			...options,
		},
	)
}
