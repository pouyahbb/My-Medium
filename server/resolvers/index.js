const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const createToken = (user, secret, expiresIn) => {
	const {
		name,
		nickName,
		password,
		passwordConfirm,
		profileImage,
		sexually,
		email,
		followings,
		followers,
		posts,
		_id,
	} = user
	return jwt.sign(
		{
			name,
			nickName,
			password,
			passwordConfirm,
			profileImage,
			sexually,
			email,
			followings,
			followers,
			posts,
			_id,
		},
		secret,
		{ expiresIn }
	)
}

exports.resolvers = {
	Query: {
		hello: () => {
			return 'Hello world'
		},
	},
	Mutation: {
		signup: async (parent, args, { User }, info) => {
			const {
				name,
				nickName,
				email,
				password,
				passwordConfirm,
				profileImage,
				sexually,
			} = args
			const userExistWithEmail = await User.findOne({ email })
			const userExistWithNickName = await User.findOne({ nickName })
			if (userExistWithEmail || userExistWithNickName) {
				throw new Error(
					'User already exist. Please choose another email or nickName'
				)
			}
			if (password !== passwordConfirm) {
				throw new Error('Password and passwordConfirm are not same.')
			}
			let newUser = await new User({
				name,
				nickName,
				password,
				passwordConfirm,
				profileImage,
				sexually,
				email,
			})
			newUser._id = newUser._id
			newUser.followings = []
			newUser.followers = []
			newUser.posts = []

			newUser.save()
			return { token: createToken(newUser, process.env.SECRET, '1hr') }
		},
	},
}
