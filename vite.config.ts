import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			reactRouter(),
			tsconfigPaths(),
			babel({
				filter: /\.[jt]sx?$/,
				babelConfig: {
					compact: false,
					presets: ['@babel/preset-typescript'],
					plugins: [['babel-plugin-react-compiler']],
				},
			}),
		],
		server: {
			port: 3000,
		},
		resolve:
			mode === 'production'
				? {
						alias: {
							'react-dom/server': 'react-dom/server.node',
						},
					}
				: {},
	}
})
