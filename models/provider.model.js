const mongoose = require('mongoose');
require('../config/db_mongo'); 

const objectSchema = {
    company_name: {
        type: String,
        required: true,
        unique: true
    },
    CIF: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    url_web: {
        type: String,
        required: true
    }
};

const providerSchema = mongoose.Schema(objectSchema);

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;