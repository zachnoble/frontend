import './styles/tailwind.css'
import type { ReactNode } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { getToast, unstable_toastMiddleware } from 'remix-toast/middleware'
import { twMerge } from 'tailwind-merge'
import type { Route } from './+types/root'
import { Button } from './components/button'
import { Toaster } from './components/toaster'
import { apiClientMiddleware } from './lib/api/middleware.server'
import { authMiddleware } from './lib/auth/middleware.server'
import { env } from './lib/env.server'
import { NavProgress } from './lib/nav-progress'
import { PreventFlashOnWrongTheme } from './lib/themes/components/prevent-flash'
import { ThemeProvider } from './lib/themes/context'
import { useTheme } from './lib/themes/hooks/use-theme'
import { themeSessionResolver } from './lib/themes/session.server'

type DocumentProps = {
	className?: string
	headSlot?: ReactNode
	bodySlot?: ReactNode
}

function Document({ className, headSlot, bodySlot }: DocumentProps) {
	return (
		<html lang='en' className={className}>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
				{headSlot}
			</head>
			<body>
				{bodySlot}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export function ErrorBoundary() {
	return (
		<Document
			className='dark'
			headSlot={<title>Error</title>}
			bodySlot={
				<main className='flex min-h-[100dvh] w-screen flex-col items-center justify-center gap-6 py-12'>
					<div className='flex flex-col items-center gap-4 text-center'>
						<h1 className='font-bold text-3xl md:text-6xl'>Something went wrong...</h1>
						<p className='max-w-md text-muted text-sm'>
							An unexpected error occured. Please try refreshing the page.
						</p>
					</div>
					<Button asChild>
						<Link to='/'>Return Home</Link>
					</Button>
				</main>
			}
		/>
	)
}

export const unstable_middleware = [
	apiClientMiddleware(),
	authMiddleware(),
	unstable_toastMiddleware(),
]

export async function loader({ request, context }: Route.LoaderArgs) {
	const { getTheme } = await themeSessionResolver(request)
	const theme = getTheme()

	const toast = getToast(context)

	return {
		env,
		theme,
		toast,
	}
}

function App({ loaderData: { env, toast: toastData } }: Route.ComponentProps) {
	const [theme] = useTheme()

	return (
		<Document
			className={twMerge(theme)}
			headSlot={<PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />}
			bodySlot={
				<>
					<NavProgress />
					<Toaster toastData={toastData} />
					<Outlet />
					<script
						// biome-ignore lint/security/noDangerouslySetInnerHtml: this is safe
						dangerouslySetInnerHTML={{
							__html: `window.ENV = ${JSON.stringify(env)}`,
						}}
					/>
				</>
			}
		/>
	)
}

export default function Root(props: Route.ComponentProps) {
	const {
		loaderData: { theme, env },
	} = props

	return (
		<ThemeProvider specifiedTheme={theme}>
			<GoogleReCaptchaProvider reCaptchaKey={env.RECAPTCHA_SITE_KEY} language='en'>
				<App {...props} />
			</GoogleReCaptchaProvider>
		</ThemeProvider>
	)
}
