const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const data = require("./data.js")
const Mongo_URL = "mongodb://localhost:27017/wanderlust";

main().catch(err => console.log(err));
async function main() {
    //Connection to MongoDB
    await mongoose.connect(Mongo_URL); 
}

async function intializeData(){
    await Listing.deleteMany({});
    data.data.map((obj)=>{
        obj.owner = "66c60de636053f404ce86c20";
    })
    await Listing.insertMany(data.data);
    console.log("Data saved successfully")
}

intializeData();