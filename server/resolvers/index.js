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
		getAllUsers: async (parent, args, { User }, info) => {
			let users = await User.find()
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
		addPost : async ( parent , args , { Post , User } , info)  => {
			const { sharedUser , image , description } = args
			let newPost = await new Post({
				sharedUser,
				image,
				description,
			})
			let findUser = await User.findById(sharedUser)
			findUser.posts.push(newPost)
			
			await newPost.save()
			await findUser.save()
			console.log(newPost)
			return newPost;
		}
	},
}
