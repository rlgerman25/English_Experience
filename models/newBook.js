const mongoose = require("mongoose");  

//BOOK SCHEMA SETUP
const  bookCreationSchema = new mongoose.Schema({
	bookName: String,
	bookAuthor: String,
	bookImage: String,
	bookFavoritePart: String,
	cost: Number,
	createdAt: {type: Date, default: Date.now},
	sellDescription: String, 
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
			},
		username: String
		},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("NewBook", bookCreationSchema);