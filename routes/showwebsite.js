const router=require('express').Router();
const path= require('path');
router.get('/:id',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','data',req.params.id,'index.html'));
});

module.exports=router;