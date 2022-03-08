const amqp = require('amqplib');
const express = require("express")
const app = express();
var channel, connection;

app.use(express.json())


async function connect(){
    try{
        connection = await amqp.connect("amqp://localhost")
        channel =  await connection.createChannel();
        await channel.assertQueue("address")
    } catch (err){
        console.log(err)
    }
}

connect();


app.get("/send",async(req,res)=>{
    const addy = {
        address:"#25 ningth street"
    }

    await channel.sendToQueue("address" , Buffer.from(JSON.stringify(addy)));

    res.send("Done")
})




app.listen(5002,()=>{
    console.log("Server started on port 5002")
})