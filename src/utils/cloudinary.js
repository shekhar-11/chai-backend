import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET    // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloud = async (localFilePath)=>{
  try {
    if(!localFilePath)
    {
      return null;
    }

    const response = await cloudinary.uploader.upload({
      resource_type:"auto"
    })
    console.log("File has been uploaded successfully : ",response);
    return response;
  } catch (error) {
    fs.unlink(localFilePath);
    return null
  }
}

export {uploadOnCloud}

