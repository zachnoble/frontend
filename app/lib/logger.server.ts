import pino, { type LoggerOptions } from 'pino'
import { envPrivate } from '~/lib/env.server'

const isDevelopment = envPrivate.NODE_ENV === 'development'

const developmentSettings: LoggerOptions = {
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
}

const productionSettings: LoggerOptions = {}

export const logger = pino(isDevelopment ? developmentSettings : productionSettings)
