const router= require("express").Router();
var WebTorrent = require('webtorrent-hybrid')
const path = require('path');
var client = new WebTorrent();
const fs = require('fs');
router.get('/:id',async (req,res)=>{
        try {
            if (!fs.existsSync(path.join(__dirname,'..','data',req.params.id))){
                client.add('magnet:?xt=urn:btih:'+req.params.id +'&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com', function (torrent) {
                    if (!fs.existsSync(path.join(__dirname,'..','data',req.params.id))){
                        fs.mkdir(path.join(__dirname,'..','data',req.params.id), (err) => {
                            if (err) {
                                return console.error(err);
                            }
                            torrent.files.forEach(element => {
                                element.getBuffer(function (err, buffer) {
                                    if (err) throw err
                                    fs.appendFile(path.join(__dirname,'..','data',req.params.id,element.name),buffer, function (err) {
                                        if (err) throw err;
                                        console.log('Saved!');
                                    }); 
                                });
                            });
                        });
                    }
                    res.sendFile(path.join(__dirname,'..','data',req.params.id,'index.html'));
                }); 
            }else{
                res.redirect(`http://localhost:5000/data/${req.params.id}/`);
            }  
        } catch (error) {
            res.send(error);
        }
});
router.post('/',(req,res)=>{
    var input=path.join("..","..","portfolio");
    console.log(input);
    client.seed(input,function onseed (torrent) {
        magnetURI = torrent.magnetURI.split(':')[3].split('&')[0]
        console.log(magnetURI);
      });
      res.send("Done");
});


module.exports=router;