import { requireAuth } from '~/lib/auth'
import type { Route } from './+types/dashboard'

export const meta: Route.MetaFunction = () => {
	return [
		{
			title: 'Dashboard',
		},
		{
			name: 'description',
			content: 'This is a protected route',
		},
	]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const user = await requireAuth(request)

	return {
		user,
	}
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData

	return (
		<div className='flex h-screen items-center justify-center'>
			Hey, {user.name}. This is a protected route.
		</div>
	)
}
