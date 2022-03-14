const express = require("express")
const {connect} = require ("./controller/signup.js")
const user = require("./route/user.js")

connect();

const app = express();





app.use(express.json())


app.use("/user",user)









app.listen(3000, ()=>{
    console.log("erver started on port 3000")
})