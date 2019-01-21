const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/rootSchema');
const mongoose = require('mongoose');

const app = express()

// put in your own mongodb uri credentials here!
mongoose.connect("mongodb://shopifyDemo:shopify123@ds161804.mlab.com:61804/shopifychallenge")

// establish connection with the database
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

// route all graphql endpoints to the root schema
app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: true
}))

app.listen(4000, () => {
	console.log('now listening on port 4000')
})
