const users = require("../models/userModel")
const bcrypt = require("bcrypt")
const posts = require("../models/postModel")
const images=require("../models/PicModel")
const jwt=require('jsonwebtoken')

exports.register = async (req,res)=>{
    const {Name,userName,email,password}=req.body

try{  //to resolve run time errorrs 
    const existingUser = await users.findOne({email})
    if(existingUser){
       res.status(400).json("Registration only occurs once.")
    }
    else{
       const newUser=new users({
           Name,userName,email,password,city:"",bio:"",profile:""
       })
   
       await newUser.save()
       res.status(200).json(newUser)
    } 
}
catch(err){ // any error occured.then what is the next move 

    res.status(401).json(` Register Api failed.! ${err}`)
}
}


exports.login = async (req,res)=>{
    const {email,password}=req.body
try{
    const existingUser= await users.findOne({email,password})
    if(existingUser){

       const token= jwt.sign({_id:existingUser._id},"smkey123")
       
        res.status(200).json({
            user:existingUser,
            token
        })
    }
    else{
        res.status(400).json("Incorrect user email or password")
    }

}
catch(err){
    res.status(401).json("Login api failed.!")
}
}

exports.updateuser =async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){

       if(req.body.password){
        try{
            const salt = await bcrypt.genSalt(10)
            req.body.password=await bcrypt.hash(req.body.password,salt)
        }catch(err){
            return res.status(500).json(err)
        }
       }
       try{
        const user = await users.findByIdAndUpdate(req.params.id,{
            $set:req.body,
        })
        res.status(200).json("Account has been updated")
       }catch(err){
        return res.status(401).json(err)

       }

    }else{
        return res.status(403).json("you can update only your account")
    }
}

exports.deleteuser =async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
       try{
        const user = await users.findByIdAndDelete(req.params.id)
        res.status(200).json("Account deleted successfully")
       }catch(err){
        return res.status(401).json(err)

       }

    }else{
        return res.status(403).json("Account delete failed !")
    }
}

exports.getauser=async(req,res)=>{
    const userId=req.query.userId;
    const userName=req.query.userName
    try{
      const user= userId ? await users.findById(userId) : await users.findOne({userName: userName})
      const{password,updatedAt,...other}=user._doc
      res.status(200).json(other)
    }catch(err){
        res.status(401).json(err)
    }
}

exports.followauser=async(req,res)=>{
    // console.log(req.params);
    // console.log(req.body.userId , req.params.id);
    if(req.body.userId !== req.params.id){
try{

    const user = await users.findById(req.params.id)
    const currentUser = await users.findById(req.body.userId)
  if(!user.followers.includes(req.body.userId)){
    await user.updateOne({$push:{followers:req.body.userId}})
    await currentUser.updateOne({$push:{followings:req.params.id}})
    res.status(200).json("followed successfully")
  }
  else{
    res.status(403).json("you can only follow once")
  }



}catch(err){
    res.status(401).json(err)
}
    }
    else{
        res.status(405).json('follow failed id matches') 
    }
}

exports.unfollowauser=async(req,res)=>{
    // console.log(req.body.userId, req.params.id);
    if(req.body.userId !== req.params.id){
try{

    const user = await users.findById(req.params.id)
    const currentUser = await users.findById(req.body.userId)
  if(user.followers.includes(req.body.userId)){
    await user.updateOne({$pull:{followers:req.body.userId}})
    await currentUser.updateOne({$pull:{followings:req.params.id}})
    res.status(200).json("unfollowed successfully")
  }
  else{
    res.status(403).json("already you unfollowed")
  }



}catch(err){
    res.status(401).json(err)
}
    }
    else{
        res.status(405).json('unfollow failed id matches') 
    }
}


exports.createpost=async(req,res)=>{

    const {desc,rating}=req.body

    const img = req.file?.filename
    const userId=req.payload

    try{
        const newPost= new posts({
            desc,rating,img,userId
        })

        await newPost.save()
        res.status(200).json(newPost) 

    }catch(err){
      res.status(401).json(err)
    }
}

