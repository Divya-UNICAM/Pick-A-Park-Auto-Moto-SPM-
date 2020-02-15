const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    id: {
        type: String
    },
    intent: {
        type: String
    },
    purchase_units: {
        type: Object
    },
    payer: {
        name: {
            type:Object
        },
        email_address: {
            type: String
        },
        payer_id: {
            type: String
        },
        address: {
            type: Object
        }
    },
    create_time: {
        type: Date
    },
    update_time: {
        type: Date
    },
    links: {
        type: Object
    },
    status: {
        type: String
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);