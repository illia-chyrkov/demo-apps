const fs = require('fs')
const readline = require('readline')
const data = []
const language = process.argv[2]
const length = process.argv[3] || 100000

const stream = readline
	.createInterface({
		input: fs.createReadStream('dictionaries/' + language + '.dic')
	})
	.on('line', line => {
		line = line.indexOf('/') >= 0 ? line.substring(0, line.indexOf('/')) : line
		data.push(line)
	})
	.on('close', () => {
		data.sort(i => Math.random() - 0.5)
		data.splice(length,data.length)

		fs.writeFile('dictionaries_min/' + language + '_min.dic', data.join('\r\n'), 'utf8', () => {
			console.log('Saved to ' + language + '_min.dic')
		})
	})


