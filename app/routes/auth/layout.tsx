import { BoxIcon } from 'lucide-react'
import { Link, Outlet } from 'react-router'
import { requireGuest } from '~/lib/auth'
import type { Route } from './+types/layout'

export async function loader({ request }: Route.LoaderArgs) {
	return await requireGuest(request)
}

export default function AuthLayout() {
	return (
		<div className='flex h-screen w-full items-center justify-center'>
			<Link
				to='/'
				className='absolute top-8 left-10 text-muted-foreground italic hover:opacity-70'
			>
				<BoxIcon width={35} height={35} />
			</Link>
			<div className='w-full max-w-[500px] px-8'>
				<Outlet />
			</div>
		</div>
	)
}
