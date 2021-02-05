const package = require('./package.json')
const { NODE_ENV } = process.env

module.exports = {
	publicPath: (NODE_ENV === 'production') ? '/tone-synth/' : '/',
	pluginOptions: {
		html: {
			entry: "src/main.ts",
			template: "!!pug-loader!src/index.pug",
			hash: true,
			title: "Tone Synth",
			version: package.version,
		}
	}
}
