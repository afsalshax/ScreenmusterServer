//.env file
require('dotenv').config()

//import express
const express=require('express')

const cors=require('cors')


const routes=require('./Routes/routes')

require('./database/connection')

//create server using server
const smusterServer=express()
smusterServer.use(cors())

//convertion of json to js data
smusterServer.use(express.json())

smusterServer.use(routes)

smusterServer.use('/imageup',express.static('./imageup'))

//export uploads folder 
// smusterServer.use('/imageup',express.static('./imageup'))

//Port
const PORT=8000 || process.env.PORT
smusterServer.listen(PORT,()=>{
    console.log(`__smusterServer started at port ${PORT}__`);
})

//resolve api requests

smusterServer.get('/',(req,res)=>{
    res.send(`<h2>smusterserver started..</h2>`)
})
