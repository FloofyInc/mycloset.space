require('dotenv').config() // to grab something from .env file

var Item = require("../models/Item"); // grabbed the Item model (schema), made a reference to the table, can run actions on the table
const withAuth = require('./middleware'); // to check if logged in
const Cryptr = require('cryptr'); // decoding / enconding anything including email (for token)
const cryptr = new Cryptr(process.env.SECRET); // decoding / enconding
const jwt = require('jsonwebtoken'); // imported package to manipulate token 

// encrypts the email for use in a cookie
function encode(email) {
    if (!email) return "";
    return cryptr.encrypt(email);
}

// decrypts the email in a cookie for authentication purposes (ex. checkToken)
function decode(email) {
    if (!email) return "";
    return cryptr.decrypt(email);
}

// create item

// delete item

// update item

// tells the import function what's being imported when this is being imported as an API
// this one function is being exported and it contains the following properties aka endpoints
// the server is imported into the api so that it can be defined 
module.exports = function(app) {

    // general format of endpoints (create/post/delete) is identified in the request name (get/post/delete)
    // name of the route can be the item that the request acts on "ex. get catalogue, delete catalogue"

    // post request = create something new
    app.post('/api/item', withAuth, (req, res) => {
        // who is the current user (get email stored in token)
        var token = req.headers.cookie.split("=")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailhash);

        // grab the rest of the data using body of request
        // body is a JavaScript object and has all the data we need to create item
        var formData = req.body;
        var item = {
            owner:email,
            // formData is an object, so we can access picture using dot notation
            picture: formData.picture,
            name: formData.name,
            category: formData.category,
            tags: formData.tags,
            value: formData.value
        }

        // mongoDB function create will use the data to create object in database
        // return either data or err to callback function
        Item.create(item, (err, data)=> {
            if (err) return res.status(400).json({msg:err});
            // json is basically a dictionary, the data is under the key "items"
            else return res.status(200).json({item:data});
        });
    });

    // delete item
    app.delete('/api/item', withAuth, (req, res) => {
        Item.deleteOne({_id:req.body.id}, (err, data) => {
            if (err) return res.status(400).json({msg:err});
            // json is basically a dictionary, the data is under the key "items"
            else return res.status(200).json({item:data});
        });
    });

    // if the item already exists, update it
    app.put('/api/item', withAuth, (req, res) => {
        // get the email of owner from token 
        var token = req.headers.cookie.split("=")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailhash);

        // get the unique field of a specific item (id)
        var formData = req.body;
        var item = {
            owner:email,
            // formData is an object, so we can access picture using dot notation
            picture: formData.picture,
            name: formData.name,
            category: formData.category,
            tags: formData.tags,
            value: formData.value
        }

        // updateOne is a mongoDB function (search parameter, $set is a specific function to set a given object in place of searched object)
        // as usual, the function sends err / data to callback function
        Item.updateOne({_id:formData.id},{$set:item},(err,data) => {
            if (err) return res.status(400).json({msg:err});
            else return res.status(200).json({items:data});
        })
    });

    // get items, query the database and get ALL items for the current user
    app.get('/api/item', withAuth, (req, res) => {
        // get the email of owner from token 
        var token = req.headers.cookie.split("=")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailhash);
        // (err, data) are the 2 params
        // => {} defines the function 
        // this is a callback function but it's not being named
        Item.find({owner: email}, (err, data) => {
            // find is mongoDB function and when it's finished, it looks at this callback function
            // 1) check if there is an err or if there is no data given by find
            // res.status(400) sets the status in the server
            // .json({msg:err}) returns the error data object into a json object (string)
            if (err) return res.status(400).json({msg:err});
            // json is basically a dictionary, the data is under the key "items"
            else return res.status(200).json({items:data});
        });
    });


};