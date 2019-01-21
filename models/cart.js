const mongoose = require('mongoose')
const Schema = mongoose.Schema

// store the product id of the item in the cart
const cartSchema = new Schema({
	items: Array
})

module.exports = mongoose.model('Cart', cartSchema)