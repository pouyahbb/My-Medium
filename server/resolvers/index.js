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

// fix the getall users post field that save like id but woe neede populate it

exports.resolvers = {
	Query: {
		getAllUsers: async (parent, args, { User }, info) => {
			let users = await User.find().populate({
				path: 'posts',
				model: 'Post',
			})
			console.log(users)
			return users
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
		signin: async (parent, { email, password }, { User }, info) => {
			let user = await User.findOne({ email })
			if (!user) {
				throw new Error('Invalid email or password.')
			}
			const isValidPassword = await bcrypt.compare(password, user.password)
			if (!isValidPassword) {
				throw new Error('Invalid email or password.')
			}
			return { token: createToken(user, process.env.SECRET, '1hr') }
		},
		addPost: async (parent, args, { Post, User }, info) => {
			const { sharedUser, image, description } = args
			let newPost = await new Post({
				sharedUser,
				image,
				description,
			})

			let findUser = await User.findById(sharedUser)
			findUser.posts.push(newPost)

			await newPost.save()
			await findUser.save()
			return newPost
		},
		updateUserProfile: async (parent, args, { User }, info) => {
			const {
				name,
				nickName,
				email,
				password,
				passwordConfirm,
				profileImage,
				sexually,
				_id,
			} = args

			let user = await User.findOne({ _id })

			if (!user) {
				throw new Error('User not found.')
			}

			let userExistWithEmail = await User.findOne({ email })
			if (userExistWithEmail) {
				throw new Error('Email address already exists.')
			}
			let userExistWithNickName = await User.findOne({ nickName })
			if (userExistWithNickName) {
				throw new Error('NickName already exists')
			}

			user.name = name || user.name
			user.nickName = nickName || user.nickName
			user.email = email || user.email
			user.password = password || user.password
			user.passwordConfirm = passwordConfirm || user.passwordConfirm
			user.profileImage = profileImage || user.profileImage
			user.sexually = sexually || user.sexually

			await user.save()
			return {
				token: createToken(user, process.env.SECRET, '1hr'),
			}
		},
		deleteUser: async (parent, { _id }, { User }, info) => {
			let user = await User.findOneAndRemove({ _id })
			if (!user) {
				throw new Error('User not found.')
			}
			

			return user._id
		},
	},
}
