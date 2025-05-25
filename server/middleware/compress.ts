import zlib from 'node:zlib'
import { gzipSync } from 'bun'
import type { MiddlewareHandler } from 'hono'

class CompressionStream {
	readable: ReadableStream
	writable: WritableStream

	constructor() {
		const handle = zlib.createGzip()

		this.readable = new ReadableStream({
			start(controller) {
				handle.on('data', (chunk: Uint8Array) => controller.enqueue(chunk))
				handle.once('end', () => controller.close())
			},
		})

		this.writable = new WritableStream({
			// biome-ignore lint/suspicious/noExplicitAny: type safety unnecessary
			write: (chunk: Uint8Array) => handle.write(chunk) as any,
			// biome-ignore lint/suspicious/noExplicitAny: type safety unnecessary
			close: () => handle.end() as any,
		})
	}
}

const type = 'gzip'
const encoding = 'utf-8'

const toBuffer = (data: unknown) =>
	Buffer.from(
		typeof data === 'object' ? JSON.stringify(data) : (data?.toString() ?? new String(data)),
		encoding,
	)

export const compress = (): MiddlewareHandler => {
	return async function compress(c, next) {
		await next()

		const accepted = c.req.header('Accept-Encoding')
		const acceptsEncoding = accepted?.includes(type)

		if (!acceptsEncoding || !c.res.body) {
			return
		}

		try {
			const stream = c.res.body
			const compressedBody =
				stream instanceof ReadableStream
					? stream.pipeThrough(new CompressionStream())
					: gzipSync(toBuffer(c.res.body))

			c.res = new Response(compressedBody, {
				headers: c.res.headers,
				status: c.res.status,
				statusText: c.res.statusText,
			})
			c.res.headers.set('Content-Encoding', type)
		} catch {
			return
		}
	}
}
