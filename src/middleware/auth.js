const jwt=require('jsonwebtoken')


const authentication=(req,res,next)=>{
    try{
    let token =req.headers["x-api-key"]
    if(!token) return res.status(400).send({status:false,message:"token must be present"});
    jwt.verify(token, 'functionUP', (err, payload) => {
      if (err) return res.status(401).send({ status: false, message: 'Authentication Failed!', Error: err.message });
    
      req.user = payload.authorId;
      next();
  });
 
    }catch(err){
      return res.status(500).send({status:false,error:err.message})
    }
}









const authorisation=(req,res,next)=>{
    try{
     const token=req.headers["x-auth-key"]
     let tokenVerify=jwt.verify(token,"functionUP")
     if(!tokenVerify.usersId===usersId) return res.status(403).send({status:false,message:"you are not authorise"})
     next()
    }catch(err){
        
    }

}

module.exports={authentication,authorisation}