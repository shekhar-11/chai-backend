import express from "express";
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
const app = express();



;(async ()=>{
  try{
    await mongoose.connect(`${process.env.MONGODB_URI}\${DB_NAME}`)
    app.on(err,(err)=>{
      console.log("Error listening to the db by express ",err);
      throw err
    })
  }
  catch(err)
  {
    console.log("Error connecting to db: ",err );
  }
})