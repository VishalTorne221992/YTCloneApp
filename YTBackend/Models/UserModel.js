import mongoose from "mongoose";
import passsportLocalMongoose from 'passport-local-mongoose'
import Channel from '../Models/ChannelModel.js'
import Comment from '../Models/CommentModel.js'
import { Schema } from "mongoose"

// Created a user schema to store user information to accessed from mongodb
// this schema is used by passport middleware package for storing in DB and authentication
const userSchema = new mongoose.Schema({
    Firstname : {
        type: String,
        required : [true, "First name is required"]
    },
    Lastname : {
        type: String,
        required : [true, "Last name is required"]
    },
    username: {
        type: String,
        required: [true, "username required"]
    },
    email : {
        type : String,
        required: [true, "Email is required"],
        unique: true                                               
    },
    profilepic : {
        type : String,
    },
    Channels : [{ type: Schema.Types.ObjectId, ref: 'Channel' }]
})

// passport plugin to authenticate the user with login info
userSchema.plugin(passsportLocalMongoose,{usernameField: 'email'});

const User = mongoose.model('user', userSchema);

export default User;