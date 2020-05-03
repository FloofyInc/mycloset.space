require('dotenv').config()
var mongoose = require('mongoose');

let db = mongoose.connection;
db.once('open', () => console.log('connected to the database: Outfit'));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

/**
 * Outfit Schema
 */
var outfitSchema = new Schema({
    // mongoDB generates a hidden unique ID for every item in the database

    owner: { type: String, required: true},

    name: { type: String, required: true },

    tags: [
        String
    ],

    items: [
        String
    ]
},
{ timestamps: true });


module.exports = mongoose.model('Outfit', outfitSchema);