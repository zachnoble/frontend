import { useEffect } from 'react'
import toast from 'react-hot-toast'
import type { Toast } from '../schema'

export function useToast(t: Toast | null) {
	useEffect(() => {
		if (t) {
			if (t.type === 'success') {
				toast.success(t.message)
			} else if (t.type === 'error') {
				toast.error(t.message)
			} else {
				toast(t.message)
			}
		}
	}, [t])
}
