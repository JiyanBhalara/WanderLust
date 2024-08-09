const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//Creating a schema for reviews 
const review = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    CreatedAt: {
        type: Date,
        default: Date.now()
    }
})
const Review = mongoose.model("Review", review)

//Exporting Review schema
module.exports = Review