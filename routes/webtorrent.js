const router = require("express").Router();
var WebTorrent = require('webtorrent-hybrid')
const path = require('path');
const fse = require('fs-extra');
var client = new WebTorrent();
const fs = require('fs');
router.get('/:id', async (req, res) => {
    var Id = req.params.id;
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'data', Id))) {
            client.add('magnet:?xt=urn:btih:' + Id + '&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com', function (torrent) {
                console.log("Get it");
                if (!fs.existsSync(path.join(__dirname, '..', 'data', Id))) {
                    fs.mkdir(path.join(__dirname, '..', 'data', Id), (err) => {
                        if (err) {
                            return console.error(err);
                        }
                        torrent.files.forEach(element => {
                            element.getBuffer(function (err, buffer) {
                                if (err) throw err
                                fs.appendFile(path.join(__dirname, '..', 'data', Id, element.name), buffer, function (err) {
                                    if (err) throw err;
                                    console.log('Saved!');
                                });
                            });
                        });
                    });
                }
                res.sendFile(path.join(__dirname, '..', 'data', Id, 'index.html'));
            });
        } else {
            res.redirect(`http://localhost:5000/data/${Id}/`);
        }
    } catch (error) {
        res.send(error);
    }
});
router.post('/', (req, res) => {
    var input = path.join("..", "..", "Demo");
    let magnetURI;
    client.seed(input, async function onseed(torrent) {
        magnetURI = torrent.magnetURI.split(':')[3].split('&')[0]
        const source = input;
        const destination = path.join(__dirname, '..', 'data', magnetURI);
        /* const tmp = "tmp-a11b23bsf3"; // <- assume randomized to not conflict */

        await fse.mkdir(destination);
        await fse.copy(source, destination);
        res.redirect(`http://localhost:5000/data/${magnetURI}/`);
    });
});


module.exports = router;