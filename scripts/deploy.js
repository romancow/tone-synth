const { version } = require('../package.json')
const { exec } = require('child_process')

const {
	GIT_CONFIG_NAME,
	GIT_CONFIG_EMAIL
} = process.env

const options = { cwd: 'dist' }
const command = [
	"git init -b master",
	GIT_CONFIG_NAME && `git config user.name "${GIT_CONFIG_NAME}"`,
	GIT_CONFIG_EMAIL && `git config user.email "${GIT_CONFIG_EMAIL}"`,
	"git add -A",
	`git commit -m 'v${version}'`,
	"git push -f git@github.com:romancow/tone-synth.git master:gh-pages"
].filter(cmd => !!cmd).join(" && ")

exec(command, options, (error, stdout, stderr) => {
	if (stdout) console.log(`STDOUT: ${stdout}`)
	if (stderr) console.error(`STDERR: ${stderr}`)
	if (error) {
		console.error(`ERROR: ${error}`)
		throw error
	}
})
