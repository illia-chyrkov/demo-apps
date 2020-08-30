const express = require('express')
const pdf = require('html-pdf')
const nunjucks = require('nunjucks')

const options = {
    height: '90px',
	width: '728px',
    base: 'file://' + __dirname
}
const app = express()

app.use((req, res) => {
	const html = nunjucks.render('./index.html', {
		base: options.base,
		cta: req.query.cta || 'Только до конца марта'
	})
	pdf.create(html, options).toStream((err, pdfStream) => {
		if (err) {
			console.log(err)
			return res.sendStatus(500)
		} else {
			res.statusCode = 200
			pdfStream.on('end', () => {
				return res.end()
			})
			pdfStream.pipe(res)
		}
	})
})

app.listen(process.env.PORT || 3000)
