const express = require("express");
const app = express();
const webtorrent = require("./routes/webtorrent");
const showwebpage = require("./routes/showwebsite");
app.use('/hostnew', webtorrent);
app.use('/data', showwebpage);
const PORT = 5000;
app.listen(PORT, () => {
	console.log("Server started ");
});
module.exports = app;