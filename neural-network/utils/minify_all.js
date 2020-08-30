const fs = require('fs')
const readline = require('readline')
const data = []
const length = process.argv[2] || 100000

fs.readdir('dictionaries/', (err, files) => {
	files.forEach(file => {
		if (file != '.DS_Store') {
			const language = file.substring(0, file.indexOf('.'))
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

					fs.writeFile('dictionaries_min/' + language + '.dic', data.join('\r\n'), 'utf8', () => {
						console.log(language + ' saved to ' + language + '.dic')
					})
				})
		}
	})
})
