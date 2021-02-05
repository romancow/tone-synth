/** A vue-cli plugin to easily specify single HtmlWebpackPlugin options
 * in vue config (`pluginOptions.html`) */

module.exports =  (api, options) => {
	const { html = {} } = options.pluginOptions || {}
	api.chainWebpack(config => {
		config.plugin('html').tap(args => {
			const [orig, ...otherArgs] = args
			const merged = Object.assign(orig, html)
			return [merged, ...otherArgs]
		})
	})
}
