const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const {saveRedirectsUrl} = require("../middleWare")
const userController = require("../controller/user")

router.get("/signup",userController.signUp)


router.post("/signup", wrapAsync(userController.signUpUser))

router.get("/login",userController.login)

router.post("/login",saveRedirectsUrl, passport.authenticate("local", { failureRedirect : '/login', failureFlash : true}) ,userController.loginUser)


router.get("/logout",userController.loggedOutUser)

module.exports = router