const userModel = require("../models/user-model")
const jwt = require("jsonwebtoken")

module.exports.isLoggedIn = async function(req,res,next){
    const token = req.cookies.token;
    // console.log("lol");
    
    if (! token){
        req.flash("error" , "You must be logged in")
        return res.redirect("/");
        
    }
    try{const result = await jwt.verify(token,process.env.SECRET_KEY)
        if (result){
        const {email} = await jwt.decode(token)
        const user = await userModel.findOne({email})
        req.user = user
        // console.log("okay")
        next();
    }
    else{

        return res.redirect("/")}
    }
    
    
    catch(err){
        res.send(err)
        return;
    }
}
module.exports.redirectToProfile = async function(req,res,next){
    const token = req.cookies.token;

    if (! token){
        return next();
        
    }
try{
        let result = jwt.verify(token,process.env.SECRET_KEY)
        if (result)
        return res.redirect("/profile")
        else next();
    
        

    }

    
    
    catch(err){
        req.flash("error" , err.message)
        res.redirect("/")
        return;
    }
}

