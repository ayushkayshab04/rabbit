const express = require("express")
const Rec = require("../models/user.js")
const router = express.Router();

let email,password, addy,u_id,d_id ;

const amqp = require("amqplib");

let channel , connection ;


async function connect(){
    try{
        connection = await amqp.connect("amqp://localhost")
        channel =  await connection.createChannel();
        await channel.assertQueue("queue")

       
        channel.consume("queue" , data=>{
            const eventData = JSON.parse(Buffer.from(data.content))
            
            console.log({eventData})
            HandleEvent(eventData);

           }, {
            noAck:true,
        })

    } catch (err){
        console.log(err)
    }
}

connect();

function HandleEvent(eventMetaData){
    const {eventName , eventData } = eventMetaData
    switch (eventName) {
        case "SIGNUP": 
            signup(eventData)
            break;
        case "ADD_ADDRESS":
            addressFunc(eventData)
            break;
        case "UPDATE":
            update(eventData)
            break;    
        case "DELETE":
            deleteU(eventData)
        default:
            break;
    }
}


async function signup(signUpData){
    console.log("signup event received", signUpData)
    email = signUpData.email,
    password= signUpData.password

}

async function addressFunc(addressData){
    console.log("Address received",addressData)
    addy = addressData.address

}

async function update(updateData){
    console.log("Update data recevied",updateData)
    u_id = updateData._id

}

async function deleteU(deleteData){
    console.log("delete data recived",deleteData)
    d_id= deleteData._id
    
}




router.post("/signup", async (req,res)=>{
     try{
        const rec = await  new Rec({
        email:email,
        password:password,
        address:addy
    })
    if(!rec) res.send("new user not created")
    
    rec.save();
    res.send(rec)
} catch(err){
    res.status(500).send(err)
}

})

router.patch("/update",async (req,res)=>{
    try{
        const rec = await Rec.findByIdAndUpdate({_id:u_id},{email:req.body.email, password:req.body.password},{new:true})
        if(!rec)res.status(404).send("Data with given id is not found")
        
        res.send("User updated")
    }catch(err){
        console.log(err)
    }
})



router.delete("/delete",async(req,res)=>{
    try{
        const rec = await Rec.findByIdAndRemove(d_id)
        if(!rec)res.status(404).send("No user found with the given id")
        res.send(rec)
    }catch(err){
        res.status(500).send(err)
    }
})



module.exports = router;