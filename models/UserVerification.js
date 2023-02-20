const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserVerificationSchema = new mongoose.Schema({
    userId: String,
    uniqueId: String,
    createdAd: Date,
    expiresAt: Date
});



const UserVerification = mongoose.model('UserVerification', UserVerificationSchema);

module.exports = UserVerification;