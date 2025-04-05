import { redirect } from 'react-router'
import { client } from '~/lib/api'
import { noLoader } from '~/lib/misc'
import type { Route } from './+types/logout'

export async function action({ request }: Route.ActionArgs) {
	const api = client(request)

	const {
		raw: { headers },
		error,
	} = await api.post('/auth/logout')

	if (error) return null

	const response = redirect('/')
	const setCookieHeader = headers.get('set-cookie') ?? ''
	response.headers.append('set-cookie', setCookieHeader)

	return response
}

export const loader = noLoader
