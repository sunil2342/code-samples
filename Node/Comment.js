var mongoose = require('mongoose');

// define the schema for our user model
var CommentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Video'
    },
    commentBody: {
        type: String,
        required:true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// create the model for users and expose it to our app
const Comment = mongoose.model('comments', CommentSchema);

module.exports = Comment;