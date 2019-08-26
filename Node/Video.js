var mongoose = require('mongoose');

// define the schema for our user model
var videoSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    title: {
        type: String,
        required:true
    },
    first_author: {
        type: String,
        required:true
    },
    additional_author: {
        type: String,
        required:false
    },
    description: {
        type: String,
        required: true
    },
    generalLink: {
      type: String
    },
    generalName: String,
    abstract: String,
    doi: String,
    videoEtag: {
      type: String,
      required: true,
      unique: true
    },
    videoUrl: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// create the model for users and expose it to our app
const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
