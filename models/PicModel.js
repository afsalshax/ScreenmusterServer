const mongoose=require('mongoose')


const ImageSchema=new mongoose.Schema({
    pic:{
        type:String
    }
})

const images = new mongoose.model("images",ImageSchema)

module.exports=images