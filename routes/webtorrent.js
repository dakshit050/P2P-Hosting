const router = require("express").Router();
var WebTorrent = require('webtorrent-hybrid')
const path = require('path');
const fse = require('fs-extra');
var client = new WebTorrent();
const fs = require('fs');
router.get('/:id',async (req,res)=>{
    var Id=req.params.id;
        try {
            if (!fs.existsSync(path.join(__dirname,'..','data',Id))){
                client.add('magnet:?xt=urn:btih:'+Id +'&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com', function (torrent) {
                    if (!fs.existsSync(path.join(__dirname,'..','data',Id))){
                        fs.mkdir(path.join(__dirname,'..','data',Id), (err) => {
                            if (err) {
                                return console.error(err);
                            }
                            torrent.files.forEach(element => {
                                element.getBuffer(async function (err, buffer) {
                                    if (err) throw err
                                    fs.appendFile(path.join(__dirname,'..','data',Id,element.name),buffer, function (err) {
                                        if (err) throw err;
                                        console.log('Saved!');
                                    }); 
                                });
                            });
                        });
                    }
                    res.send("Your site downloaded please refresh to see it");
                }); 
            }else{
                res.redirect(`http://localhost:5000/data/${Id}/`);
            }  
        } catch (error) {
            res.send(error);
        }
});
router.post('/', (req, res) => {
    //var allfile=req.files;
  //  var input = path.join("..","..","webdev","Demo");
    var input = req.body.path;
   /*  console.log(path); */
    let magnetURI;
    client.seed(input, async function onseed(torrent) {
        magnetURI = torrent.magnetURI.split(':')[3].split('&')[0]
        const source = input;
        const destination = path.join(__dirname, '..', 'data', magnetURI);
        await fse.mkdir(destination);
        /* allfile.file.forEach(input_file=>{
            fs.writeFile(path.join(destination,input_file.name),input_file.data.toString(), (err) => {
                if(!err) {
                    console.log('Data written')
                    }
            });
        }) */
        await fse.copy(source, destination);
        res.redirect(`http://localhost:5000/data/${magnetURI}/`);
    });
});


module.exports = router;