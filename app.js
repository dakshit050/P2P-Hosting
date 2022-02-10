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
seedAll();
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
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
app.use("/hostnew", webtorrent);
app.use("/data", showwebpage);
app.use("/frontend", frontend);
app.use("/allsites", allsites);
app.use("/css", express.static("css"));
const PORT = 5000;
app.listen(PORT, () => {
	console.log("Server started ");
});
module.exports = app;
