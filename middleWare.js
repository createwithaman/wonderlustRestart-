const Listing = require("./models/listing")
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/expressErr.js");
const { reviewSchema } = require("./schema");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash(`error`,`you must be Logged in to create Listing`)
        return res.redirect("/login")
    }
    next()
}
module.exports.saveRedirectsUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        
        res.locals.redirectUrl =  req.session.redirectUrl
    }
    next()
}

module.exports.isOwner =  async (req,res,next)=>{
    const { id } = req.params;
    let listing = await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","you are not owner of this listing")
      return  res.redirect(`/listings/${id}`);
    }
    next()

}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async (req,res,next)=>{
    let { id ,reviewId } = req.params
    let review = await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","you are not author of this review")
        return res.redirect(`/listings/${id}`)
    }
}