exports.updatepost=async(req,res)=>{
  try{
    const post= await posts.findById(req.params.id)
    if(post.userId === req.body.userId){
         await post.updateOne({$set:req.body})
         res.status(200).json("The post updation success")
    }else{
        res.status(403).json("updation failed id doesnt match")
    }
}catch(err){
    res.status(401).json(err)
}
  }

exports.deletepost=async(req,res)=>{
    
    try{
        const post= await posts.findById(req.params.id)
        // console.log(req.params.id,req.body.userId);
        if(post.userId === req.body.userid){
             await post.deleteOne()
             res.status(200).json("The post deletion success")
        }else{
            res.status(403).json("delete failed id doesn't match")
        }
    }catch(err){
        res.status(401).json(err)
    } 
  }

exports.likedislikeapost=async(req,res)=>{    
  try{ 
     const post = await posts.findById(req.params.id)
     if(!post.likes.includes(req.body.userId)){
        await post.updateOne({$push:{likes:req.body.userId}})
        res.status(200).json("you liked successfully")
     }else{
        await post.updateOne({$pull:{likes:req.body.userId}})
        res.status(200).json("disliked succesfully")
     }
}catch(err){
    res.status(401).json(err)
}
   }


exports.getapost=async(req,res)=>{
    try{

     const post = await posts.findById(req.params.id)  
     res.status(200).json(post)

    }catch(err){
        res.status(401).json(err)
    }
   }

exports.timeline=async(req,res)=>{
  try{
      const currentUser = await users.findById(req.params.userId)
      const userposts = await posts.find({userId:currentUser._id})
      const friendposts = await Promise.all(
        currentUser.followings.map(friendId=>{
          return  posts.find({userId:friendId})
        }) 
      )
      res.status(200).json(userposts.concat(...friendposts))
  }catch(err){
    res.status(401).json(err)
  }
   }


   exports.getusersallpost=async(req,res)=>{
    try{
        const user = await users.findOne({userName:req.params.userName})
        const postss = await posts.find({userId:user._id})
        res.status(200).json(postss)
    }catch(err){
      res.status(401).json(err)
    }
     }


     exports.getfriends=async(req,res)=>{
        try{
           const user = await users.findById(req.params.userId)
           const friends = await Promise.all(
            user.followings.map((friendId)=>{
                return users.findById(friendId)
            })
           )
           let friendList=[]
           friends.map((friend)=>{
            const {_id,userName,profile} = friend
            friendList.push({_id,userName,profile})
           })
           res.status(200).json(friendList)
        }catch(err){
            res.status(401).json(err)
        }
     }
    


     exports.editProfile=async(req,res)=>{
        console.log(req.body);

        const { userName,bio,Name,city}=req.body
        const {_id}=req.params
        const profile=req.file?.filename

     try {  
        const selectedUser= await users.findOne({_id})
        if(selectedUser){
            selectedUser.userName=userName
            selectedUser.Name=Name
            selectedUser.bio=bio
            selectedUser.city=city
            selectedUser.profile=profile

            //save changes in mongodb
            await selectedUser.save()
            res.status(200).json("Profile updated")
        }else{ 
    res.status(404).json("user is not present")
        }
    }catch(err){
        res.status(401).json(err)
    } 
     } 

     exports.getprofile=async(req,res)=>{
        const {_id}=req.params
        try{
           const userData = await users.findOne({_id})
           if(userData){
            res.status(200).json(userData)
           }else{
            res.status(404).json("user Not found")
           }
        }catch(err){
      res.status(401).json(err)
        }
     } 

   exports.getallusers=async(req,res)=>{
    //Query data
    const searchQuery=req.query.search
    try{
        const query={
            userName:{$regex:searchQuery,$options:'i'}
        }
       const userss = await users.find(query)
       if(userss){
        res.status(200).json(userss)
       }else{
        res.status(404).json("users are ot present")
       }
    }catch(err){
        res.status(401).json(err)
    }
   }

exports.getimages=async(req,res)=>{
    try{
        const image=await images.find()
        if(image){
            res.status(200).json(image)
        }else{
            res.status(404).json("image not found")
        }
    }catch(err){
        res.status(401).json(err)
    }
}

