const express = require("express")
const send = require("./routes/creds.js")
const {connect} = require("./controller/send.js")


connect();
const app = express();


app.use(express.json())

app.use("/send",send)




app.listen(5000,()=>{
    console.log("server started on port 5000")
})