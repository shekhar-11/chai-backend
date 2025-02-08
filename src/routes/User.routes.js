import Router from "express"
import {registerUser} from "../controllers/User.controllers.js"
const router = Router();
import {upload} from "../middlewares/multer.middleware.js"

router.route("/register").post(upload.files    //.files is the method given by multer 
  ([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]) //objects of which all filed to be added NAME MUST BE SAME SO IN FRONTEND 
,
registerUser);
export default router;