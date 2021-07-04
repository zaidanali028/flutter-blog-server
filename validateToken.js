require("dotenv").config()
const jwt=require("jsonwebtoken")

let validateToken=(req,res,next)=>{
    let token=req.headers['authorization']
    token=token.slice(7,token.length)

    if(token){
        jwt.verify(token,process.env.JWT_SEC,(err,decrypted)=>{
            if(err){
                return res.status(403).json({
                    status:false,
                    msg:"token invalid"
                })
            }
            req.decrypted = decrypted
            next()
        })
    }
   else{
    return res.status(403).json({
        status:false,
        msg:"token not provided"
    })
   }
}



module.exports= {validateToken}