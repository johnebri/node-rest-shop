const mongoose = require('mongoose');
const Product = require('../models/product');


exports.products_get_all = (req, res, next) => {
    Product.find()
    .select('name price _id productImage' )
    .exec()
    .then(docs => {
         const response = {
             count : docs.length,
             products: docs.map(doc => {
                 return {
                     // product: doc,
                      name: doc.name,
                      price: doc.price,
                      productImage: doc.productImage,
                      _id: doc._id,
                     request: {
                         type: 'GET',
                         url: 'http://localhost:3000/products/' + doc._id
                     }
                 }
             })
         };
     //    if (docs.length >= 0) {
             res.status(200).json(response );
     //    } else {
     //        res.status(404).json({
     //            message: 'No entries found '
     //        });
     //    }
         
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
 };

 exports.products_create_product = (req, res, next) => {
    const product = new Product({
         _id: new mongoose.Types.ObjectId(),
         name :req.body.name,
         price: req.body.price,
         productImage: req.file.path
    });
    product.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            ceratedProduct : {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }

            }
        });
    })
    .catch(err =>  {
        console.log(err);
        res.status(500).json({
            erro: err
        })
    });
    
};

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        res.status(200).json({
            product: doc,
            request: {
                type: 'GET',
                url: 'http://localhost/products'
            }
        });
    })
    .catch(err => {
        console.log(err);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: "NO valid entry found for id provided"
            });
        }
        res.status(500).json({error: err});
    })
};

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
   Product.update({_id: id}, {$set: updateOps })
   .exec()
   .then(result => {
       res.status(200).json({
           message : 'Product updated',
           request: {
               type: 'GET',
               url: 'http://localhost:3000/product/' + id
           }
       });       
   })
   .catch(err => {
       console.log(err);
       res.status(500).json({
           error: err
       });
   });
};

exports.products_delete = (req, res, next) => {
    const id = req.params.productId;
   Product.remove({_id: id})
   .exec()
   .then(result => {
       res.status(200).json({
           message: 'Product deleted',
           request :{
               type : 'POST',
               url: 'http://localhost:3000/products',
               body: { name: 'String', price: 'Number'}
           }
       });
   })
   .catch(err => {
       console.log(err);
       res.status(500).json({
           error: err
       })
   });
 };