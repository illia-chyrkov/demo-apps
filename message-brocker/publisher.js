const Amqp = require('amqplib/callback_api')

Amqp.connect('amqp://localhost', (err, connection) => {
	connection.createChannel((err, channel) => {
        channel.assertQueue('test.queue')
        let i = 1
        setInterval(() => {
            channel.sendToQueue('test.queue', Buffer.from(JSON.stringify({ id: i })))
            console.log(`${i} published at ${new Date().getTime()}`)
            i++
        }, 1000)
	})
})
