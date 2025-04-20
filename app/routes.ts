import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

const routes: RouteConfig = [
	// Login & Register
	layout('routes/auth/layout.tsx', [
		route('login', 'routes/auth/login.tsx'),
		route('register', 'routes/auth/register.tsx'),
	]),

	// Home
	layout('routes/layout.tsx', [index('routes/index.tsx')]),

	// Reusable actions
	route('set-theme', 'routes/set-theme.ts'),
	route('logout', 'routes/auth/logout.tsx'),

	// Not Found
	route('*', 'routes/not-found.tsx'),
]

export default routes
