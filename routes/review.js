const express=require("express");
const router=express.Router({mergeParams:true});//usually /listing/id/reviews is parent route , it will not send it to child i.e reviews . so , we use mergeparams:true
const Listing=require("../models/listing.js");
const ExpressError=require("../util/ExpressError.js")
const wrapAsync=require("../util/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const Review=require("../models/review.js");


router.post("/",async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New Review is added!");
    res.redirect(`/listings/${listing.id}`)
})

module.exports=router;