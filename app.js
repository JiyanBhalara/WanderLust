const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing.js");
const Mongo_URL = "mongodb://localhost:27017/wanderlust";
const path = require("path");
const MethodOverride = require("method-override");
const EjsMate = require("ejs-mate");

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
app.use(MethodOverride("_method"));
app.engine("ejs", EjsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/",async (req, res)=>{
    res.send("Hi I am root");
})

//Index route
app.get("/listings",async (req, res)=>{
    const allListing = await Listing.find({});
    res.render("./Listings/index.ejs", {allListing});
})

//New listing route
app.get("/listings/new", async (req,res)=>{
    const listing = await Listing.find();
    res.render("./Listings/CreateListing.ejs", {listing});
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
    res.redirect("/listings");
})

//edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./Listings/UpdateListing.ejs", {listing})
})

//Update route
app.put("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
})

//Delete route
app.delete("/listings/:id",  async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

//Show route
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const ShowListing = await Listing.findById(id);
    res.render("./Listings/showListing.ejs", {ShowListing});
})



