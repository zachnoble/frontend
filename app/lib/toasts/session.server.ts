import { createCookieSessionStorage } from 'react-router'
import { envPrivate } from '~/lib/env.server'

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'toast',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: [envPrivate.SIGNATURE],
	},
})
