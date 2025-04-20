import './styles/main.css'

import { Links, Meta, Outlet, Scripts, ScrollRestoration, data } from 'react-router'
import type { Route } from './+types/root'
import { Toaster } from './components/toaster'
import { publicConfig } from './config'
import { ErrorBoundary } from './lib/errors/components/error-boundary'
import { cn } from './lib/tailwind'
import { PreventFlashOnWrongTheme } from './lib/themes/components/prevent-flash'
import { ThemeProvider } from './lib/themes/context'
import { useTheme } from './lib/themes/hooks/use-theme'
import { themeSessionResolver } from './lib/themes/session.server'
import { useAppToasts } from './lib/toasts/hooks/use-app-toasts'
import { getToast, toastMiddleware } from './lib/toasts/middleware.server'

export const unstable_middleware = [toastMiddleware()]

export { ErrorBoundary }

export async function loader({ request, context }: Route.LoaderArgs) {
	const { getTheme } = await themeSessionResolver(request)

	const toast = getToast(context)

	return data({
		env: publicConfig,
		theme: getTheme(),
		toast,
	})
}

function App({ loaderData: { env, toast } }: Route.ComponentProps) {
	const [theme] = useTheme()

	useAppToasts(toast)

	return (
		<html lang='en' className={cn(theme)}>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
				<Links />
			</head>
			<body>
				<Toaster />
				<Outlet />
				<ScrollRestoration />
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: this is safe
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<Scripts />
			</body>
		</html>
	)
}

export default function AppWithProviders(props: Route.ComponentProps) {
	const {
		loaderData: { theme },
	} = props

	return (
		<ThemeProvider specifiedTheme={theme} themeAction='set-theme'>
			<App {...props} />
		</ThemeProvider>
	)
}
