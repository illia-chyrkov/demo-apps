const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const crypto = require('crypto')

const app = express()
const sequelize = new Sequelize(
	'postgres://root:password@auth-database:5432/auth'
)

app.use(bodyParser.json())

class User extends Sequelize.Model {}
User.init(
	{
		username: { type: Sequelize.STRING, unique: true },
		email: { type: Sequelize.STRING, unique: true },
		password: Sequelize.STRING
	},
	{ sequelize, modelName: 'user' }
)

app.post('/sign-in', async (req, res) => {
	req.body.password = crypto
		.createHash('md5')
		.update(req.body.password)
		.digest('hex')

	try {
		let user = await User.findOne({
			where: { email: req.body.email, password: req.body.password }
		})
	
		user = user.toJSON()
		delete user.password
		delete user.createdAt
		delete user.updatedAt
	
		const token = jwt.sign(user, 'secret')
		res.send({ user, token })
	} catch (err) {
		res.send({ error: 'Логин или пароль неверные' })
	}
})

app.post('/sign-up', async (req, res) => {
	req.body.password = crypto
		.createHash('md5')
		.update(req.body.password)
		.digest('hex')

	try {
		let user = await User.create(req.body)

		user = user.toJSON()
		delete user.password
		delete user.createdAt
		delete user.updatedAt

		const token = jwt.sign(user, 'secret')
		res.send({ user, token })
	} catch (err) {
		res.send({ error: 'Пользователь уже зарегистрирован' })
	}
})

app.get('/:token', async (req, res) => {
	jwt.verify(req.params.token, 'secret', (err, user) => {
		res.send({ user, token: req.params.token })
	})
})

sequelize.sync().then(() => {
	app.listen(80, () => {
		console.log('auth started')
	})
})
