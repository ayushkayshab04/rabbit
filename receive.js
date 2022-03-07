const amqp = require('amqplib');
const express = require("express")
const app = express();
var channel , connection ;


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

app.post("/login", async (req,res)=>{
    channel.consume("queue" , data=>{
      console.log((Buffer.from(JSON.parse(data.content))))
 
    })
    res.send("Done")
})







app.listen(3000, ()=>{
    console.log("erver started on port 3000")
})