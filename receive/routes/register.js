const express = require("express")
const router = express.Router()
const { Rec } = require("../modles/rec.js")
const { em, pass, addy} = require("../utils/rabbitMQ.js")


router.post("/", async (req,res)=>{
    try{
       const rec = await  new Rec({
       email:em,
       password:pass,
       address:addy
   })
   if(!rec) res.send("new user not created")
   
   rec.save();
   res.send(rec)
} catch(err){
   res.status(500).send(err)
}

})


module.exports = router; 