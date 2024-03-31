const mongoose = require("mongoose");
const Schema = mongoose.Schema();
const Mongo_URL = "mongodb://localhost:27017/wandarlust";

main().catch(err => console.log(err));
async function main() {
    //Connection to MongoDB
    await mongoose.connect(Mongo_URL); 
    console.log("Connected successfully")
}

//Creating a schema for our listings
const Listing = new Schema({
    title:{
        type: String,
        require: true,
    },

    description:{
        type: String,
        require: true,
    },

    price:{
        type: Number,
        require: true,
    },

    image:{
        type: String,
        link: Set((link)=>{
            link === ""? "https://media.cntraveler.com/photos/58e4005abdecd628dc467e91/16:9/w_1920,c_limit/Exterior-TaylorRiverLodge-Colorado-CRHotel.jpg" : link
        })
    },

    location:{
        type: String,
        require: true,
    },

    country:{
        type: String,
        require: true,
    }

})

//Exporting created listing schema
module.exports(Listing);