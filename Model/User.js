const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    Name:String,
    email:String,
    password:String,
})

const usermodel = mongoose.model("UserLogin",userSchema)
module.exports= usermodel