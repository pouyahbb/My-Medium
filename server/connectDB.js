const mongoose = require('mongoose')

const connectDB = async () => {
	await mongoose
		.connect(
			'mongodb+srv://pouyahobbi:JIz6VHQloWEh6TkN@cluster0.jbgi1.mongodb.net/pouyahobbi?retryWrites=true&w=majority',
			{
				useCreateIndex: true,
				useUnifiedTopology: true,
				useNewUrlParser: true,
				useFindAndModify : true
			}
		)
		.then(() => {
			console.log('MongoDB Connected Successfully.')
		})
		.catch((err) => {
			console.log('Error : ' + err.message)
			process.exit(1)
		})
}

module.exports = connectDB
