require('dotenv').config()
var mongoose = require('mongoose');

let db = mongoose.connection;
db.once('open', () => console.log('connected to the database: Item'));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

/**
 * Item Schema
 */
var itemSchema = new Schema({

    picture: { data: Buffer, contentType: String, required: true },

    name: { type: String, required: true },

    category: { type: String, required: true },

    tags: [
        new Schema({
            tag: String
        })
    ],

    value: {type: Number}
},
{ timestamps: true });


module.exports = mongoose.model('Item', itemSchema);
