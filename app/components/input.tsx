import * as React from 'react'
import { useFormErrors } from '~/components/hooks/use-form-errors'
import type { FieldError } from '~/lib/api'

import { cn } from '~/lib/misc'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: FieldError
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, error, onChange, name, ...props }, ref) => {
		const { errorMessage, onChangeOverride } = useFormErrors({
			onChange,
			error,
		})

		return (
			<div className='w-full space-y-1'>
				<input
					type={type}
					name={name}
					className={cn(
						'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
						errorMessage && 'border-red-500',
						className,
					)}
					onChange={onChangeOverride}
					ref={ref}
					{...props}
				/>
				{errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
			</div>
		)
	},
)

export { Input }
