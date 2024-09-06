const express = require('express');
const Router = express.Router();

const{ isLoggedIn} = require('../middlewares/auth-middleware')
const { createPageController, 
        postCreateController, 
        showhisaabController, 
        deletehisaabController,
        verifyhisaabController,
        edithisaabController,
        updateHisaabController,
    } = require('../controllers/hisaabController')

Router.get("/create",isLoggedIn,createPageController)
Router.post("/create",isLoggedIn,postCreateController)
Router.get("/view/:id",isLoggedIn,showhisaabController)
Router.post("/:id/verify",isLoggedIn,verifyhisaabController)
Router.get("/delete/:id",isLoggedIn,deletehisaabController)
Router.get("/edit/:id",isLoggedIn,edithisaabController)
Router.post("/update/:id",isLoggedIn,updateHisaabController)

module.exports = Router;