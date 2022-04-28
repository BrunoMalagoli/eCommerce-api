const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    id: {type: Number, required: true},
    timestamp: Number,
    productos: Object
})

module.exports = mongoose.model("Cart", cartSchema)