const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const ExpressError=require("../util/ExpressError.js")
const wrapAsync=require("../util/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn}=require("../middleware.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage})
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });

//index route
router.get("/",wrapAsync(async (req,res)=>{
    let allLists=await Listing.find({});
    res.render("listings/index.ejs",{allLists});
}))
//new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
})
//show route(detailed view)
router.get("/:id",wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    // if(!listing){
    //     next(new ExpressError(500,"eroor occured"));//for async function error has to be sent via next , you cant throw
    // }

    if(!listing){
        req.flash("error","Listing does'nt exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}))
//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))
//update route
router.put("/:id",isLoggedIn,upload.single("listing[image]"),wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing is updated");
    res.redirect(`/listings/${id}`);
}))
//create route
router.post("/",isLoggedIn,upload.single("listing[image]"),wrapAsync(async(req,res,next)=>{
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location ,
        limit: 1,
      })
    .send();
    console.log(response.body.features[0].geometry);

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing is added!");
    res.redirect("/listings");
}))

//delete route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let delListing =await Listing.findByIdAndDelete(id);
    console.log(delListing);
    req.flash("success","Listing is deleted");
    res.redirect("/listings");
}))

module.exports=router;
