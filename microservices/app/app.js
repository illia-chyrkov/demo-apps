const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const redis = require('redis')
const Photo = require('./Photo')

const app = express()
const client = redis.createClient('redis://cache-database:6379')

const PHOTOS_PER_PAGE = 9

mongoose.connect('mongodb://app-database:27017/app', { useNewUrlParser: true })

app.use(bodyParser.json())

// Популярные теги
app.get('/tags', async (req, res) => {
	client.get('tags', async (err, reply) => {
		if (reply) res.send({ tags: JSON.parse(reply) })
		else {
			const photos = await Photo.find({})
				.limit(500)
				.lean()

			let tags = photos.reduce((tags, photos) => {
				photos.tags.forEach(tag => {
					if (tags[tag]) tags[tag]++
					else tags[tag] = 1
				})
				return tags
			}, {})
			tags = Object.entries(tags).map(([key, value]) => ({ key, value }))
			tags.sort((a, b) =>
				a.value < b.value ? 1 : b.value < a.value ? -1 : 0
			)
			tags = tags.map(tag => tag.key).slice(0, 9)

			res.send({ tags })

			client.set('tags', JSON.stringify(tags), 'EX', 60)
		}
	})
})

// Поиск по тегам
app.get('/search/:page*?', async (req, res) => {
	const searchTags = req.query.q.split(' ') || []
	const total = Math.ceil(
		(await Photo.count({ tags: { $in: searchTags } })) / PHOTOS_PER_PAGE
	)
	const photos = await Photo.find({ tags: { $in: searchTags } })
		.skip((+req.params.page - 1 || 0) * PHOTOS_PER_PAGE)
		.limit(PHOTOS_PER_PAGE)
	res.send({ photos, page: +req.params.page || 1, total })
})

// Последние фото
app.get('/:page*?', async (req, res) => {
	const total = Math.ceil((await Photo.count()) / PHOTOS_PER_PAGE)
	const photos = await Photo.find({})
		.skip((+req.params.page - 1 || 0) * PHOTOS_PER_PAGE)
		.limit(PHOTOS_PER_PAGE)
	res.send({ photos, page: +req.params.page || 1, total })
})

// Добавить фото
app.post('/', async (req, res) => {
	let photo = new Photo(req.body)
	await photo.save()
	res.send(photo)
})

app.listen(80, () => {
	console.log('app started')
})
