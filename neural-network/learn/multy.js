const brain = require('brain.js')
const fs = require('fs')
const readline = require('readline')

const net = new brain.NeuralNetwork()
const data = []
const languages = []
const promises = []
const maxLength = 20000 // Лимит слов из одного словаря 

fs.readdir('dictionaries_min/', (err, files) => {
	files.forEach(file => {
		if (file != '.DS_Store')
			languages.push({
				id: file.substring(0, file.indexOf('.')).replace(/[^a-zA-Z ]/g, "").replace(/ /g,"_").toLowerCase(),
				name: file.substring(0, file.indexOf('.')),
				file: 'dictionaries_min/' + file
			})
	})

	fs.writeFile('languages.json', JSON.stringify(languages), 'utf8', () => {
		console.log('Languages saved to languages.json')
	})

	languages.forEach(readLang)

	Promise.all(promises).then(() => {
		data.sort(i => Math.random() - 0.5)
		net.train(data, {
			iterations: 3,
			// errorThresh: 0.005,
			// learningRate: 0.5,
			log: true,
			logPeriod: 1,
			// timeout: Infinity
		})

		fs.writeFile('networks/multy.json', JSON.stringify(net.toJSON()), 'utf8', () => {
			console.log('Network saved to multy.json')
		})
	})
})

function readLang(lang) {
	let count = 0
	promises.push(new Promise(resolve => {
		const stream = readline
			.createInterface({
				input: fs.createReadStream(lang.file)
			})
			.on('line', line => {
				if (++count < maxLength) {
					let input = getChars(line)
					let output = {}
					output[lang.id] = 1
					data.push({ input, output })
				}
			})
			.on('close', resolve)
	}))
}

function getChars(input) {
	let output = {}

	input = input.indexOf('/') >= 0 ? input.substring(0, input.indexOf('/')) : input
	
	input.split('').forEach(i => {
		output[i] = 1
	})

	return output
}