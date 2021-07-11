const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		trades: [
			{
				name: String,
				quantity: Number,
				type: { type : String },
				date: String,
				price: Number,
				close_price: Number
			}
		]
	},
	{ collection: 'users' }
)

const model = mongoose.model('UserData', UserSchema)
module.exports = model
