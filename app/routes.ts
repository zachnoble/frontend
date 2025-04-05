import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

const routes: RouteConfig = [
	layout('routes/auth/layout.tsx', [
		route('login', 'routes/auth/login.tsx'),
		route('register', 'routes/auth/register.tsx'),
	]),
	route('logout', 'routes/auth/logout.tsx'),

	layout('routes/layout.tsx', [index('routes/index.tsx')]),
	route('dashboard', 'routes/dashboard.tsx'),
	route('set-theme', 'routes/set-theme.ts'),
]

export default routes
