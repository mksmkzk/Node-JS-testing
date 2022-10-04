const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product Name is required']
    },
    price: {
        type: Number,
        required: [true, 'Product Price is required']
    },
    featured:{
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    company: {
        type: String,
        enum: {
            values:['ikea', 'liddy', 'caressa', 'marcos'],
            message: '{VALUE} is not supported'
        }
    }
        // enum: ['ikea', 'liddy', 'caressa', 'marcos']
});

