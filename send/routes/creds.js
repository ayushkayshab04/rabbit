const {logIdAssign} = require("../middleware/logid.js")
const express = require("express")
const {sendData} = require("../controller/send.js")

const router = express.Router()




router.post("/", logIdAssign,sendData)


module.exports = router