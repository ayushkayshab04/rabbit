const amqp = require('amqplib');
const express = require("express")

const app = express();
var channel, connection;

app.use(express.json())



async function connect(){
    try{
        connection = await amqp.connect("amqp://localhost")
        channel =  await connection.createChannel();
        await channel.assertQueue("queue")
    } catch (err){
        console.log(err)
    }
}

connect();





app.post("/send",async(req,res)=>{
    
    const creds = {
        email:req.body.email,
        password:req.body.password
    }

    if(!creds)return res.send("User with given id is not found")

    await channel.sendToQueue("queue" , Buffer.from(JSON.stringify(creds)));
 
    res.send("Done")
})


app.listen(5000,()=>{
    console.log("server started on port 5000")
})