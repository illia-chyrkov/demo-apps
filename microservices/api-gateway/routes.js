const express = require('express')
const axios = require('axios')
const crypto = require('crypto')

const app = express.Router()

app.post('/sign-in', async (req, res) => {
	const auth = await axios.post('http://auth/sign-in', req.body)
	res.send(auth.data)
})

app.post('/sign-up', async (req, res) => {
	const auth = await axios.post('http://auth/sign-up', req.body)
	res.send(auth.data)
})

app.get('/tags', async (req, res) => {
	const tags = await axios.get('http://app/tags')
	res.send(tags.data)
})

app.get('/photos/search/:page*?', async (req, res) => {
	const photos = await axios.get(
		'http://app/search/' +
			(req.params.page || '') +
			'?q=' +
			(req.query.q || '')
	)

	if (photos.data.photos.length > 0) photos.data.photos = photos.data.photos.map(photo => ({
		...photo,
		image: `http://localhost:9000/photos/${photo.image}`,
		original: `http://localhost:9000/original/${photo.image}`
	}))
	res.send(photos.data)
})

app.get('/photos/:page*?', async (req, res) => {
	const photos = await axios.get('http://app/' + (req.params.page || ''))
	if (photos.data.photos.length > 0) photos.data.photos = photos.data.photos.map(photo => ({
		...photo,
		image: `http://localhost:9000/photos/${photo.image}`,
		original: `http://localhost:9000/original/${photo.image}`
	}))
	res.send(photos.data)
})

app.post('/photos', checkAuth, async (req, res) => {
	const key = crypto.randomBytes(18).toString('hex')
	const buffer = Buffer.from(
		req.body.image.replace(/^data:image\/\w+;base64,/, ''),
		'base64'
	)
	const type = req.body.image.split(';')[0].split('/')[1]
	const params = {
		Bucket: 'original',
		Key: `${key}.${type}`,
		Body: buffer,
		ContentEncoding: 'base64',
		ContentType: `image/${type}`
	}
	req.s3.putObject(params, async (err, data) => {
		if (err) res.send({ error: 'Попробуйте позже' })
		else {
			req.body.author = req.auth.username
			req.body.image = `${key}.${type}`
			const photo = await axios.post('http://app', req.body)
			photo.data.image = `http://localhost:9000/original/${key}.${type}`
			photo.data.original = `http://localhost:9000/original/${key}.${type}`
			res.send(photo.data)
			req.channel.sendToQueue('photos', Buffer.from(`${key}.${type}`))
		}
	})
})

app.get((req, res) => {
	res.sendFile('public/index.html')
})

async function checkAuth(req, res, next) {
	const auth = await axios.get(
		'http://auth/' + (req.headers.authorization || '0')
	)
	if (auth.data.token) {
		req.auth = auth.data.user
		next()
	} else res.send({ error: 'Необходима авторизация' })
}

module.exports = app
