import { redirectWithToast } from 'remix-toast'
import { client } from '~/lib/api/middleware.server'
import { getErrorMessage } from '~/lib/errors'
import type { Route } from './+types/verify-email'

export function meta(): Route.MetaDescriptors {
	return [
		{
			title: 'Verify Email',
		},
		{
			name: 'description',
			content: 'Verify your email address',
		},
	]
}

export async function loader({ request, context }: Route.LoaderArgs) {
	try {
		const api = client(context)

		const url = new URL(request.url)
		const token = url.searchParams.get('token')
		const email = url.searchParams.get('email')

		if (!token || !email) throw new Error('Token and email are required')

		await api.post('/auth/verify-email', { token, email })

		return redirectWithToast('/login', {
			type: 'success',
			message: 'Email verified! You can now login.',
		})
	} catch (error) {
		return redirectWithToast('/login', {
			type: 'error',
			message: getErrorMessage(error),
		})
	}
}
