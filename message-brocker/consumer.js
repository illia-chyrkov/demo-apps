const Amqp = require('amqplib/callback_api')
const exec = require('child_process').execSync

const sleep = time => (
	(time = parseInt(time)), time > 0 ? exec(`sleep ${time}`) : null
)

Amqp.connect('amqp://localhost', (err, connection) => {
	connection.createChannel((err, channel) => {
		channel.assertQueue('test.queue')
		channel.prefetch(1)
		channel.consume('test.queue', msg => {
			let message = JSON.parse(msg.content.toString())
			console.log(`${message.id} consumed at ${new Date().getTime()}`)
			sleep(1)
			channel.ack(msg)
		})
	})
})
