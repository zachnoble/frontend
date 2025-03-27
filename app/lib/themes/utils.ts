import { Theme } from './types'

export const themes = Object.values(Theme)

export const prefersLightMQ = '(prefers-color-scheme: light)'

export const mediaQuery = typeof window !== 'undefined' ? window.matchMedia(prefersLightMQ) : null

export const getPreferredTheme = () =>
	window.matchMedia(prefersLightMQ).matches ? Theme.LIGHT : Theme.DARK

export function isTheme(value: unknown) {
	return typeof value === 'string' && themes.includes(value as Theme)
}
