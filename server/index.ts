import path from 'node:path'
import url from 'node:url'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { logger } from 'hono/logger'
import { type ServerBuild, createRequestHandler } from 'react-router'
import { cache } from './cache'
import { compress } from './compress'

const buildPathArg = process.argv[2]
if (!buildPathArg) {
	console.error('Missing build path')
	process.exit(1)
}

const port = process.env.PORT
if (!port) {
	console.error('Missing port')
	process.exit(1)
}

const buildPath = path.resolve(buildPathArg)
const build: ServerBuild = await import(url.pathToFileURL(buildPath).href)

const app = new Hono({
	strict: false,
})

app.use('*', logger())

app.use('*', compress())

app.use(
	`${path.posix.join(build.publicPath, 'assets')}/*`,
	cache(60 * 60 * 24 * 365),
	serveStatic({
		root: path.join(build.assetsBuildDirectory, 'assets'),
	}),
)

app.use(
	'*',
	cache(60 * 60),
	serveStatic({
		root: build.assetsBuildDirectory,
	}),
)

app.use(async (c, next) => {
	return createMiddleware(async (c) => {
		return createRequestHandler(build, 'production')(c.req.raw)
	})(c, next)
})

export default {
	port,
	fetch: app.fetch,
}
