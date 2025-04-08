import { replace } from 'react-router'
import { client } from '~/lib/api'
import { getCookieFromRequest } from './misc'

export interface User {
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
	if (user) throw replace('/dashboard')
	return null
}
