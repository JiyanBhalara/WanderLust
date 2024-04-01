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
app.use(express.urlencoded({extended: true}));

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

//Index route
app.get("/listings",async (req, res)=>{
    const allListing = await Listing.find({});
    res.render("./Listings/index.ejs", {allListing});
})

//New listing route
app.get("/listings/new", async (req,res)=>{
    res.render("./Listings/CreateListing.ejs");
})

//Add new listing to database
app.post("/listings", async (req,res)=>{
    let {title, description, price, image, location, country} =  req.body;
    const NewListing = await new Listing({
        title: title,
        description: description,
        price: price,
        image: image,
        location: location,
        country: country
    })
    NewListing.save();
})

//Show route
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const ShowListing = await Listing.findById(id);
    res.render("./Listings/showListing.ejs", {ShowListing});
})

