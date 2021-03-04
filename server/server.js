const express = require('express')
require('dotenv').config({ path: 'var.env' })
const bodyParser = require('body-parser')
const cors = require('cors')

const connectDB = require('./connectDB')
const User = require('./model/User')
const Post = require('./model/Post')
const Comment = require('./model/Comment')


// Being on Graphql-Express middleware

const { graphiqlExpress, graphqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')

const { typeDefs } = require('./schema/index')
const { resolvers } = require('./resolvers/index')

connectDB()

const app = express()

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
})

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
}

app.use(cors(corsOptions))

// Create Graphiql application
app.use('/graphiql', graphiqlExpress({ endpointURL: 'graphql' }))

// Connect schema with Graphql
app.use(
	'/graphql',
	bodyParser.json(),
	graphqlExpress(() => ({
		schema,
		context: {
			User,
			Post,
			Comment
		},
	}))
)

const PORT = process.env.PORT || 4444

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
