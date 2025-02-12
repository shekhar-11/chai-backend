//async handler to check through all the catch

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {uploadOnCloud} from "../utils/cloudinary.js"
import {User} from "../models/User.models.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
// here we generally write the logic 

//function to create access and refresh tokens

const generateAccessAndRefreshToken = async (userId)=>
  {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false})


        return {accessToken,refreshToken}


    } catch (error) {
      throw new ApiError(500,"Something went wrong while generating the access and refresh tokens")
    }
  }


const registerUser = asyncHandler(async (req,res) =>{
  //The algorithm to set up the register logic
  // 1> get user details from frontend
  // 2> validation -- empty data check
  // 3> check if user already exists -- through username and email
  // 4>avatar is required check for it
  // 5> upload to cloudinary and get the response url from there if not then failed uploading to the cloudinary
  // 6> now when all validated create a user object (user.create({})) in order to create the entry for db
  // 7> when created db returns exact data as res so remove pass and refreshToken 
  // 8> check whether user is created or not through this response  
  // 9> return the res
  const {fullName,email,password,username} = req.body;

    if([fullName,email,password,username].some((field)=>{
      return field?.trim()==="";   //? -> if field exists -> trim the leading + trailing spaces -> if ==="" -> empty value entered
    }))
    {
      throw new ApiError(400,"Fields cannot be empty");
      
    }

    
    const existedUser =await User.findOne({$or:[{username},{email}]});

    if(existedUser)
    {
      throw new ApiError(409 , "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;     //avatar same as in route for middleware multer
    const coverImageLocalPath = req.files?.coverImage[0].path;  //coverImage same as in route for middleware multer
  
    if(!avatarLocalPath)
    {
      throw new ApiError(400,"Avatar file not found");
    }
    const avatar = await uploadOnCloud(avatarLocalPath);
    const coverImage = await uploadOnCloud(coverImageLocalPath);
  
    const user =await User.create({
      fullName,
      avatar:avatar.url,        //as returned by cloudinary.js
      coverImage: coverImage?.url || "",
      password,
      username:username.toLowerCase(),
      email
    })

    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken");

    if(!createdUser)
    {
      throw new ApiError(500,"Something went wrong while registering the user");
    }
    
    return res.status(200).json(
      new ApiResponse(
       200,
       createdUser, //as user ,
        "User created Successfully"
      )
    )
})



const loginUser = asyncHandler(async (req,res)=>{
  // data from body
  // username or email based access 
  // find the user
  // password check
  // access & refresh token to be generated and given to user
  // send the cookie 
  // console.log(req.body);

  const {username,email,password} =  req.body;
  // res.status(200).json(
  //   new ApiResponse(200,{username,email,password},"Good")
  // )
  // console.log(username , email, password);
  if(!username || !email)
  {
    throw new ApiError(400,"Username or email is required");
  }

  const user = await User.findOne({$or:[{username},{email}]});

  if(!user)
  {
    throw new ApiError(404,"User does not exist");

  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  // console.log(isPasswordValid)
  if(!isPasswordValid)
  {
    throw new ApiError(401,"Invalid user credentials");
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

  const loggedInUser =await User.findOne(user._id).select("-password -refreshToken");

  const options  = 
  {
    httpOnly:true,
    secure:true,
  }

  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200
      ,
      {
        user:loggedInUser,
        accessToken,
        refreshToken
      }
      ,
      "User logged in successfully",

    )
  )

})

const logoutUser = asyncHandler(async (req,res)=>
{

  //before the logout the user must be login in order to logout so for that creating the new MW verifyJwt
  //just find the user and remove the refresh token clear the cookies of access and refresh token


  const user = await User.findByIdAndUpdate(req.user._id,
    {
      $set:{
        refreshToken:""
      }
    },
    {
      new:true,
    }

  )

  const options = {httpOnly:true,
    secure:true
  }

  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200,{},"User logged Out Successfully")
  )

  

})


const refrshAccessToken  = asyncHandler(async (req,res)=>{
   try {
     const incomingRefreshtoken = req.cookie?.refreshToken || req.body?.refreshToken;
 
     if(!incomingRefreshtoken)
     {
       throw new ApiError(401,"Unauthorized request")
     }
 
     const decodedToken = await jwt.verify(incomingRefreshtoken,process.env.REFRESH_TOKEN_SECRET);
     const user = await User.findById(decodedToken?._id);
 
     if(!user)
     {
       throw new ApiError(401,"Invalid refresh token");
     }
 
     //if user is valid mmatching the refresh token from the database
 
     if(!(decodedToken.refreshToken === user?.refreshToken))
     {
       throw new ApiError(401,"Refresh token is expired/used")
     }
 
     //generate new token ---  as we already  have a function to generate tokens
 
     const options  = {httpOnly:true,secure:true}
 
     const {newAccessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id);
 
 
     return res.status(200)
     .cookie("accessToken",newAccessToken,options)
     .cookie("refreshToken",newRefreshToken,options)
     .json(
       new ApiResponse(200,user,"Access token refreshed")
     )
   } catch (error) {
      throw new ApiError(401,error?.message|| "Invalid refresh token")
   }

})

export {registerUser,loginUser,logoutUser};