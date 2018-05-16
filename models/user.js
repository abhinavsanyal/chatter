// 'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
    username: {type: String, unique: true, default: ''},
    fullname: {type: String, default: ''},
    email: {type: String, unique: true},
    password: {type: String, default: ''},
    userImage: {type: String, default: 'defaultPic.png'},
    facebook: {type: String, default: ''},
    fbTokens: Array,
    google: {type: String, default: ''},
    requestSent: [{
        username: {type: String, default: ''}
    }],
    requestReceived: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        username: {type: String, default: ''}
    }],
    friendList: [{
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        friendName: {type: String, default: ''}
    }],
    totalRequest: {type: Number, default: 0},
    gender: {type: String, default: ''},
    country: {type: String, default: ''},
    mantra: {type: String, default: ''},
    favNationalTeam: [{
        teamName: {type: String, default: ''}
    }],
    favPlayer: [{
        playerName: {type: String, default: ''}
    }],
    favClub: [{
        clubName: {type: String,}
    }]
});

UserSchema.methods.encryptPassword = (password)=>{

    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));

}

// do not use arrow function since arrow function does not support this keyword binding
UserSchema.methods.isValidPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

const Users = mongoose.model('Users', UserSchema);


module.exports = Users ;



