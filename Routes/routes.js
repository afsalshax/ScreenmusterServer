const express=require('express')

//router object
const router = new express.Router()
const user=require('../Logiccontrolls/userControl')
const {jwtmiddleware}=require('../middlewares/jwtmiddleware')
const imageu = require('../middlewares/multerMiddleware')


//register
router.post('/user/register',user.register)

//login
router.post('/user/login',user.login)

//update user
router.put("/user/update/:id",imageu.single('profile'),user.updateuser)

//delete user
router.delete("/user/delete/:id",user.deleteuser)

//get a user 
router.get("/user/getauser/",user.getauser)

//follow a user
router.put("/user/follow/:id",user.followauser)

//unfollow a user
router.put("/user/unfollow/:id",user.unfollowauser)


//create a post
router.post("/user/createpost",jwtmiddleware,imageu.single('img'),user.createpost)


//update a post 
router.put("/user/updatepost/:id",user.updatepost)

//delete a post 
router.delete("/user/deletepost/:id",user.deletepost)

//like dislike a post 
router.put("/user/likedislike/:id/like",user.likedislikeapost)

//get a post 
router.get("/user/getapost/:id",user.getapost)


//get all posts of users following timeline  

router.get("/user/timeline/:userId",user.timeline)

//get user's all posts
router.get("/user/profile/:userName",user.getusersallpost)


//get friends
router.get("/user/friends/:userId",user.getfriends)

//editProfile
router.put("/user/editprofile/:_id",imageu.single('profile'),user.editProfile)


//getprofile
router.get("/user/getprofile/:_id",user.getprofile)

//get users
router.get("/user/getallusers",user.getallusers)

//delete post
router.delete("/user/deletepost/:_id",jwtmiddleware,user.deletepost)

//get images
router.get("/user/getimages",user.getimages)




  
module.exports=router 
        