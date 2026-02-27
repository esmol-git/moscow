import posthtml from 'posthtml'
import posthtmExpressions from 'posthtml-expressions'
import posthtmlExtend from './extend.js'
import posthtmlInclude from './include.js'
import posthtmlFetch from './fetch'

import logger from '../logger.js'

import path from 'path'

const name = 'PostHTMLPreUse'
const defaultOptions = {
	root: null,
	include: {
		posthtmlExpressionsOptions: {
			//missingLocal: '',
			strictMode: true,
			delimiters: ['[[', ']]']
		}
	},
	fetch: {
		expressions: {
			//missingLocal: '',
			strictMode: true,
			delimiters: ['[[', ']]'],
		}
	},
	expressions: {
		//missingLocal: '',
		strictMode: true,
		delimiters: ['[[', ']]']
	},
	extend: {
		tagName: "template",
		expressions: {
			//missingLocal: '',
			strictMode: true,
			delimiters: ['[[', ']]'],
		}
	},
	plugins: [],
	options: {}
}
const plugin = (pluginOptions = {}) => {
	pluginOptions = { ...defaultOptions, ...pluginOptions }
	return {
		name,
		enforce: 'pre',
		transformIndexHtml: {
			order: 'pre',
			handler: async (html, { filename, server }) => {
				if (filename.replace('.html', '').endsWith('.json') && html.startsWith('{')) {
					return html
				}
				// Корень для шаблонов: берём из Vite config (абсолютный путь к src) или process.cwd()/src
				const rootDir = pluginOptions.root
					|| (server?.config?.root && path.resolve(server.config.root))
					|| path.join(process.cwd(), 'src')
				const plugins = []
				if (pluginOptions.extend) {
					plugins.push(posthtmlExtend({ root: rootDir, ...pluginOptions.extend }))
				}
				if (pluginOptions.include) {
					plugins.push(posthtmlInclude({ root: rootDir, ...pluginOptions.include }))
				}
				if (pluginOptions.fetch) {
					plugins.push(posthtmlFetch({ root: rootDir, ...pluginOptions.fetch }))
				}
				if (pluginOptions.expressions) {
					plugins.push(posthtmExpressions({ root: rootDir, ...pluginOptions.expressions }))
				}
				const render = await new Promise((resolve) => {
					const output = {}
					posthtml(plugins.concat(...pluginOptions.plugins)).process(html, pluginOptions.options).catch(error => {
						output.error = error
						logger(`(!!)${error}`);
						resolve(output)
					}).then(result => {
						// @ts-ignore
						output.content = result?.html
						resolve(output)
					})
				})
				return render.content
			}
		}
	}
}
export default plugin

