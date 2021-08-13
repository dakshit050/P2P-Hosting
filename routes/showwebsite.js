const router=require('express').Router();
const path= require('path');
router.get('/:id',(req,res)=>{
    console.log(path.join(__dirname,'..','data',req.params.id,'index.html'));
    res.sendFile(path.join(__dirname,'..','data',req.params.id,'index.html'));
});

module.exports=router;