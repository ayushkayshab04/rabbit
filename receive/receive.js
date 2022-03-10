const amqp = require('amqplib');
const express = require("express")
const mongoose = require("mongoose")
const app = express();
let channel , connection ;
let email,password, addy,u_id,d_id ;


mongoose.connect("mongodb://localhost/recDB")


const recSchema = new mongoose.Schema({
                email:{
                    type:String,
                    required:true,
                    unique:true
                },
                password:{
                    type:String
                },
                createdAt:{
                    type:Date,
                    default:Date.now()
                }
})

const Rec = mongoose.model("rec",recSchema)

app.use(express.json())

async function connect(){
    try{
        connection = await amqp.connect("amqp://localhost")
        channel =  await connection.createChannel();
        await channel.assertQueue("queue")

       
        channel.consume("queue" , data=>{
            const eventData = JSON.parse(Buffer.from(data.content))
            
            console.log({eventData})
            HandleEvent(eventData);
            // email = newdata.email;
            // password = newdata.password;
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
    address = addressData.address

}

async function update(updateData){
    console.log("Update data recevied",updateData)
    u_id = updateData.u_id


}



app.post("/login", async (req,res)=>{
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
    res.status(500).send()
}

})

app.delete("/delete",async(req,res)=>{
    try{
        const rec = Rec.findByIdAndDelete
    }catch(err){
        res.status(500).send(err)
    }
})

app.patch("/update",async (req,res)=>{
    try{
        const rec = await Rec.findByIdAndUpdate({_id:u_id},{email:req.body.email, password:req.body.password},{new:true})
        if(!rec)res.status(404).send("Data with given id is not found")
        
        res.send("User updated")
    }catch(err){
        console.log(err)
    }
})






app.listen(3000, ()=>{
    console.log("erver started on port 3000")
})