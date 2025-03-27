import { replace } from 'react-router'
import { client } from '~/lib/api'

export interface User {
	id: string
	email: string
	name: string
}

export const getUser = async (request: Request) => {
	const api = client(request)
	const res = await api.get<User>('/user')
	if (!res.ok) return null
	return res.data
}

export const requireAuth = async (request: Request) => {
	const user = await getUser(request)
	if (!user) throw replace('/')
	return user
}

export const requireGuest = async (request: Request) => {
	const user = await getUser(request)
	if (user) return replace('/dashboard')
	return null
}
