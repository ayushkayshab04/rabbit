const amqp = require('amqplib');
const express = require("express")
const mongoose = require("mongoose")
const app = express();
let channel , connection ;
let email,password ;


mongoose.connect("mongodb://localhost/recDB")


const recSchema = new mongoose.Schema({
                email:{
                    type:String,
                    required:true
                },
                password:{
                    type:String
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
            const newdata = JSON.parse(Buffer.from(data.content))
       
            email = newdata.email;
            password = newdata.password;
           })
    } catch (err){
        console.log(err)
    }
}

connect();

app.post("/login", async (req,res)=>{
    const rec = await  new Rec({
        email:email,
        password:password
    })
    if(!rec) res.send("new user not created")
    
    rec.save();
    res.send(rec)

})







app.listen(3000, ()=>{
    console.log("erver started on port 3000")
})