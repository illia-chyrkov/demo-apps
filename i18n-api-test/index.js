const express = require('express')
const bodyParser = require('body-parser')
const Boom = require('@hapi/boom')
const i18n = require('i18n')
const { checkSchema, validationResult } = require('express-validator')

const app = express()

i18n.configure({
    locales:['en', 'ru'],
    defaultLocale: 'en',
    queryParameter: 'language',
    directory: __dirname + '/locales'
})

app.use(bodyParser.json())
app.use(i18n.init)

const permissions = (req, res, next) => {
	try {
        // throw new Error()
		next()
	} catch (err) {
		next(Boom.unauthorized(res.__('denied')))
	}
}

const validation = checkSchema({
	id: {
        in: ['query'],
        errorMessage: (value, { req }) => {
            return req.__('id_not_set')
        },
		// errorMessage: i18n.__('id_not_set'),
		isInt: true,
		toInt: true
	},
	message: {
		in: ['query'],
		isLength: {
            errorMessage: (value, { req }) => {
                return req.__('message_not_set')
            },
			// errorMessage: i18n.__('message_not_set'),
			options: { min: 1 }
		}
	}
}) 

const controller = (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
            next(Boom.badRequest(errors.errors[0].msg)) // JSON.stringify(errors.errors)
            return
        }

        // throw new Error()
		res.send({ id: req.query.id, message: req.query.message })
	} catch (err) {
		next(Boom.badRequest(err.message))
	}
}

app.get('/', permissions, validation, controller)

app.use((req, res, next) => {
	next(Boom.notFound(res.__('not_found')))
})

app.use((err, req, res, next) => {
	if (!err.isBoom)
		err = Boom.boomify(err, {
			statusCode: 500,
			message: res.__('error')
		})
	if (err.isServer) console.error(err)

	return res.status(err.output.statusCode).json(err.output.payload)
})

const server = app.listen(process.env.PORT || 3000, () =>
	console.info('Server listening on port ' + server.address().port)
)

module.exports = app
