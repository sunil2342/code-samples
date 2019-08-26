const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const UserSchema = new Scheme({
    name: String,
    email: String,
    password: String,
    avatar: String,
    university: String,
    affiliation: String,
    research_area: String,
    social: {
        socialType: String,
        userId: String,
        accessToken: String
    },
    website: String,
    bio: String,
    socialUrls: {
        twitter: String,
        facebook: String,
        linkedIn: String
    },
    date: {
        type: Date
    },
    resetHash: String
});

module.exports = User = mongoose.model('users', UserSchema);