var mongoose = require('mongoose');

// define the schema for our user model
var videoViewsSchema = mongoose.Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'views'
    },
    requestFromIp: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// create the model for users and expose it to our app
const VideoViews = mongoose.model('VideoViews', videoViewsSchema);

exports.View = VideoViews;