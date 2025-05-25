import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
	// home
	index('./routes/index.tsx'),

	// auth
	route('login', './routes/auth/login.tsx'),
	route('register', './routes/auth/register.tsx'),
	route('logout', './routes/auth/logout.tsx'),
	route('verify-email', './routes/auth/verify-email.tsx'),
	route('forgot-password', './routes/auth/forgot-password.tsx'),
	route('reset-password', './routes/auth/reset-password.tsx'),

	// themes
	route('set-theme', './routes/set-theme.tsx'),

	// not found
	route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
