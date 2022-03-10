const amqp = require('amqplib');
const express = require("express")
const mongoose = require("mongoose")
const {Rec} = require("./modles/rec.js")
const register = require("./routes/register.js")
const { connect } = require("./utils/rabbitMQ.js")
const app = express();

app.use(express.json())

connect();





app.use("/signup",register)









app.listen(3000, ()=>{
    console.log("erver started on port 3000")
})