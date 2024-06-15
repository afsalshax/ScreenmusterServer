const mongoose=require('mongoose')
const connectionString=process.env.connector
mongoose.connect(connectionString).then(()=>{
    console.log("Mongodb atlas connected");
}).catch((err)=>{
    console.log(`failed to connect mongodb ${err}`);
})