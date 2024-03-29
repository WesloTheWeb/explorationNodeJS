const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        requried: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, price, imageUrl, description, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     // we were always creating empty id object, ternary fixes this.
//     this.userId = userId
//   };

//   save() {
//     const db = getDb();
//     let db0p;

//     if (this._id) {
//       // update the product
//       db0p = db.collection('products')
//         .updateOne({ _id: this._id }, { $set: this })
//     } else {
//       // insert the product
//       db0p = db.collection('products')
//         .insertOne(this);
//     };

//     return db0p.then(result => {
//       console.log(result);
//     })
//       .catch(err => console.log(err));
//   };

//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products')
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log(products);
//         return products
//       })
//       .catch(err => console.log(err));
//   };

//   static findById(prodId) {
//     const db = getDb();
//     return db.collection('products')
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch(err => console.log(err));
//   };

//   static deleteById(prodId) {
//     const db = getDb();
//     return db.collection('products')
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then(result => {
//         console.log('Deleted');
//       })
//       .catch(err => console.log(err))
//   };
// };

// module.exports = Product;
module.exports = mongoose.model('Products', productSchema);