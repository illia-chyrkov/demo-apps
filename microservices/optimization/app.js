const S3 = require('aws-sdk/clients/s3')
const Amqp = require('amqplib/callback_api')
const sharp = require('sharp')
const http = require('http')
const fs = require('fs')
const mkdirp = require('mkdirp')

const s3 = new S3({
	region: 'us-east-1',
	accessKeyId: 'root',
	secretAccessKey: 'password',
	endpoint: 'http://file-storage:9000',
	s3ForcePathStyle: true,
	signatureVersion: 'v4'
})

s3.createBucket({ Bucket: 'photos', ACL: 'public-read-write' }, () => {
	let policy = {
		Version: '2012-10-17',
		Statement: [
			{
				Action: 's3:GetObject',
				Effect: 'Allow',
				Principal: { AWS: '*' },
				Resource: ['arn:aws:s3:::photos/*'],
				Sid: 'Public'
			}
		]
	}

	s3.putBucketPolicy(
		{ Bucket: 'photos', Policy: JSON.stringify(policy) },
		() => {
			Amqp.connect('amqp://message-broker', (err, connection) => {
				connection.createChannel((err, channel) => {
					channel.assertQueue('photos')
					channel.prefetch(1)
					channel.consume('photos', async msg => {
						let file = msg.content.toString()

						await mkdirp(__dirname + '/original')
						const stream = fs.createWriteStream(
							__dirname + '/original/' + file
						)
						http.get(
							'http://file-storage:9000/original/' + file,
							async response => {
								response.pipe(stream)
								stream.on('finish', function() {
									stream.close(async () => {
										const base64data = await sharp(
											__dirname + '/original/' + file
										)
											.resize(800, 800, { fit: 'cover' })
											.toBuffer()

										const params = {
											Bucket: 'photos',
											Key: file,
											Body: base64data
										}
										s3.putObject(params, (err, data) => {
											fs.unlink(
												__dirname + '/original/' + file,
												err => {
													console.log(err)
												}
											)
											channel.ack(msg)
										})
									})
								})
							}
						)
					})
				})
			})
		}
	)
})
