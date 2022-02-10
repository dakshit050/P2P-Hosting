const router = require("express").Router();
var WebTorrent = require("webtorrent-hybrid");
const path = require("path");
const fse = require("fs-extra");
var client = new WebTorrent();
const fs = require("fs");

function seedAll() {
	try {
		const destination = path.join(__dirname, "..", "data");

		fs.readdir(destination, function (err, files) {
			if (err) {
				return console.log("Unable to scan directory: " + err);
			}

			files.forEach(function (file) {
				client.seed(path.join(destination, file), { name: "p2p_hosting" }, async function onseed(torrent) {
					magnetURI = torrent.magnetURI.split(":")[3].split("&")[0];
					console.log(magnetURI);
				});
			});
		});
	} catch (error) {
		console.log("something went wrong...................", error);
	}
}

module.exports = seedAll;
