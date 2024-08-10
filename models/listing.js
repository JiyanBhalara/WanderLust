const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//Creating a schema for our listings
const listing = new Schema({
    title:{
        type: String,
        require: true,
    },

    description:{
        type: String,
        require: true,
    },

    image:{
        type: String,
        default: "https://media.cntraveler.com/photos/58e4005abdecd628dc467e91/16:9/w_1920,c_limit/Exterior-TaylorRiverLodge-Colorado-CRHotel.jpg",
        set: (v)=>
            v === ""? "https://media.cntraveler.com/photos/58e4005abdecd628dc467e91/16:9/w_1920,c_limit/Exterior-TaylorRiverLodge-Colorado-CRHotel.jpg" : v,
    },

    price:{
        type: Number,
        require: true,
    },

    location:{
        type: String,
        require: true,
    },

    country:{
        type: String,
        require: true,
    },

    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});
const Listing = mongoose.model("Listing", listing);

//Exporting Listing schema
module.exports = Listing;
