
const User = require("../models/user")

module.exports.signUp = (req,res)=>{
    res.render("users/signUp.ejs")
}

module.exports.signUpUser = async(req,res)=>{
    try {
     let { username , email , password } = req.body
     const newUser = new User({username,email })
     const registerUser = await User.register(newUser,password)
     req.login(registerUser,(err)=>{
         if(err){
            return next(err)
         }
         req.flash("success", "welcome to wonderLust")
         res.redirect("/listings")
     })
    } catch (error) {
     req.flash("error", error.message)
     res.redirect("/signup")
    }
 }

 module.exports.login = (req,res)=>{
    res.render("users/login.ejs")
}


 module.exports.loginUser = async(req,res)=>{
    req.flash("success",`welcome back to wonderLust !You are Logged In`)
    res.redirect(res.locals.redirectUrl || "/listings")
}


module.exports.loggedOutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","you are logged Out now")
        res.redirect("/listings")
    })
}