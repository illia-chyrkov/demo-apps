const express = require('express')
const bodyParser = require('body-parser')
const S3 = require('aws-sdk/clients/s3')
const Amqp = require('amqplib/callback_api')
const routes = require('./routes')

const app = express()
const s3 = new S3({
	region: 'us-east-1',
	accessKeyId: 'root',
	secretAccessKey: 'password',
	endpoint: 'http://file-storage:9000',
	s3ForcePathStyle: true,
	signatureVersion: 'v4'
})

app.use(express.static('public'))
app.use(bodyParser.json({ limit: 1024102420, type: 'application/json' }))

Amqp.connect('amqp://message-broker', (err, connection) => {
	connection.createChannel((err, channel) => {
		channel.assertQueue('photos')

		app.use((req, res, next) => {
			req.channel = channel
			req.s3 = s3
			next()
		})

		app.use(routes)

		s3.createBucket(
			{ Bucket: 'original', ACL: 'public-read-write' },
			() => {
				let policy = {
					Version: '2012-10-17',
					Statement: [
						{
							Action: 's3:GetObject',
							Effect: 'Allow',
							Principal: { AWS: '*' },
							Resource: ['arn:aws:s3:::original/*'],
							Sid: 'Public'
						}
					]
				}

				s3.putBucketPolicy(
					{ Bucket: 'original', Policy: JSON.stringify(policy) },
					() => {
						app.listen(80, () => {
							console.log('api-gateway started')
						})
					}
				)
			}
		)
	})
})
