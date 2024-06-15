const jwt=require('jsonwebtoken')

exports.jwtmiddleware=(req,res,next)=>{
console.log("inside middleware");
//token access
const token=req.headers['access_token'].split(" ")[1]

//verify
try{
  const JWTresponse=jwt.verify(token,'smkey123')
//   console.log(JWTresponse);
  req.payload=JWTresponse._id
  next()
}
catch{
    res.status(401).json("authorization failed ! please login")
}

}