const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema({
	postId: {
		type: String,
	},
	sharedUser: {
		type: String,
	},
	image: {
		type: String,
		required: [true, 'Each post should have an image.'],
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	description: {
		type: String,
	},
	likes: [
		{
			type: String,
			default: [],
		},
	],
	comments: {
		type: [Schema.Types.ObjectId],
		ref: 'Comment',
	},
})

module.exports = mongoose.model('Post', PostSchema)
