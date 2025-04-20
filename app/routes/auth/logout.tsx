import { redirect } from 'react-router'
import { client } from '~/lib/api'
import { setAuthCookieFromResponseHeaders } from '~/lib/auth'
import { toastError } from '~/lib/toasts/middleware.server'
import type { Route } from './+types/logout'

export async function action({ request, context }: Route.ActionArgs) {
	const api = client(request)

	const {
		response: { headers },
		error,
	} = await api.post('/auth/logout')

	if (error) return toastError(context, error)

	return setAuthCookieFromResponseHeaders(headers, context)
}

export function loader() {
	return redirect('/')
}
