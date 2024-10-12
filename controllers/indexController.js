const userModel = require("../models/user-model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const upload = require('../config/multer')


module.exports.indexController = function(req,res){
    let message = req.flash('error')
    res.render("index",{error:message,isLoggedIn:false});
}

module.exports.registerPageController = function(req,res){
    res.render("register",{isLoggedIn:false});
}

module.exports.registerController = [
    upload.single('profilePicture'),
    async function(req, res) {
    try {
        let { username, password, name, email } = req.body;
        let profilePicture = req.file ? req.file.buffer : null;    

        // console.log(profilePicture);

        let user = await userModel.findOne({ email });
        if (user) {
        req.flash("error", "User already registered");
        res.redirect("/");
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = await userModel.create({
        username,
        password: hash,
        name,
        email,
        profilePicture
    });

    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.SECRET_KEY);

    res.cookie("token", token);

    res.redirect("/profile");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}
];


module.exports.loginController = async function(req,res){
    const {email,password} = req.body;
    const user = await userModel.findOne({email}).select("+password");
    if (!user){
        req.flash("error" , "User dose not exist")
        res.redirect("/")
        return;
    }
    
    try{
        let result = await bcrypt.compare(password,user.password)
        if (result){
            
            const token =  jwt.sign({
                id: user._id,
                email: user.email
            },process.env.SECRET_KEY)
            
            res.cookie("token", token)
            res.user = user
            res.redirect("/profile")
        }
        else{
            req.flash("error" , "Invalid credentials")
            res.redirect("/")
            return;
        }
    }
        catch(err){
            req.flash("error" , err.message)
            res.redirect("/")
    }
}

module.exports.logoutController = function(req,res){
    res.cookie("token","")
    return res.redirect("/")
}

module.exports.profileController = async function(req,res){

    let { startDate, endDate, byDate} = req.query;
    // console.log(startDate,endDate,byDate);

    let dateFilter = {};
    if (startDate && endDate) {
    dateFilter = {
        createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
    }
    };
    }
    const sortBy = typeof byDate === "string" ? byDate:1
    let user = await userModel
    .findOne({email:req.user.email})
    .populate({    
    path: 'hisaabs',
    match: dateFilter,
    options: { sort: { createdAt: Number(sortBy) } }
    })
    // console.log(user);
    
    let profilePictureBase64 = '';
    if (user.profilePicture && Buffer.isBuffer(user.profilePicture)) {
        profilePictureBase64 = user.profilePicture.toString('base64');
        
    }
    // user.hisaabs.sort({createdAt:byDate}).exec()
    res.render("profile",{user, profilePictureBase64})
    // console.log(user);
    
}

module.exports.profilePictureController =  async function(req,res){
    try{
        let user = await userModel.findOne({email:req.user.email})

        user.profilePicture = req.file.buffer
        await user.save()
        res.redirect("/profile")
    }
    catch(err){
        console.error(err)
        res.status(500).send("Internal Server Error")
    }
    

}

module.exports.removeProfilePicture =  async function(req,res){
    try{
        let user = await userModel.findOne({email:req.user.email})

        user.profilePicture = ""
        await user.save()
        res.redirect("/profile")
    }
    catch(err){
        console.error(err)
        res.status(500).send("Internal Server Error")
    }
    

}


