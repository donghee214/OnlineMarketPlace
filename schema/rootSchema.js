const graphql = require('graphql')
const ProductSchema = require('./productSchema')
const CartSchema = require('./cartSchema')

const { ProductQueries, ProductMutations } = ProductSchema
const { CartQueries, CartMutations } = CartSchema
const { GraphQLObjectType, GraphQLSchema } = graphql

// merge both product and cart queries
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		...ProductQueries,
		...CartQueries,
	}
})

// merge both product and car mutations
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		...ProductMutations,
		...CartMutations
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})