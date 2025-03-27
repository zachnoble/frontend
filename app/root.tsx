import './styles/globals.css'

import { useEffect } from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration, data } from 'react-router'
import type { Route } from './+types/root'
import { useToast } from './components/hooks/use-toast'
import { Toaster } from './components/toaster'
import { publicConfig } from './config'
import { combineHeaders } from './lib/misc'
import { cn } from './lib/misc'
import { PreventFlashOnWrongTheme } from './lib/themes/components/prevent-flash'
import { ThemeProvider } from './lib/themes/context'
import { useTheme } from './lib/themes/hooks/use-theme'
import { themeSessionResolver } from './lib/themes/session.server'
import { getToast } from './lib/toast.server'

export async function loader({ request }: Route.LoaderArgs) {
	const { getTheme } = await themeSessionResolver(request)
	const { toast, headers: toastHeaders } = await getToast(request)

	return data(
		{
			env: publicConfig,
			theme: getTheme(),
			toast,
		},
		{
			headers: combineHeaders(toastHeaders),
		},
	)
}

export function ErrorBoundary(_props: Route.ErrorBoundaryProps) {
	return <div>Error...</div>
}

function App({ loaderData }: Route.ComponentProps) {
	const { toast: setToast } = useToast()
	const [theme] = useTheme()
	const { env, toast } = loaderData

	useEffect(() => {
		if (toast) {
			setToast(toast)
		}
	}, [toast, setToast])

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
				<Outlet />
				<ScrollRestoration />
				<Toaster />
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
	return (
		<ThemeProvider specifiedTheme={props.loaderData.theme} themeAction='set-theme'>
			<App {...props} />
		</ThemeProvider>
	)
}
