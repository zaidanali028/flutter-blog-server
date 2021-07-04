
require("dotenv").config()
const express=require('express')
const app=express()
const mongoose = require("mongoose");
// const dbUrI = "mongodb://localhost:27017/flutter-blog";
const dbUrI=process.env.DB_URL



//body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 connect =()=>{
    try{
     mongoose.connect(dbUrI, { useNewUrlParser: true, useUnifiedTopology: true })
       connection=mongoose.connection;
       connection.once("open",()=>{
           console.log("db connected.........")
       })
 }
    catch(e){
        console.log(e)
    }

}

connect()
let port=process.env.PORT||5000

const userRoutes=require("./routes/user")
app.use("/user",(userRoutes))


app.get("/",(req,res)=>{
    res.status(200).send("flutter-blog API")
})

app.listen(port,()=>{
    console.log("Server running..")
})