import { createCookieSessionStorage } from 'react-router'
import type { SessionStorage } from 'react-router'
import { privateConfig } from '~/config'
import type { Theme } from './types'
import { isTheme } from './utils'

type ThemeSession = {
	getTheme: () => Theme | null
	setTheme: (theme: Theme) => void
	commit: () => Promise<string>
	destroy: () => Promise<string>
}

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'theme',
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secrets: [privateConfig.SIGNATURE],
	},
})

export function createThemeSessionResolver(cookieThemeSession: SessionStorage) {
	const resolver = async (request: Request): Promise<ThemeSession> => {
		const session = await cookieThemeSession.getSession(request.headers.get('Cookie'))

		return {
			getTheme: () => {
				const themeValue = session.get('theme')
				return isTheme(themeValue) ? themeValue : null
			},
			setTheme: (theme: Theme) => session.set('theme', theme),
			commit: () => cookieThemeSession.commitSession(session),
			destroy: () => cookieThemeSession.destroySession(session),
		}
	}

	return resolver
}

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
