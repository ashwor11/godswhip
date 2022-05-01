const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({
    entry: {
        type: String,
        required: true,
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    topic:{
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    updatedAt: {
        type: Date
    },
    likes: {
        count:{type: Number, default: 0},
        authors:{type: [String], default: []}
    }
    

})

const Entry = new mongoose.model('entry', entrySchema);

module.exports = Entry;