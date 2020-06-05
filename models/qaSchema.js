const mongoose = require("mongoose");

const 	questionsAndAnswersSchema = new mongoose.Schema({
		question: String,
		image: String,
		url: String,
		createdAt: {type: Date, default: Date.now},
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

module.exports = mongoose.model("QA", questionsAndAnswersSchema);