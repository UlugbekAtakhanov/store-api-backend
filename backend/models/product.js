const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "product name must be provided"]
    },
    price: {
        type: Number,
        required: [true, "product price must be provided"]
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    company: {
        type: String,

        // enum - means, only the companies in the array can be added
        // enum: ["ikea", "liddy", "caressa", "marcos"]      or you can write =>
        enum: {
            values: ["ikea", "liddy", "caressa", "marcos"],
            message: "{Value} is not supported"
            // if "company" name provided by clientside is not equal to "value(item)", there will an error "message"
        },
    }
})


module.exports = mongoose.model("Product", productSchema)