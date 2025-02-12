import express, { urlencoded } from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(urlencoded({extended:true,limit:"16kb"}))  //parameters not much needed
app.use(express.static("public"))   //to serve files from public folder
app.use(cookieParser()) ;

//defining the routes
import userRouter from "./routes/User.routes.js"

app.use("/api/v1/users",userRouter);
// app.use("/api/v1/users",userRouter);

export { app };