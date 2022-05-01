const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const topicSchema = new Schema({
    topic: {
        type: String,
        require: true,
        unique: true
    },
    date: {
        type: Date,
        require: true,
        default: Date.now()
    },
    entries: {
        type: [mongoose.Schema.Types.ObjectId],
        require: true,
        default: []
    }
})


const Topic = new mongoose.model('topic',topicSchema)

module.exports = Topic;