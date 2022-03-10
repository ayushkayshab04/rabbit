const mongoose = require("mongoose")


mongoose.connect("mongodb://localhost/recDB")


const recSchema = new mongoose.Schema({
                email:{
                    type:String,
                    required:true,
                    unique:true
                },
                password:{
                    type:String
                },
                address:{
                    type:String
                },
                createdAt:{
                    type:Date,
                    default:Date.now()
                }
})

const Rec = mongoose.model("rec",recSchema)

module.exports = {
    Rec,
}