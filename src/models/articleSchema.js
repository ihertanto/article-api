const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        es_indexed:true
    },
    body: {
        type: String,
        required: true,
        trim: true,
        es_indexed:true
    },
    publish: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = articleSchema