import { redirect } from 'react-router'
import { client } from '~/lib/api'
import { noLoader } from '~/lib/misc'
import type { Route } from './+types/logout'

export const action = async ({ request }: Route.ActionArgs) => {
	const api = client(request)

	const { error } = await api.post('/logout')
	if (error) return { error }
	return redirect('/')
}

export const loader = noLoader
