const brain = require('brain.js')
const fs = require('fs')
const readline = require('readline')

const net = new brain.NeuralNetwork()
const data = []
const maxLength = 50000 // Лимит слов из одного словаря 

const ru = new Promise(resolve => {
	let count = 0
	const stream = readline
		.createInterface({
			input: fs.createReadStream('../dictionaries_min/Russian.dic')
		})
		.on('line', line => {
			if (++count < maxLength) fillData(line, 1)
		})
		.on('close', resolve)
})

const en = new Promise(resolve => {
	let count = 0
	const stream = readline
		.createInterface({
			input: fs.createReadStream('../dictionaries_min/Ukrainian.dic')
		})
		.on('line', line => {
			if (++count < maxLength) fillData(line, 0)
		})
		.on('close', resolve)
})

Promise.all([ru, en]).then(() => {
	data.sort(i => Math.random() - 0.5)
	net.train(data, {
		iterations: 100,
		// errorThresh: 0.005,
		// learningRate: 0.5,
		log: true,
		logPeriod: 1,
		// timeout: Infinity
	})

	fs.writeFile('../networks/pair.json', JSON.stringify(net.toJSON()), 'utf8', () => {
		console.log('Saved to pair.json')
	})
})

// function fillData(input, output) {
// 	input = input.indexOf('/') >= 0 ? input.substring(0, input.indexOf('/')) : input

// 	input = input.split('').reduce((arr, i) => {
// 		return [...arr, ...i.charCodeAt().toString(2).split('').map(i => +i)]
// 	}, [])

// 	data.push({ input, output: [output] })
// }

function fillData(input, output) {
	// 20 символов по 12 битов
	const symbols = 20
	const bytes = 12

	input = input.indexOf('/') >= 0 ? input.substring(0, input.indexOf('/')) : input

	if (input.length > symbols) return
	
	input = input.split('').reduce((arr, i) => {
		return [...arr, ...fillNulls(i.charCodeAt().toString(2).split('').map(i => +i), bytes)]
	}, [])

	input = fillNulls(input, symbols * bytes)
	// .map(i => i.charCodeAt(0)/65536*10)

	if (input.length === symbols * bytes) data.push({ input, output: [output] })
}

function fillNulls(array, count) {
	if (array.length >= count) return array
	else return [...Array(count - array.length + 1).join('0').split('').map(i => +i), ...array]
}