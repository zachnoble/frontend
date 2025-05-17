import React from 'react'
import { Group, type InputProps } from 'react-aria-components'
import { ToggleButton } from './button'
import { Input } from './field'
import { EyeIcon } from './icons/solid/eye'
import { EyeOffIcon } from './icons/solid/eye-off'
import { composeTailwindRenderProps } from './utils'

export function PasswordInput({ className, ...props }: InputProps) {
	const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

	return (
		<Group
			data-ui='control'
			className={[
				'grid',
				'grid-cols-[1fr_calc(theme(size.5)+20px)]',
				'sm:grid-cols-[1fr_calc(theme(size.4)+20px)]',
			].join(' ')}
		>
			<Input
				{...props}
				className={composeTailwindRenderProps(className, [
					'peer',
					'col-span-full',
					'row-start-1',
					'pe-10 sm:pe-9',
				])}
				type={isPasswordVisible ? 'text' : 'password'}
			/>
			<ToggleButton
				isIconOnly
				size='sm'
				variant='plain'
				aria-label='Show password'
				isSelected={isPasswordVisible}
				onChange={setIsPasswordVisible}
				className={[
					'group/toggle-password',
					'focus-visible:-outline-offset-1',
					'row-start-1',
					'-col-end-1',
					'place-self-center',
					'hover:bg-transparent',
				].join(' ')}
			>
				{isPasswordVisible ? (
					<EyeOffIcon className='text-muted/75 group-hover/toggle-password:text-foreground' />
				) : (
					<EyeIcon className='text-muted/75 group-hover/toggle-password:text-foreground' />
				)}
			</ToggleButton>
		</Group>
	)
}
