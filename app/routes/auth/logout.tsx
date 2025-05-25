import { data } from 'react-router'
import { client } from '~/lib/api/middleware.server'
import { getErrorMessage } from '~/lib/errors'
import { noLoader } from '~/lib/no-loader'
import type { Route } from './+types/logout'

export async function action({ context }: Route.ActionArgs) {
	try {
		const api = client(context)

		const {
			response: { headers },
		} = await api.post('/auth/logout')

		return data(null, {
			headers,
		})
	} catch (error) {
		return {
			error: getErrorMessage(error),
		}
	}
}

export const loader = noLoader
