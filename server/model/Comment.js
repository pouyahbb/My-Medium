const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CommentSchema = new Schema({
	userId: {
		type: String,
	},
	text: {
		type: String,
		required: [true, 'Each comment should have text'],
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
})

module.exports = mongoose.model('Comment', CommentSchema)
