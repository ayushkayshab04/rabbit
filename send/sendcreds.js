const amqp = require('amqplib');
const express = require("express")
const { v4: uuidv4 } = require('uuid');



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

async function sendEvent(logId,eventName,eventData){
    
    const content = {
        logId,
        eventName, 
        eventData
    }
    try{
        await channel.sendToQueue("queue" , Buffer.from(JSON.stringify(content)));
        return true
    }catch(err){
        console.log(err);
        return false
    } 
}

async function logIdAssign(req,res,next){
    req.logId = uuidv4()
    next();
}

function logInfo(logId,...others){
    console.log(`[INFO] [${new Date().toISOString()}] [${logId}]`, ...others)
}


app.post("/send", logIdAssign,async(req,res)=>{
    console.log(req.logId)
    logInfo(req.logId,req.body)

    const creds = {
        email:req.body.email,
        password:req.body.password
    }

    const addy = {
        address:req.body.address
    }

    const Ucreds = {
        _id:req.body.u_id
    }
    const ev = await sendEvent(req.logId,"SIGNUP",creds)
    const ad = await sendEvent(req.logId,"ADD_ADDRESS",addy)
    const up = await sendEvent(req.logId,"UPDATE",Ucreds)




    
    res.json({
        logId:req.logId,
    })
})


app.listen(5000,()=>{
    console.log("server started on port 5000")
})