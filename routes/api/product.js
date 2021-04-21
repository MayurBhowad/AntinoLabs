const express = require('express');
const passport = require('passport');
const router = express.Router();

//models
const Product = require('../../models/Product');

//@route    GET api/product/tests
//@desc     Test product Route
//@access   Public
router.get('/tests', (req, res) => res.json({ msg: "Products WOrks" }));

//@route    GET api/product/allproduct
//@desc     get All product Route
//@access   Private
router.get('/allproducts', passport.authenticate('jwt', { session: false }), (req, res) => {
    Product.find({})
        .then(products => res.json(products))
        .catch(err => console.log(err))
});

//@route    GET api/product/:productid
//@desc     get product by id Route
//@access   Private
router.get('/:productid', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { productid } = req.params;
    Product.find({ _id: productid })
        .then(product => res.json(product))
        .catch(err => console.log(err))
});

//@route    POST api/product/addproduct
//@desc     Add products
//@access   Private
router.post('/addproduct', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { user } = req;

    const newProduct = new Product({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_description: req.body.product_description,
        product_stock: req.body.product_stock
    });

    if (user.role === 'admin') {
        return newProduct.save()
            .then(ress => res.json(newProduct))
            .catch(err => console.log(err));
    } else {
        res.json({ message: 'You are Not Authorized!' })
    }
});

//@route    POST api/product/updateproduct
//@desc     Update products
//@access   Private
router.post('/updateproduct/:productid', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { productid } = req.params;
    const { user } = req;

    const updatedProduct = {}
    if (req.body.product_name) updatedProduct.product_name = req.body.product_name;
    if (req.body.product_price) updatedProduct.product_price = req.body.product_price;
    if (req.body.product_description) updatedProduct.product_description = req.body.product_description;
    if (req.body.product_stock) updatedProduct.product_stock = req.body.product_stock;

    if (user.role === 'admin') {
        Product.findByIdAndUpdate(
            { _id: productid },
            { $set: updatedProduct },
            { new: true }
        ).then(product => res.json(product))
    } else {
        res.json({ message: 'You are Not Authorized!' })
    }
})

//@route    DELETE api/product/deleteproduct
//@desc     Delete products
//@access   Private
router.delete('/deleteproduct/:productid', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { productid } = req.params;
    const { user } = req;
    if (user.role === 'admin') {
        Product.findByIdAndRemove(productid).then(() => res.json({ success: true }));
    } else {
        res.json({ message: 'You are Not Authorized!' })
    }
});



module.exports = router;