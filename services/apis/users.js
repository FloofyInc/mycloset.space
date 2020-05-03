require('dotenv').config()

var Users = require("../models/User"); // grabbed the User model (schema), made a reference to the table, can run actions on the table
const withAuth = require('./middleware');
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET);
const jwt = require('jsonwebtoken'); // imported package

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

function createSession(email, req, res, data) {
    // dont want to send plain text data, want to use email in data but encode
    var emailhash = encode(email);
    
    // using the email and the secret from env file to create signed token
    // to access a parameter in .env must use process.env.<param>
    const token = jwt.sign({emailhash}, process.env.SECRET, {
        expiresIn: 60*60*100
    });
    // res.cookie('name of cookie', data of cookie {only sent as http}).status of response. data of response
    // res.cookie = sets the cookie of the response
    // res.status = sets the status of the response
    // res.json = sets the data of the response
    // res.cookie.status.json -> chained together 
    return res.cookie('token', token, { httpOnly: true }).status(200).json(data);
}


function killSession(req, res) {
    // kill session

    return res.clearCookie("token").sendStatus(200);
}

// err and data are given by FindByEmail
// password, req and res are given by signin post request
function login(err, data, password, req, res) {
    if (!err && data) {
        // not a user object, just a variable to store the email
        var user = {
            email: data.email
        };
        // if password is correct -> create a session // generate a cookie
        if (verifyPass(data, password)) return createSession(data.email, req, res, user);
        else res.status(401).json({ error: 0, msg: "Incorrect Password" });
    } 
    else return res.status(401).json({ error: 1, msg: "Email does not exists" });
}


function verifyPass(data, password) {
    if (!data || !password) return false;
    // compareSync comes with the imported package to compare
    // the hashed password and the given password
    // returns boolean
    return bcrypt.compareSync(password, data.password);;
}

function findByEmail(email, callback) {
    // findOne is a function that comes with mongoDB to find exactly one row
    // that matches the given data (email)
    Users.findOne({email: email}, callback);
}

function findByUsername(username, callback) {
    // findOne is a function that comes with mongoDB to find exactly one row
    // that matches the given data (username)
    Users.findOne({username: username}, callback);
}

function getAll(callback) {
    Users.find({}, callback);
}

// data is formData which contains email and password
function createUser(data, callback) {
    // creates a salted hash of the password (privacy) to be stored
    var salt = bcrypt.genSaltSync(15);
    var pass = bcrypt.hashSync(data.password, salt);
    // create a User object 
    var user = {
        email: data.email,
        password: pass,
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        location: data.location,
        dob:data.dob
    };
    // use the schema to create that object in the database
    Users.create(user, callback);
}

module.exports = function(app) {

    // Authentication
    // app.post took 2 params: an endpoint and a callback function
    // callback function is special because it always sends back a request and response in that order
    app.post('/api/signup', (req, res) => {
        var formData = req.body;
        // findByEmail gave 2 params: email and an entire callback function
        findByEmail(formData.email, (err, data) => {
            if (err || !data) {
                // email doesn't exist we are good
                createUser(formData, (err, data) => {
                    // respond (res) with error code 400 and a message
                    if (err) return res.status(400).json({error: err, msg:"Failed to create user."});
                    // no error, create Session aka cookie that we can send back 
                    // there is no callback because this is the last step in signing up so it has a response already
                    else return createSession(formData.email, req, res, {email: formData.email});
                });
            } 
            else {
                return res.status(401).json({ error: 0, msg: "Email exists" });
            }
        });
    });

    // signout / signinn don't require withAuth b/c the user doesn't need to be signed in to perform these actions
    // every other action while logged in must use middleware withAuth
    app.post('/api/signout', (req, res) => {
        return killSession(req, res);
    });

    app.post('/api/signin', (req, res) => {
        // grabs the first and second parameter of req.body which is given by http
        // email, password are just variable names for those parameters 
        const formData = req.body;
        if (formData.email) {
            findByEmail(formData.email, (err, data) => {
                return login(err, data, formData.password, req, res);
            });
        }
        else if (formData.username) {
            findByUsername(formData.username, (err, data) => {
                return login(err, data, formData.password, req, res);
            });
        }
        
    });

    app.get('/api/checkToken', withAuth, function(req, res) {
        var token = req.headers.cookie.split("=")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
        var email = decode(decoded.emailhash);
        
        findByEmail(email, function(err, data) {
            res.status(200).json({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                isAdmin: data.admin,
                id: data._id
            });
        });
    });
};