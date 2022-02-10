const AllSites = require("../models/websites.model");

const router = require("express").Router();
router.get("/", async function (req, res) {
	const allSites = await AllSites.find();
	res.render("home", {
		data: allSites,
	});
});
module.exports = router;
