const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_stock: {
        type: String,
        default: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Product = mongoose.model('products', productSchema);