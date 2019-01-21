const graphql = require('graphql')
const Product = require('../models/product')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql

const ProductType = new GraphQLObjectType({
	name: 'Product',
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		price: { type: GraphQLInt },
		inventory_count: { type: GraphQLInt }
	})
})

// product: fetch an individual product given an id
// products: fetch all products, with a arg to specify whether to only return in stock products
const ProductQueries = {
	product: {
		type: ProductType,
		args: { id: { type: GraphQLID }},
		resolve(parent, args){
			return Product.findById(args.id)
		}
	},
	products: {
		type: new GraphQLList(ProductType),
		args: { inStock: { type: GraphQLBoolean}},
		resolve(parent, args){
			if(args.inStock){
				return Product.find({ inventory_count: {$gt : 0} })
			}
			return Product.find({})
		}
	},	
}

// purchaseProduct: decrement the inventory count by one of the given product id if it's in stock
// addProduct: add a new product with the relevant metadata about it
const ProductMutations = {
	purchaseProduct: {
		type: ProductType,
		args: {
			id: { type: GraphQLID }
		},
		async resolve(parent, args){
			const product = await Product.findById(args.id)
			if(product.inventory_count > 0){
				product.inventory_count -= 1
				return product.save()
			}
			else{
				throw new Error('Not enough inventory_count!')
			}
		}
	},
	addProduct: {
		type: ProductType,
		args: {
			title: { type: new GraphQLNonNull(GraphQLString) },
			price: { type: new GraphQLNonNull(GraphQLInt) },
			inventory_count: { type: new GraphQLNonNull(GraphQLInt)}
		},
		resolve(parent, args){
			const product = new Product({
				title: args.title,
				price: args.price,
				inventory_count: args.inventory_count
			})
			return product.save()
		}
	},
}

module.exports = {
	ProductType,
	ProductQueries,
	ProductMutations
}