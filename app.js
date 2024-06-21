if(process.env.NODE_ENV != 'production' ){
    require('dotenv').config()

}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/user")
const userRouter = require("./routes/user")



const session = require("express-session")
const MongoStore = require("connect-mongo")
const listings = require("./routes/listing");
const reviews = require("./routes/review");

const db_Url = process.env.DB_URL

mongoose.connect(db_Url)
    .then(() => {
        console.log('Connected to DB');
    })
    .catch(err => {
        console.error('Error:', err);
    });

    const store = MongoStore.create({
        mongoUrl : db_Url,
        crypto : {
            secret : process.env.SECRET
        },
        touchAfter : 24 * 3600,
    })


    store.on("error",()=>{
        console.log(`error in mongo session store ${error}`);
    })
    
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true  ,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    } 
}




app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user
    next()
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
