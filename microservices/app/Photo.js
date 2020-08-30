const mongoose = require('mongoose')

const Photo = new mongoose.Schema({
    image: String,
    author: String,
    tags: [String]
})

module.exports = mongoose.model('Photo', Photo)