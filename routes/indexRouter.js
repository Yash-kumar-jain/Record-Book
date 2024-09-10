const express = require('express');
const Router = express.Router();
const upload = require('../config/multer')

const {
    isLoggedIn,
    redirectToProfile,
}= require("../middlewares/auth-middleware")

const { 
    indexController, 
    loginController, 
    logoutController, 
    profileController,
    profilePictureController,
    registerController, 
    registerPageController,
    removeProfilePicture,  

} = require("../controllers/indexController");

Router.get("/",redirectToProfile,indexController)
Router.post("/register",registerController)
Router.get("/register",registerPageController)
Router.post("/login",loginController)
Router.get("/logout",logoutController)
Router.get("/profile",isLoggedIn ,profileController)
Router.post("/profilePicture",isLoggedIn ,upload.single('profilePicture'),profilePictureController)
Router.get("/removeProfilePicture",isLoggedIn,removeProfilePicture)



module.exports = Router;