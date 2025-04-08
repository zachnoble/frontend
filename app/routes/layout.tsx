import { Suspense } from 'react'
import { Await, Link, Outlet, useFetcher } from 'react-router'
import { Button } from '~/components/button'
import { Skeleton } from '~/components/skeleton'
import { getUser } from '~/lib/auth'
import type { Route } from './+types/layout'

export async function loader({ request }: Route.LoaderArgs) {
	return {
		user: getUser(request),
	}
}

export default function Layout({ loaderData }: Route.ComponentProps) {
	const { state, submit } = useFetcher<typeof loader>()
	const { user } = loaderData
	const loading = state !== 'idle'

	return (
		<div>
			<header className='flex h-[65px] w-full items-center justify-center'>
				<div className='flex w-full max-w-[1400px] justify-end px-10'>
					<Suspense
						fallback={
							<div className='flex gap-4'>
								<Skeleton className='h-8 w-24' />
								<Skeleton className='h-8 w-24' />
							</div>
						}
					>
						<Await resolve={user}>
							{(user) => (
								<div>
									{!user && (
										<div className='flex gap-4'>
											<Button asChild className='h-8'>
												<Link to='/login'>Login</Link>
											</Button>
											<Button asChild className='h-8'>
												<Link to='/register'>Register</Link>
											</Button>
										</div>
									)}

									{user && (
										<div>
											<Button
												className='h-8'
												type='button'
												disabled={loading}
												onClick={() =>
													submit(null, {
														method: 'post',
														action: '/logout',
													})
												}
											>
												Logout
											</Button>
										</div>
									)}
								</div>
							)}
						</Await>
					</Suspense>
				</div>
			</header>
			<Outlet />
		</div>
	)
}
