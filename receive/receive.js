const amqp = require('amqplib');
const express = require("express")



const user = require("./route/user.js")


const app = express();





app.use(express.json())


app.use("/user",user)









app.listen(3000, ()=>{
    console.log("erver started on port 3000")
})