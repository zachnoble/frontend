import { Cross2Icon } from '@radix-ui/react-icons'
import { forwardRef } from 'react'
import type { ComponentProps } from 'react'
import { cn } from '~/lib/tailwind'
import { Spinner } from './spinner'

type Props = ComponentProps<'input'> & {
	error?: string
	isLoading?: boolean
	clear?: () => void
}

const Input = forwardRef<HTMLInputElement, Props>(
	({ className, type, error, isLoading, clear, ...props }, ref) => {
		return (
			<div className='relative w-full space-y-1'>
				<input
					type={type}
					className={cn(
						'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
						error && 'border-destructive',
						className,
					)}
					ref={ref}
					autoComplete='off'
					autoCorrect='off'
					{...props}
				/>
				{isLoading && (
					<Spinner className='absolute right-0 bottom-0 mr-3 flex h-full items-center' />
				)}
				{!isLoading && clear && (
					<button
						onClick={clear}
						type='button'
						className='absolute right-2.5 bottom-0 flex h-full items-center hover:opacity-70'
					>
						<Cross2Icon className='h-3.5 w-3.5' />
					</button>
				)}
				{error && <p className='text-destructive text-sm'>{error}</p>}
			</div>
		)
	},
)

export { Input }
