import { useEffect } from 'react'
import toast from 'react-hot-toast'
import type { Toast } from '../schema'

export function useAppToasts(toastValue: Toast | null) {
	useEffect(() => {
		if (toastValue) {
			if (toastValue.type === 'success') {
				toast.success(toastValue.message)
			} else if (toastValue.type === 'error') {
				toast.error(toastValue.message)
			} else {
				toast(toastValue.message)
			}
		}
	}, [toastValue])
}
