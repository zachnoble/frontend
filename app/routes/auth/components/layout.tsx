import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { HomeLink } from './home-link'

interface Props {
	children: ReactNode
	wide?: boolean
}

export function AuthLayout({ children, wide = false }: Props) {
	return (
		<div className='flex min-h-[100dvh] w-full items-center justify-center py-12'>
			<div className={twMerge('mx-auto w-full max-w-[500px] px-8', wide && 'max-w-[600px]')}>
				<HomeLink />
				{children}
			</div>
		</div>
	)
}
