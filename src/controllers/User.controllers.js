//async handler to check through all the catch

import { asyncHandler } from "../utils/asyncHandler.js";



//here we generally write the logic 
const registerUser = asyncHandler(async (req,res) =>{
  res.status(200).json({
    message:"OK",
  })
})

export {registerUser};