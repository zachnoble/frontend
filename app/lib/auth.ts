import { redirect, replace, type unstable_RouterContextProvider } from 'react-router'
import { client } from '~/lib/api'
import { getCookieFromRequest } from './requests'
import { toastError } from './toasts/middleware.server'

export type User = {
	id: string
	email: string
	name: string
}

export async function getUser(request: Request) {
	const sessionId = getCookieFromRequest(request, 'sessionId')
	if (!sessionId) return null

	const api = client(request)
	const res = await api.get<User>('/auth/user')
	if (res.error) return null

	return res.data
}

export async function requireAuth(request: Request) {
	const user = await getUser(request)
	if (!user) throw replace('/')
	return user
}

export async function requireGuest(request: Request) {
	const user = await getUser(request)
	if (user) throw replace('/')
	return null
}

export function setAuthCookieFromResponseHeaders(
	headers: Headers,
	context: unstable_RouterContextProvider,
) {
	const setCookieHeader = headers.get('set-cookie')
	if (!setCookieHeader) {
		return toastError(context, 'Something went wrong, please try again.')
	}
	const response = redirect('/')
	response.headers.append('Set-Cookie', setCookieHeader)
	return response
}
