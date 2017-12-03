/*
  Description: This is the setup of the nodeJS server, with the routes of the rest api.
  Author: Vitor Veras
  Creation date:  02/12/2017
*/

//CALL PACKAGES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Product = require('./app/models/product');
mongoose.Promise = global.Promise;

//SETUP BODYPARSER
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//SETUP MONGOOSE
//cloud platform -> MLAB URI
// mongoose.connect('mongodb://<dbusername>:<dbpassword>@ds044577.mlab.com:44577/node-crud-restapi', {
//     useMongoClient: true
// });

//SETUP MONGOOSE
//Local platform -> MONGODB
mongoose.connect('mongodb://localhost:27017/node-crud',{
   useMongoClient:true
});

//RUN SERVER ON PORT 3000
var port = process.env.port || 3000;


/* ---------------------------
     R O U T E S - S E T U P
   ---------------------------
*/

//Router instance
var router = express.Router();
//setup middleware
router.use(function (req, res, next) {
    console.log("request");
    next();
});
//setup /api as root route
app.use('/api', router);

//Setup /api'/' - GET - WELCOME PAGE
router.get('/', function (req, res) {
    res.json({message: "Wecome to XYZ store!!"});
});

/* ----------------------------
     IMPLEMENTED CRUD METHODS
   ----------------------------
*/
/* [1st-ROUTE] - '/products' - used for (1)GET ALL & (2)POST METHOD */
router.route('/products')
/* --------------------------------------------------------------------
     (1) CREATE PRODUCT - (POST) - http://localhost:3000/api/products
   --------------------------------------------------------------------*/
    .post(function (req, res) {
        var products = new Product();//instance of Product()-(name,amount,description)
        //fill attributes with requested body
        products.name = req.body.name;
        products.amount = req.body.amount;
        products.description = req.body.description;
        //response
        products.save(function (error) {
            if (error)
                res.send('Failed to register new product. ERROR: ' + error);
            res.json({message: "product successfully registered"});
        });
    })
    /* ---------------------------------------------------------------------
         (2) READ ALL PRODUCTS - (GET) - http://localhost:3000/api/products
       ---------------------------------------------------------------------*/
    .get(function (req, res) {
        Product.find(function (error, products) {
            if (error)
                res.send("Failed to show products. ERROR: " + error);
            res.json(products);
        });
    });

/* [2nd-ROUTE] - '/products/:product_id' - used for ((2)GET, (3)PUT AND (4)DELETE) by id */
router.route('/products/:product_id')
/* ----------------------------------------------------------------------------------------
      (2) READ ONE PRODUCT(by id) - (GET) - http://localhost:3000/api/products/product_id
   ----------------------------------------------------------------------------------------*/
    .get(function (req, res) {
        Product.findById(req.params.product_id, function (error, product) {
            if (error)
                res.send('error: ' + error);
            res.json(product);
        })
    })
    /* ---------------------------------------------------------------------------------------
          (3) UPDATE PRODUCT(by id) - (PUT) - http://localhost:3000/api/products/product_id
       ---------------------------------------------------------------------------------------*/
    .put(function (req, res) {
        //serch a product by id - with id in req
        Product.findById(req.params.product_id, function (error, product) {
            if (error)
                res.send('error: ' + error);
            //update attributes of the product with req fields
            product.name = req.body.name;
            product.amount = req.body.amount;
            product.description = req.body.description;
            //save
            product.save(function (error) {
                if (error)
                    res.send('Failed to update product. ERROR: ' + error);
                res.json({message: 'Product update successful!'});
            });
        });
    })
    /* ---------------------------------------------------------------------------------------
         (4) DELETE PRODUCT(by id) - (DELETE) - http://localhost:3000/api/products/product_id
       ---------------------------------------------------------------------------------------*/
    .delete(function (req, res) {
        Product.remove({
            _id: req.params.product_id
        }, function (error) {
            if (error)
                res.send('Unable to find product by id. Failed to remove. ERROR: '+error);
            res.json({message: 'Product deleted successful!'});
        });
    });
//RUN SERVER ON PORT 3000
app.listen(port);
console.log("Running server on port " + port);
