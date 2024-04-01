const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing.js");
const Mongo_URL = "mongodb://localhost:27017/wanderlust";
const path = require("path");



//Connecting backend on port 5000
app.listen(5000, ()=>{
    console.log("App listening to 5000");
})

main().catch(err => console.log(err));
async function main() {
    //Connection to MongoDB
    await mongoose.connect(Mongo_URL); 
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/",async (req, res)=>{
    let sampleListing = new Listing({
        title: "Hello",
        description: "First hotel",
        price: 1200,
        location: "delhi",
        country: "India"
    })
    await sampleListing.save();
    console.log("Saved successfully")
})

app.get("/listings",async (req, res)=>{
    const allListing = await Listing.find({});
    res.render("./Listings/index.ejs", {allListing});
})