import dotenv from 'dotenv'
// require('dotenv').config({path:"/.env"}) .env import korbar first methode or amra 2nd methode korte parbo jeta import da hobe

import connectDB from "./db/index.js";
import app from './app.js';
dotenv.config({
    path:"./.env"
})




connectDB()
.then(()=>{

app.listen(process.env.PORT || 8000 ,()=>{
    console.log(`server is running at ${process.env.PORT}`);
    
})

})
.catch((error)=>{console.log("MongoDB connection error",error);
})

/*
import mongoose from "mongoose";


import connectDB from "./db";
import { config } from 'nodemon';

import express from "express"

const app= express()

;(async()=>{
    try {
   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
   app.on ("error",(error)=>{
    console.log("Error",error)
    throw error
   })
   app.listen(process.env.PORT,()=>{
    console.log(`Port is listening on ${process.env.PORT}`)
   })
    } catch (error) {
        console.error("ERROR :", error)
        throw error
        
    }
})()
    */