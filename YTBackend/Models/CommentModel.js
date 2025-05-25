import mongoose from "mongoose";
import { Schema } from "mongoose"

// Comment Schema
const commentSchema = new mongoose.Schema({

    user : { type: Schema.Types.ObjectId, ref: 'User' },
    user_pic : {
          type: String,
          required : [true, "user picture is required"]
    },
    video : { type: Schema.Types.ObjectId, ref: 'Video' },
    text : {
        type: String,
        required : [true, "comment is required"]
    },
    likes : {
        type: Number,
        default: 0
    },
    dislikes : {
        type: Number,
        default: 0
    },
    timestamp : {
        type : Date,
        default: Date.now,                                              
    }
})


const Comment = mongoose.model('comment', commentSchema);

export default Comment;