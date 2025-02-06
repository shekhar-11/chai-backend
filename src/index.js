import dotenv from "dotenv"
dotenv.config({
  path:"./.env"
})

import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDb from "./db/db.js";
import { app } from "./app.js";

connectDb()
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`Server is running on the port: ${process.env.PORT}`);
  })
  app.on("err",(err)=>{
    console.log("Err communication between the server and db")
  })
})
.catch((err)=>{
  console.log("Connection to the mongo db failed ",err);
})




















































// require("dotenv").config({
// path:"./env"});
// ;(async ()=>{
//   try{
//     await mongoose.connect(`${process.env.MONGODB_URI}\${DB_NAME}`)
//     app.on(err,(err)=>{
//       console.log("Error listening to the db by express ",err);
//       throw err
//     })
//   }
//   catch(err)
//   {
//     console.log("Error connecting to db: ",err );
//   }
// })