const router = require("express").Router();
const Users = require("../models/users.model");

router.get("/", async function (req, res) {
  const currentUser = await Users.findById({ _id: req.session.passport.user });

  res.render("index", {
    currentUser: currentUser,
  });
});
module.exports = router;
