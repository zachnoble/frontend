import type { publicConfig } from '~/config'

declare global {
	interface Window {
		ENV: typeof publicConfig
	}
}
