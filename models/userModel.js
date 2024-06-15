const mongoose=require('mongoose')

// structure of the users data

const userSchema=new mongoose.Schema({

     Name:{
        type:String,
        required:true
     },
     userName:{
       type:String,
       required:true,
       unique:true,
       min:3,
       max:20
     },
     email:{
        type:String,
        required:true,
        max:50,
        unique:true
     },
     password:{
        type:String,
        required:true,
        min:6
     },
     city:{
        type:String,
        max:50
     },
     bio:{
        type:String,
        max:50
     },
     profile:{
        type:String,
        default:""
     },
     followers:{
      type:Array,
      default:[]
     },
     followings:{
  type:Array,
  default:[]
     },
     isAdmin:{
      type:Boolean,
      default:false,
     }, 
},
{timestamps:true}
)

//create model 
const users = mongoose.model("users",userSchema)

module.exports=users
