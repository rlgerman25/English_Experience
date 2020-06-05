const mongoose = require("mongoose");  

//ALUMNI SCHEMA SETUP
const 	alumniCreationSchema = new mongoose.Schema({
		alumniName: String,
		alumniImage: String,
		alumniDescription: String, 
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

module.exports = mongoose.model("Alumn", alumniCreationSchema);