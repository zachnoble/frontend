import { forwardRef } from 'react'
import type { ComponentProps } from 'react'
import { cn } from '~/lib/tailwind'

type Props = ComponentProps<'textarea'> & {
	error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ className, error, ...props }, ref) => {
	return (
		<div className='relative w-full space-y-1'>
			<textarea
				className={cn(
					'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
					error && 'border-destructive',
					className,
				)}
				autoComplete='off'
				autoCorrect='off'
				ref={ref}
				{...props}
			/>
			{error && <p className='text-destructive text-sm'>{error}</p>}
		</div>
	)
})

export { Textarea }
