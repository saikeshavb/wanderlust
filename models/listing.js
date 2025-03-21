const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    price:{
        type:Number,
        required:true
    },
    image:{
         filename:String,
         url:String
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;