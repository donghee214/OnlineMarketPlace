const mongoose = require('mongoose')
const Schema = mongoose.Schema

// store the title, price, and inventory_count for a product
const productSchema = new Schema({
	title: String,
	price: Number,
	inventory_count: Number
})

module.exports = mongoose.model('Product', productSchema)