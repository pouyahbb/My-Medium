const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Please Provide a name.'],
		minlength: [3, 'Name should be greater than 3.'],
	},
	nickName: {
		type: String,
		required: [true, 'Please provide a nickname.'],
		unique: [true, 'This nickName already in use , Please choose another.'],
	},
	email: {
		type: String,
		required: [true, 'Please provide an email.'],
	},
	password: {
		type: String,
		required: [true, 'Please provide a password.'],
		min: [5, 'Very short password (min Character . 5)'],
		max: [5, 'Very long password (max Character . 10)'],
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please provide a passwordConfirm.'],
		validate: {
			validator: function (el) {
				return el === this.password
			},
			message: 'Password and passwordConfirm are not same.',
		},
	},
	followings: {
		type: [
			{
				type: String,
			},
		],
		default: [],
	},
	followers: {
		type: [
			{
				type: String,
			},
		],
		default: [],
	},
	sexually: {
		type: String,
		enum: ['Male', 'Female', 'None'],
		default: 'None',
	},
	posts: {
		type: [Schema.Types.ObjectId],
		ref: 'Post',
	},
	profileImage: {
		type: String,
	},
	joinDate: {
		type: Date,
		default: Date.now(),
	},
})

UserSchema.pre('save', function (next) {
	if (!this.isModified('password')) {
		next()
	}
	bcrypt.genSalt(12, (err, salt) => {
		if (err) return next(err)

		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) return next(err)
			this.password = hash
			this.passwordConfirm = hash
			next()
		})
	})
})

module.exports = mongoose.model('User', UserSchema)
