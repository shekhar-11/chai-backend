import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt  = asyncHandler(async (req,_,next)=>
{
 try {
   //get the token from the cookie (req.cookie gives - cookie >>>>>> .accessToken gives the access token)
   const token =await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
 
   if(!token)
   {
     throw new ApiError(401,"Unauthorized user");
   }
 
   const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
 
   const user = await User.findById(decodedToken?._id).select("-password");
 
   if(!user)
   {
     throw new ApiError(401,"Invalid user access");
   }
 
   //if user exists add the user in the object
   req.user = user;
 
   next();
 } catch (error) {
    throw new ApiError(401,error?.message || "Invalid access token")
 }




})