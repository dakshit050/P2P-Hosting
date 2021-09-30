const express = require("express");
const app = express();
const webtorrent = require("./routes/webtorrent");
const showwebpage = require("./routes/showwebsite");
const frontend = require("./routes/frontend")
const path = require("path");
const fileUpload = require("express-fileupload");
app.use(express.urlencoded());
app.use(express.json());
app.use(fileUpload());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/hostnew', webtorrent);
app.use('/data', showwebpage);
app.use('/frontend', frontend)
app.use('/css', express.static('css'))
const PORT = 5000;
app.listen(PORT, () => {
	console.log("Server started ");
});
module.exports = app;