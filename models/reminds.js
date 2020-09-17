const { Schema, model } = require('mongoose')

const schema = new Schema({
    peer_id: {
        type: String,
        required: true,
    },
    group_id: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        min: '2020-09-01',
        required: true,
    }
})

module.exports = model('Remind', schema)