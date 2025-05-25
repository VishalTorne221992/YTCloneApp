import mongoose from "mongoose";
import { Schema } from "mongoose"

// Video model to store video data 
const videoSchema = new mongoose.Schema({
    title : {
        type: String,
        required : [true, "title is required"]
    },
    videoUrl : {
        type: String,
        required : [true, "Last name is required"]
    },
    thumbnailUrl : {
        type: String,
        required: [true, 'Thumbnail url required']
    },
    description : {
        type : String,
        required: [true, "description is required"],                                               
    },
    channelId : { type: Schema.Types.ObjectId, ref: 'Channel' },
    uploader : [{ type: Schema.Types.ObjectId, ref: 'User' }],
    ChannelName : {
         type: String,
         required : [true, "Channel Name required"]
    },
    ChannelImage : {
         type: String,
         required : [true, "Channel Image required for video"]
    },
    views : {
        type : Number,
        required: [true, "Views is required"]
    },
    duration : {
        type: String,
        required : [true, "Duration of the video required"]
    },
    likes : {
        type : Number,
        required: [true, "Likes is required"]
    },
    dislikes : {
        type : Number,
        required: [true, "Dislikes is required"]
    },
    uploadDate : {
        type: Date,
        default: Date.now
    },
    comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

const Video = mongoose.model('video', videoSchema);


export default Video;