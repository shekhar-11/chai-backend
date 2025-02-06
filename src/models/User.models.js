import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },
  fullName:{
    type:String,
    trim:true,
    index:true
  },
  avatar:
  {
    type:String,         //cloudinary url
    required:true
  },
  coverImage:{
    type:String
  },

  watchHistory: [
    {
      type:Schema.Types.ObjectId,
      ref:"Video"
    }
  ],
  password:{
    type:String,
    required:[true,"Password is required"],
  },
  refreshToken:{
    type:String
  }
}
,
{
  timestamps:true
})


userSchema.pre("save",function(next){
    if(!this.isModified("password"))
    {
      return next();
    }
    this.password = bcrypt.hash(this.password,10);
    next();
})


userSchema.methods.generateAccessToken = function()
{
    return jwt.sign(
      {
        _id:this._id,
        password:this.password,
        username:this.username,
        fullName:this.fullName          //lhs = for jwt variable || rhs = what we stored in db that exact name 
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
      }
    )
}

userSchema.methods.generateRefreshToken = async function()
{
    jwt.sign
    (
      {
        _id:this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn:REFRESH_TOKEN_EXPIRY
      }
    )       //different from accesstoken just by duration expiry and information in payload
}


userSchema.methods.isPasswordCorrect =async function()
{
  return await bcrypt.compare(password,this.password);
}


export const User = mongoose.model("User",userSchema);