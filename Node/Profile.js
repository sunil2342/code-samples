const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    website: {
        type: String
    },
    bio: {
        type: String
    },
    social: {
        twitter: {
            type: String,
        },
        facebook: {
            type: String,
        },
        linkedIn: {
            type: String,
        }
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);