import { noLoader } from '~/lib/no-loader'
import { themeSessionResolver } from '~/lib/themes/session.server'
import { isTheme } from '~/lib/themes/utils'
import type { Route } from './+types/set-theme'

export async function action({ request }: Route.ActionArgs) {
	const session = await themeSessionResolver(request)
	const { theme } = await request.json()

	if (!theme) {
		return Response.json(
			{ success: true },
			{ headers: { 'Set-Cookie': await session.destroy() } },
		)
	}

	if (!isTheme(theme)) {
		return Response.json({
			success: false,
			message: `${theme} is not a valid theme`,
		})
	}

	session.setTheme(theme)

	return Response.json(
		{
			success: true,
		},
		{
			headers: {
				'Set-Cookie': await session.commit(),
			},
		},
	)
}

export const loader = noLoader
