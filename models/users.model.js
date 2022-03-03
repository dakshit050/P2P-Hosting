const mongoose = require("mongoose");
const User = new mongoose.Schema(
	{
		Name: { type: String, default: null },
		Email: { type: String, default: null },
		Password: { type: String, default: null },
		MyDownloads: [{ type: mongoose.Schema.Types.ObjectId, ref: "AllSites" }],
	},
	{
		timestamps: true,
	}
);

const Users = mongoose.model("Users", User);

module.exports = Users;
