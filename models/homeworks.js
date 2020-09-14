const { Schema, model } = require('mongoose')

const schema = new Schema({
    peer_id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        min: '2020-09-01',
    }
})

module.exports = model('Homework', schema)