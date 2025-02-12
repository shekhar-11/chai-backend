import {Router} from "express"
import {logoutUser, registerUser,loginUser} from "../controllers/User.controllers.js"
const router = Router();
import {upload} from "../middlewares/multer.middleware.js"
// import {  } from "../controllers/User.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.route("/register").post(upload.fields    //.fields is the method given by multer 
  ([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]) //objects of which all filed to be added NAME MUST BE SAME SO IN FRONTEND 
,
registerUser);

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJwt,logoutUser);
export default router;