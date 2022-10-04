require('dotenv').config();

const connect = require('./db/connect');
const Product = require('./models/product');

const jsonProducts = require('./produts.json');