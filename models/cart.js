const fs = require('fs');
const path = require('path');

const cartPathwayFile = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(cartPathwayFile, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            };

            if (!err) {
                cart = JSON.parse(fileContent);
            }

            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(
                prod => prod.id === id
            );
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            // Add new product or increase quantity of the existing product.
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;   // qty is a property that gets added.
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 }; // the new object that is added into our cart.
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice; // updates pricing.

            fs.writeFile(cartPathwayFile, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    };
};
