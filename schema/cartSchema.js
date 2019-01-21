const graphql = require('graphql')
const Cart = require('../models/cart')
const Product = require('../models/product')
const ProductSchema = require('./productSchema')
const { ProductType } = ProductSchema

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} = graphql

// totalCost: derived from the accumulation of the price of the products in cart
// items: the id of products that been added to this cart
const CartType = new GraphQLObjectType({
	name: 'Cart',
	fields: () => ({
		id: { type: GraphQLID },
		totalCost: { 
			type: GraphQLInt,
			async resolve(parent, args){
				const items = await Promise.all(parent.items.map((id) => Product.findById(id)))
				return items.reduce((currentCost, item) => currentCost + item.price, 0)
			}
		},
		items: { 
			type: new GraphQLList(ProductType),
			async resolve(parent, args){
				return await Promise.all(parent.items.map((id) => Product.findById(id)))
			}
		}
	})
})

// cart: fetch an individual cart by id
// carts: fetch all carts 
const CartQueries = {
	cart:{
		type: CartType,
		args: { id: { type: GraphQLID }},
		resolve(parent, args){
			return Cart.findById(args.id)
			}
	},
	carts:{
		type: new GraphQLList(CartType),
		resolve(parent, args){
			return Cart.find({})
		}
	}
}

// createCart: initialize a new cart with no items
// addToCart: pass in a cart id and a product id to add at that item
// checkoutCart: for each product id, decrement it's inventory_count by one if it's still in stock
const CartMutations = {
	createCart: {
		type: CartType,
		resolve(parent, args){
			const cart = new Cart({ items: [] })
			return cart.save()
		}
	},
	addToCart:{
		type: CartType,
		args:{
			id: { type: new GraphQLNonNull(GraphQLID)},
			itemId: { type: new GraphQLNonNull(GraphQLID)}
		},
		resolve(parent, args){
			return Cart.findOneAndUpdate(
				{ _id: args.id },
				{ $push: { items: args.itemId }},
			)
		}
	},
	checkoutCart: {
		type: GraphQLString,
		args: {
			id: { type: new GraphQLNonNull(GraphQLID) }
		},
		async resolve(parent, args){
			const _checkstockAndUpdate = async (id) => {
				const product = await Product.findById(id)
				if(product.inventory_count > 0){
					product.inventory_count -= 1
					return product.save()
				}
				throw new Error('Not enough inventory_count, unable to fufill all orders!')
			}
			const cart = await Cart.findById(args.id)
			for(let i = 0; i < cart.items.length; i ++){
				await _checkstockAndUpdate(cart.items[i])
			}
			cart.remove()
			return 'Successfully checked out all orders!'
		}
	}
}

module.exports = {
	CartType,
	CartQueries,
	CartMutations
}