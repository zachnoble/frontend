import { useEffect, useMemo, useRef, useState } from 'react'
import type { SearchCallbackOptions, SearchOption } from '~/types/search'

type UseSearchOptionsProps = {
	fetcher: (search: string, signal: AbortSignal) => Promise<SearchOption[]>
}

export function useSearchOptions({ fetcher }: UseSearchOptionsProps) {
	const [search, setSearch] = useState('')
	const [options, setOptions] = useState<SearchOption[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const shouldSearch = useRef(true)

	useEffect(() => {
		const abortController = new AbortController()
		let isActive = true

		async function handler() {
			if (!shouldSearch.current) {
				return
			}

			if (!search) {
				setOptions([])
				setIsLoading(false)
				return
			}

			try {
				setIsLoading(true)
				const options = removeDuplicates(await fetcher(search, abortController.signal))
				if (isActive) {
					setOptions(options)
					setIsLoading(false)
				}
			} catch (error) {
				if (isActive && !(error instanceof Error && error.name === 'AbortError')) {
					setIsLoading(false)
				}
			}
		}

		handler()

		return () => {
			isActive = false
			abortController.abort()
		}
	}, [search, fetcher])

	return {
		options,
		isLoading,
		search,
		setSearch: (search: string, options: SearchCallbackOptions = {}) => {
			shouldSearch.current = options.shouldSearch ?? true
			setSearch(search)
		},
	}
}

type UseStaticSearchOptionsProps = {
	options: SearchOption[]
	limit?: number
}

export function useStaticSearchOptions({ options, limit = 100 }: UseStaticSearchOptionsProps) {
	const [search, setSearch] = useState('')

	const filteredOptions = useMemo(() => {
		const searchCleaned = search.toLowerCase().trim()

		return removeDuplicates(
			options
				.filter(
					(option) =>
						option.label.toLowerCase().trim().includes(searchCleaned) ||
						option.value.toLowerCase().trim().includes(searchCleaned),
				)
				.slice(0, limit),
		)
	}, [search, options, limit])

	return {
		options: filteredOptions,
		search,
		setSearch,
	}
}

function removeDuplicates(options: SearchOption[]) {
	const existingValues = new Set()
	return options.filter((option) => {
		if (existingValues.has(option.value)) {
			return false
		}
		existingValues.add(option.value)
		return true
	})
}
