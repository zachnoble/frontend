import { type ChangeEvent, useCallback, useEffect, useState } from 'react'
import type { FieldError } from '~/lib/api'

interface Options<T> {
	error: FieldError | undefined
	onChange: ((e: ChangeEvent<T>) => void) | undefined
}

export const useFormErrors = <T>({ error, onChange }: Options<T>) => {
	const [errorMessage, setErrorMessage] = useState<string>()

	const onChangeOverride = useCallback(
		(e: ChangeEvent<T>) => {
			setErrorMessage(undefined)
			onChange?.(e)
		},
		[onChange],
	)

	useEffect(() => {
		if (error) {
			setErrorMessage(error.message)
		}
	}, [error])

	return {
		errorMessage,
		onChangeOverride,
	}
}
