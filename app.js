const express = require("express");
const app = express();
const webtorrent = require("./routes/webtorrent");
const showwebpage = require("./routes/showwebsite");
const frontend = require("./routes/frontend");
const allsites = require("./routes/allsites");
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const seedAll = require("./routes/seedall");
const mongoose = require("mongoose");
const passport = require("passport");
require("./config/passportConfig");
const flash = require("connect-flash");
const session = require("express-session");
const user = require("./routes/user");
const { ensureAuthenticated } = require("./config/auth");
seedAll();
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});
mongoose.connect(
	process.env.MongoURI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	async function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Connected to database");
		}
	}
);

app.use(fileUpload());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/hostnew", ensureAuthenticated, webtorrent);
app.use("/data", ensureAuthenticated, showwebpage);
app.use("/frontend", ensureAuthenticated, frontend);
app.use("/sites", ensureAuthenticated, allsites);
app.use("/users", user);
app.use("/css", express.static("css"));
const PORT = 5000;
app.listen(PORT, () => {
	console.log("Server started ");
});
module.exports = app;
