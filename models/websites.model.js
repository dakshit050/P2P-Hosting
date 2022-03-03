const mongoose = require("mongoose");
const AllSitesSchema = new mongoose.Schema(
	{
		Name: { type: String, default: null },
		infoHash: { type: String, default: null },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
	},
	{
		timestamps: true,
	}
);

const AllSites = mongoose.model("AllSites", AllSitesSchema);

module.exports = AllSites;
