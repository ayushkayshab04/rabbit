const amqp = require('amqplib');
const express = require("express")
const app = express();
let channel , connection ;
let email,password ;


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
     const newdata = JSON.parse(Buffer.from(data.content))

     email = newdata.email;
     password = newdata.password;
    })


    res.send(`recived data email : ${email}, password: ${password}`)


})







app.listen(3000, ()=>{
    console.log("erver started on port 3000")
})