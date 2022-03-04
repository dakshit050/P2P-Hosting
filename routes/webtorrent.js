const router = require("express").Router();
var WebTorrent = require("webtorrent-hybrid");
const path = require("path");
const fse = require("fs-extra");
var client = new WebTorrent();
const AllSites = require("../models/websites.model");
const fs = require("fs");
const Users = require("../models/users.model");
router.get("/:id", async (req, res) => {
	var Id = req.params.id;
	try {
		if (!fs.existsSync(path.join(__dirname, "..", "data", Id))) {
			client.add(
				"magnet:?xt=urn:btih:" + Id + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
				async function (torrent) {
					if (!fs.existsSync(path.join(__dirname, "..", "data", Id))) {
						fs.mkdir(path.join(__dirname, "..", "data", Id), (err) => {
							if (err) {
								return console.error(err);
							}
							torrent.files.forEach((element) => {
								element.getBuffer(async function (err, buffer) {
									if (err) throw err;
									fs.appendFile(path.join(__dirname, "..", "data", Id, element.name), buffer, function (err) {
										if (err) throw err;
										console.log("Saved!");
									});
								});
							});
						});
					}
					//const user = await Users.findById(req.session.passport.user);
					//user.MyDownloads.push(Id);
					//await user.save();
					res.send("Your site downloaded please refresh to see it");
				}
			);
		} else {
			res.redirect(`http://localhost:5000/data/${Id}/`);
		}
	} catch (error) {
		res.send(error);
	}
});

router.post("/", (req, res) => {
	try {
		let input = req.body.path;
		let name = req.body.name;
		let magnetURI;
		client.seed(input, { name: "p2p_hosting" }, async function onseed(torrent) {
			magnetURI = torrent.magnetURI.split(":")[3].split("&")[0];
			const source = input;
			const destination = path.join(__dirname, "..", "data", magnetURI);
			if (!fs.existsSync(path.join(__dirname, "..", "data", magnetURI))) {
				await fse.mkdir(destination);
				await fse.copy(source, destination);
				let hostNew = AllSites();
				hostNew.Name = name;
				hostNew.infoHash = magnetURI;
				hostNew.owner = req.session.passport.user;
				hostNew.save();
			}
			res.redirect(`http://localhost:5000/data/${magnetURI}/`);
		});
	} catch (error) {
		console.log("Something went wrong..........", error);
	}
});

module.exports = router;
