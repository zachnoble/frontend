import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import { Command as CommandPrimitive } from 'cmdk'
import { type FocusEvent, useEffect, useMemo, useState } from 'react'
import { Badge } from '~/components/badge'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '~/components/command'
import { Input } from '~/components/input'
import { Popover, PopoverAnchor, PopoverContent } from '~/components/popover'
import { cn } from '~/lib/tailwind'
import type { SearchCallbackOptions, SearchOption } from '~/types/search'

type SharedProps = {
	options: SearchOption[]
	search: string
	setSearch: (search: string, options?: SearchCallbackOptions) => void
	isLoading?: boolean
	emptyMessage?: string
	placeholder?: string
	error?: string
	className?: string
}

type SingleProps = SharedProps & {
	isMulti?: false
	value: string
	onChange: (value: string) => void
}

type MultiProps = SharedProps & {
	isMulti: true
	values: string[]
	onChange: (values: string[]) => void
}

type Props = SingleProps | MultiProps

function AutoCompleteSingle({
	options = [],
	search,
	setSearch,
	value,
	onChange,
	isLoading = false,
	emptyMessage = 'No results found.',
	placeholder = 'Search...',
	error,
	className,
}: SingleProps) {
	const [open, setOpen] = useState(false)

	const labels = useMemo(
		() =>
			options.reduce(
				(acc, item) => {
					acc[item.value] = item.label
					return acc
				},
				{} as Record<string, string>,
			),
		[options],
	)

	function reset() {
		onChange('')
		setSearch('', {
			shouldSearch: false,
		})
	}

	function onInputBlur(e: FocusEvent<HTMLInputElement>) {
		if (!e.relatedTarget?.hasAttribute('cmdk-list') && labels[value] !== search) {
			reset()
		}
	}

	function onSelectItem(inputValue: string) {
		if (inputValue === value) {
			reset()
		} else {
			onChange(inputValue)
			setSearch(labels[inputValue] ?? '', {
				shouldSearch: false,
			})
		}
		setOpen(false)
	}

	return (
		<div className={cn('flex flex-col', className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<Command shouldFilter={false}>
					<PopoverAnchor asChild>
						<CommandPrimitive.Input
							asChild
							value={search}
							onValueChange={(value) => setSearch(value, { shouldSearch: true })}
							onKeyDown={(e) => setOpen(e.key !== 'Escape')}
							onMouseDown={() => setOpen((open) => !!search || !open)}
							onFocus={() => setOpen(true)}
							onBlur={onInputBlur}
						>
							<Input
								placeholder={placeholder}
								isLoading={isLoading}
								className={cn(error && 'border-destructive')}
								clear={search.length > 0 ? reset : undefined}
							/>
						</CommandPrimitive.Input>
					</PopoverAnchor>
					{!open && <CommandList aria-hidden='true' className='hidden' />}
					<PopoverContent
						asChild
						onOpenAutoFocus={(e) => e.preventDefault()}
						onInteractOutside={(e) => {
							if (
								e.target instanceof Element &&
								e.target.hasAttribute('cmdk-input')
							) {
								e.preventDefault()
							}
						}}
						className='w-[--radix-popover-trigger-width] p-0'
					>
						<CommandList className={cn(isLoading && 'hidden')}>
							{options.length > 0 && (
								<CommandGroup>
									{options.map((option) => (
										<CommandItem
											key={option.value}
											value={option.value}
											onMouseDown={(e) => e.preventDefault()}
											onSelect={onSelectItem}
										>
											{option.label}
											<CheckIcon
												className={cn(
													'absolute right-2 h-4 w-4',
													value === option.value
														? 'opacity-100'
														: 'opacity-0',
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							)}
							{options.length === 0 && (
								<CommandEmpty>
									{search.length > 0 ? emptyMessage : 'Type to search...'}
								</CommandEmpty>
							)}
						</CommandList>
					</PopoverContent>
				</Command>
			</Popover>
			{error && <p className='mt-1 text-destructive text-sm'>{error}</p>}
		</div>
	)
}

function AutoCompleteMulti({
	options = [],
	search,
	setSearch,
	values = [],
	onChange,
	isLoading = false,
	emptyMessage = 'No results found.',
	placeholder = 'Search...',
	error,
	className,
}: MultiProps) {
	const [open, setOpen] = useState(false)
	const [selectedOptions, setSelectedOptions] = useState<SearchOption[]>([])

	useEffect(() => {
		for (const value of values) {
			const option = options.find((o) => o.value === value)
			if (option) {
				setSelectedOptions((prev) => [...prev, option])
			}
		}
	}, [options, values])

	function reset() {
		setSearch('', {
			shouldSearch: false,
		})
	}

	function onInputBlur(e: FocusEvent<HTMLInputElement>) {
		if (!e.relatedTarget?.hasAttribute('cmdk-list')) {
			reset()
		}
	}

	function onSelectItem(inputValue: string) {
		if (values.includes(inputValue)) {
			onChange(values.filter((v) => v !== inputValue))
		} else {
			onChange([...values, inputValue])
		}
		setSearch('', {
			shouldSearch: false,
		})
	}

	function removeValue(valueToRemove: string) {
		onChange(values.filter((v) => v !== valueToRemove))
	}

	return (
		<div className={cn('flex flex-col', className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<Command shouldFilter={false}>
					<PopoverAnchor asChild>
						<div
							className={cn(
								'group rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
								error && 'border-destructive',
							)}
						>
							<div
								className={cn(
									'flex flex-wrap gap-1 px-2 pt-2',
									values.length === 0 && 'hidden',
								)}
							>
								{values.map((v) => (
									<Badge
										key={v}
										variant='secondary'
										className='!bg-muted flex select-none items-center justify-between gap-0.5 px-1.5 py-1'
									>
										<p>{selectedOptions.find((o) => o.value === v)?.label}</p>
										<button
											type='button'
											className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													removeValue(v)
												}
											}}
											onMouseDown={(e) => {
												e.preventDefault()
												e.stopPropagation()
											}}
											onClick={() => removeValue(v)}
										>
											<Cross2Icon className='h-3.5 w-3.5 text-muted-foreground hover:text-foreground' />
										</button>
									</Badge>
								))}
								<button
									type='button'
									onClick={() => onChange([])}
									className='p-1.5'
								>
									<Cross2Icon className='h-4 w-4 text-muted-foreground hover:text-foreground' />
								</button>
							</div>
							<CommandPrimitive.Input
								asChild
								value={search}
								onValueChange={(value) => setSearch(value, { shouldSearch: true })}
								onKeyDown={(e) => setOpen(e.key !== 'Escape')}
								onMouseDown={() => setOpen((open) => !!search || !open)}
								onFocus={() => setOpen(true)}
								onBlur={onInputBlur}
							>
								<Input
									placeholder={values.length === 0 ? placeholder : ''}
									isLoading={isLoading}
									className='mr-4 border-0 px-3 focus-visible:ring-0 focus-visible:ring-offset-0'
								/>
							</CommandPrimitive.Input>
						</div>
					</PopoverAnchor>
					{!open && <CommandList aria-hidden='true' className='hidden' />}
					<PopoverContent
						asChild
						onOpenAutoFocus={(e) => e.preventDefault()}
						onInteractOutside={(e) => {
							if (
								e.target instanceof Element &&
								e.target.hasAttribute('cmdk-input')
							) {
								e.preventDefault()
							}
						}}
						className='w-[--radix-popover-trigger-width] p-0'
					>
						<CommandList className={cn(isLoading && 'hidden')}>
							{options.length > 0 && (
								<CommandGroup>
									{options.map((option) => (
										<CommandItem
											key={option.value}
											value={option.value}
											onMouseDown={(e) => e.preventDefault()}
											onSelect={onSelectItem}
										>
											{option.label}
											<CheckIcon
												className={cn(
													'absolute right-2 h-4 w-4',
													values.includes(option.value)
														? 'opacity-100'
														: 'opacity-0',
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							)}
							{options.length === 0 && (
								<CommandEmpty>
									{search.length > 0 ? emptyMessage : 'Type to search...'}
								</CommandEmpty>
							)}
						</CommandList>
					</PopoverContent>
				</Command>
			</Popover>
			{error && <p className='mt-1 text-destructive text-sm'>{error}</p>}
		</div>
	)
}

export function AutoComplete(props: Props) {
	if (props.isMulti) {
		return <AutoCompleteMulti {...props} />
	}
	return <AutoCompleteSingle {...props} />
}
