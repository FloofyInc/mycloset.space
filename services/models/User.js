require('dotenv').config()
var mongoose = require('mongoose');

let db = mongoose.connection;
db.once('open', () => console.log('connected to the database: User'));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

/**
 * User Schema
 */
var userSchema = new Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    firstname : {
        type: String,
        required: true 
    },
    lastname : {
        type: String,
        required: true 
    },
    location : {
        type: String,
        required: true 
    },
    dob: {
        type: Date
    }
},
{ timestamps: true });


module.exports = mongoose.model('User', userSchema);
