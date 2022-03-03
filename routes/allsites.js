const Users = require("../models/users.model");
const AllSites = require("../models/websites.model");

const router = require("express").Router();
router.get("/", async function (req, res) {
	const allSites = await AllSites.find();
	res.render("home", {
		data: allSites,
	});
});

router.get("/mysites", async function (req, res) {
	const MySites = await AllSites.find({ "owner": req.session.passport.user });
	res.render("home", {
		data: MySites,
	});
});
module.exports = router;
