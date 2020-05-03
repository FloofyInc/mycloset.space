require('dotenv').config() // to grab something from .env file

var Outfit = require("../models/Outfit"); // grabbed the Outfit model (schema), made a reference to the table, can run actions on the table
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

// tells the import function what's being imported when this is being imported as an API
// this one function is being exported and it contains the following properties aka endpoints
// the server is imported into the API so that it can be defined 
module.exports = function(app) {

    // post request = create new outfit
    app.post('/api/outfit', withAuth, (req, res) => {
        // who is the current user (get email stored in token)
        var token = req.headers.cookie.split("=")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailhash);

        // grab the rest of the data using body of request
        // body is a JavaScript object and has all the data we need to create item
        var formData = req.body;
        var outfit = {
            owner:email,
            // formData is an object, so we can access picture using dot notation
            name: formData.name,
            tags: formData.tags,
            items: formData.items
        }

        // mongoDB function create will use the data to create object in database
        // return either data or err to callback function
        Outfit.create(outfit, (err, data)=> {
            if (err) return res.status(400).json({msg:err});
            // json is basically a dictionary, the data is under the key "items"
            else return res.status(200).json({item:data});
        });
    });

    // delete outfit
    app.delete('/api/outfit', withAuth, (req, res) => {
        Outfit.deleteOne({_id:req.body.id}, (err, data) => {
            if (err) return res.status(400).json({msg:err});
            // json is basically a dictionary, the data is under the key "items"
            else return res.status(200).json({item:data});
        });
    });

    // if the item already exists, update it
    // assumes the user changed all the tags / items and wants to save those changes
    app.put('/api/outfit', withAuth, (req, res) => {
        // get the email of owner from token 
        var token = req.headers.cookie.split("=")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailhash);

        // get the unique field of a specific item (id)
        var formData = req.body;
        var outfit = {
            owner:email,
            // formData is an object, so we can access picture using dot notation
            name: formData.name,
            tags: formData.tags,
            items: formData.items
        }

        // updateOne is a mongoDB function (search parameter, $set is a specific function to set a given object in place of searched object)
        // as usual, the function sends err / data to callback function
        Outfit.updateOne({_id:formData.id},{$set:outfit},(err,data) => {
            if (err) return res.status(400).json({msg:err});
            else return res.status(200).json({outfits:data});
        })
    });

    // get items, query the database and get ALL outfits for the current user
    app.get('/api/outfit', withAuth, (req, res) => {
        // get the email of owner from token 
        var token = req.headers.cookie.split("=")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailhash);

        Outfit.find({owner: email}, (err, data) => {
            // find is mongoDB function and when it's finished, it looks at this callback function
            // 1) check if there is an err or if there is no data given by find
            // res.status(400) sets the status in the server
            // .json({msg:err}) returns the error data object into a json object (string)
            if (err) return res.status(400).json({msg:err});
            // json is basically a dictionary, the data for this user is under the key "outfits"
            else return res.status(200).json({outfits:data});
        });
    });


};