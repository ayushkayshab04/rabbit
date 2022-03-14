const express = require("express")
const Rec = require("../models/user.js")
const {addUser,updateUser,deleteUser} = require("../controller/signup.js")
const router = express.Router();


router.post("/signup",addUser)
router.patch("/update",updateUser )
router.delete("/delete",deleteUser)
module.exports = router;