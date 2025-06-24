import express from "express"
import cors from "cors"
import passport from "passport"
import http from "http"
import cookieParser from "cookie-parser";
import "./config/passport.js"



const app= express()

app.use(cors({
origin : ["http://localhost:5173", "http://localhost:5174"], // ei ta te amra kon port e run hobe seta thik  korte parbo
credentials : true
}))




app.use(express.json({limit:"10kb"})) // amra ei vabe from er theke data nite pari ar limit korte pari
app.use(express.urlencoded({extended:true,limit:"10kb"}))//amra ei vabe url er theke data nite pari ar limit korte pari ar extentded er kaj nested object toiri korte  mean object er vitore object toiri korte
app.use(express.static("public"))
app.use(cookieParser()) // read or remove cookie from user server 


// importing routes

import userRouter from "./routes/user.routes.js"
import authRouter from "./routes/auth.js"
import markerRouter from "./routes/markers.routes.js"



// routes decleartion

app.use ("/api/v1/user",userRouter)
app.use ("/api/v1/auth",authRouter)
app.use ("/api/v1/marker",markerRouter)




export default app