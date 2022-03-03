const Users = require("../models/users.model");
const AllSites = require("../models/websites.model");

const router = require("express").Router();
router.get("/", async function (req, res) {
  const allSites = await AllSites.find();
  const currentUser = await Users.findById({ _id: req.session.passport.user });
  res.render("home", {
    data: allSites,
    currentUser: currentUser,
    isMySites: false,
  });
});

router.get("/mysites", async function (req, res) {
  const MySites = await AllSites.find({ owner: req.session.passport.user });
  const currentUser = await Users.findById({ _id: req.session.passport.user });
  res.render("home", {
    data: MySites,
    currentUser: currentUser,
    isMySites: true,
  });
});
module.exports = router;
