/*
  Description: This is the setup of the nodeJS server, with the routes of the rest api.
  Author: Vitor Veras
  Creation date:  02/12/2017
*/

//call packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//setup app variable for bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//setup listening
var port = process.env.port || 3000;

//setup routes instance
var router = express.Router();

//test route
router.get('/',function (req,res) {
    res.json({ message: "Welcome to XYZ store"})
});

//setup /api as root route for our rest api
app.use('/api',router);

//running
app.listen(port);
console.log("Running server on port "+port);
