import { z } from 'zod'

const name = z.string().min(2, 'Please enter your name')
const password = z.string().min(10, 'Password must be at least 10 characters')
const confirmPassword = z.string().min(1, 'Please confirm your password')
const email = z.string().email('Please enter a valid email address')
const recaptchaToken = z.string().optional()

export const schemas = {
	name,
	password,
	confirmPassword,
	email,
	recaptchaToken,
}
