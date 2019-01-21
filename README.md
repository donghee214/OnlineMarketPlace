<h2>Running Locally</h2>

1) Clone this repo

2) cd into the folder and run <code>npm install --save</code>

3) run <code>node app.js</code>

<h2>Design Choices</h2>

1) GraphQL because you know, challenge accepted. In all honesty though, I don't think GraphQL is being fully utilized with this
application due to a lack of meaningful relationship between objects. However, features like "also bought with" or "other sellers"
would generate more relationships and then I can see it being a great fit for this use case.


2) I chose to have total cost as a derived value rather than a stored one in the db, as I felt it took up unnecessary space. 
When a user checks their cart, I need to lookup the product IDs for the title of the product anyway, why not just calculate 
the total cost at the same time?


3) To ensure that I'm working with the most up to date model, I chose to make the checkout cart API synchronous as these transactions
can only happen if the stock if greater than 0.


4) I went with a NoSQL database as the requirements looked a little bare bone, so I assumed further changes and additions to the schema
were expected.


<h2>API Documentation</h2>

To get a dynamic version via graphiql run locally, and go to localhost:4000/graphql!

<h3>Object Schemas</h3>
<h4>Product</h4>

<code>id: ID</code>
<code>title: String</code>
<code>price: Int</code>
<code>inventory_count: Int</code>

<h4>Cart</h4>

<code>id: ID</code>
<code>totalCost: Int</code>
<code>items: [Product]</code>



<h3>RootQueries</h3>

<h5>product(id: ID): Product</h5> 
Pass in the product id to fetch the product

<h5>products(inStock: Boolean): 
[Product]</h5> Get all the products, and if the provided boolean is true, it'll only fetch products that are in stock, the default is false

<h5>cart(id: ID): Cart</h5> 
Pass in the cart id to the cart

<h5>carts: [Cart]</h5> 

Get all the carts active right now


<h3>Mutations</h3>

<h5>purchaseProduct(id: ID): Product</h5>
Pass in the product id, to decrement its inventory_count by 1. Will return an error if it's out of stock

<h5>addProduct(title: String!, price: Int!, inventory_count: Int!): Product</h5>
Add a product, by providing the title, price, and inventory_count

<h5>createCart: Cart</h5>
Create a new cart

<h5>addToCart(id: ID!itemId: ID!): Cart</h5>
Pass in the cart id as id, and an item id as itemId, to add the product id to the specified cart 

<h5>checkoutCart(id: ID!): String</h5>

Pass in the cart id to synchronously purchase each item in cart.items. If successful, the cart will be deleted and a success message
is returned. If one of the items are out of stock, it will return an error message instead
