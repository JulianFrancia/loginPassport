const mongoose = require('mongoose');
const userCollection = 'users';

const UserSchema = mongoose.Schema({
    username:{type: String, required: true},
    password:{type: String, required: true}
});

module.exports = {
    User: mongoose.model(userCollection, UserSchema)
}