import { Router } from "express";
import { verifyJWT } from "../middlewires/auth.middlewire.js";
import { registerUser,
     loginUser, 
     logoutUser, 
    refreshAccessToken,
//     changeNewPassword, 
     getCurrentUser, 
    allUsers,

    // updateUserAvatar,
    // updateUserCoverImage,
    
}
 from "../controllers/user.controller.js"; // Corrected imports


import { upload } from "../middlewires/multer.middlewires.js";


const router = Router();

// Register route
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

// Login route
router.route("/login").post( loginUser);
router.route("/login_admin").post( loginUser);

// Logout route
router.route("/logout").post(verifyJWT,logoutUser); 


router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/allusers").get(allUsers)

 router.route("/refresh-token").post(refreshAccessToken)


// router.route("/change-password").post(verifyJWT,changeNewPassword)
// router.route("/current-user").get(verifyJWT,getCurrentUser)
// router.route("/update-account").patch(verifyJWT,updateAccountDetails) // 1ta details update er jonno patch use hoy post use korle sob ekebare update hoy
// router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar) // eta url theke asche tai multer er function upload single karon ekta file ar file er naam ki name save hobe tai thakbe () e
// router.route("/cover-Image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)






export default router;
