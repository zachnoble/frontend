import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
	// home
	index('./routes/index.tsx'),

	// auth
	layout('./routes/auth/layout.tsx', [
		route('login', './routes/auth/login.tsx'),
		route('register', './routes/auth/register.tsx'),
	]),
	route('logout', './routes/auth/logout.tsx'),

	// themes
	route('set-theme', './routes/set-theme.tsx'),

	// not found
	route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
