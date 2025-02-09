//async handler to check through all the catch

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {uploadOnCloud} from "../utils/cloudinary.js"
import {User} from "../models/User.models.js";
import {ApiResponse} from "../utils/ApiResponse.js"
// here we generally write the logic 

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

export {registerUser};