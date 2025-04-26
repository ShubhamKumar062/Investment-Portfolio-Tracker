const mongoose = require('mongoose');
const userModels = require('./userModels');

const assetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModels', // use the model name as a string
    },
    assetName: {
        type: String,
    },
    symbol: {
        type: String,
    },
    assetType: {
        type: String,
        enum: ['Stocks', 'Commodities', 'Forex', 'Bonds', "ETSs", "Cryptocurrencies"],
    },
    Quantity: {
        type: Number,
    },
    purchaseDate: {
        type: Date,
    },

    currentPrice: {
        type: Number,
    },
    logoUrl: {
        type: String,
    }

});

const asset = mongoose.model('asset', assetSchema);

module.exports = asset;
