const mongoose=require('mongoose')

// structure of the users data

const PostSchema=new mongoose.Schema({

    userId:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        max:500
    },
    img:{
        type:String,       
    },
    likes:{
        type:Array,
        default:[]
    },
    rating:{
        type:String
    },
    comments:{
        type:Array,
        default:[]
    }  
},
{timestamps:true}
)

//create model 
const posts =new mongoose.model("posts",PostSchema)

module.exports=posts
