const { version } = require('../package.json')
const { exec } = require('child_process')

const options = { cwd: 'dist' }
const command = [
	"git init",
	"git add -A",
	`git commit -m 'v${version}'`,
	"git push -f git@github.com:romancow/tone-synth.git master:gh-pages"
].join("\n")

exec(command, options, (error, stdout, stderr) => {
	if (stdout) console.log(`STDOUT: ${stdout}`)
	if (stderr) console.error(`STDERR: ${stderr}`)
	if (error) console.error(`ERROR: ${error}`)
})
