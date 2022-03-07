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


app.get("/send",async(req,res)=>{
    const creds = {
        email:"ayush@abc.com",
        password:"pass"
    }

    await channel.sendToQueue("queue" , Buffer.from(JSON.stringify(creds)));
    await channel.close();
    await connection.close();
    res.send("Done")
})


// amqp.connect('amqp://localhost', function(error0, connection) {
//     if (error0) {
//         throw error0;
//     }
//     connection.createChannel(function(error1, channel) {
//         if (error1) {
//             throw error1;
//         }

//         var queue = 'hello';
//         var msg = {
//             name:"Ayush",
//             email:"ayushkayshab042gmail.com",
//             password:"password"
//         }

//         channel.assertQueue(queue)
//         channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));

//         console.log(" [x] Sent %s", msg);
//     });
// });


app.listen(5000,()=>{
    console.log("server started on port 3000")
})