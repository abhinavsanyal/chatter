// 'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({
    username: {type : String  },
    fullname : { type : String , default: ''},
    email: { type : String ,  trim: true , unique : true },
    password: {type : String ,  default: ''},
    userImage: {type: String , default : 'default.png' },
    facebook: {type: String, default: ''},
    fbTokens: Array,
    google: {type: String, default: ''},
    googleTokens: Array

});

UserSchema.methods.encryptPassword = (password)=>{

    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));

}

// do not use arrow function since arrow functio does not support this keyword binding
UserSchema.methods.isValidPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

const Users = mongoose.model('Users', UserSchema);


module.exports = Users ;
