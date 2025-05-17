import { Outlet } from 'react-router'
import { requireGuest } from '~/lib/auth/middleware.server'
import type { Route } from './+types/layout'

export function loader({ context }: Route.LoaderArgs) {
	return requireGuest(context)
}

export default function AuthLayout() {
	return (
		<div className='flex min-h-[100dvh] w-full items-center justify-center py-12'>
			<div className='mx-auto w-full max-w-[500px] px-8'>
				<Outlet />
			</div>
		</div>
	)
}
