const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js");
const dbUrl=process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

let intiDb=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'679ded3d90402fac3dc179ed'}))//reinitialized for owner
    await Listing.insertMany(initData.data);
    console.log("Initialized");
}

intiDb();