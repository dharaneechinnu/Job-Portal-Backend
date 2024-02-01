const jwt = require('jsonwebtoken')
const User = require('../Model/User')

const VerifyToken = (req,res,next) =>{
    const AuthHeader = req.headers.authorization

    if(!AuthHeader)
    {
        return res.status(401).json({message:"missing Token"})
    }
   const token = AuthHeader.split(" ")[1];
   
   jwt.verify(token,process.env.ACCES_TOKEN,async(err,decode)=>{
    if(err)
    {
        return res.status(403).json({message: "Invaild token"})    
    }
    const user = await User.findOne({_id: decode.id})
    if(!user)
    {
        return res.status(404).json({message:"user is not found"})
    }
    req.user= user;
    next()
   })

}
module.exports = VerifyToken