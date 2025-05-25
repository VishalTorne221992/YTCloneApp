import mongoose from "mongoose";
import { Schema } from "mongoose"

// Channel Schema to store Channel information
const channelSchema = new mongoose.Schema({
    channelname : {
        type: String,
        required : [true, "channel name is required"]
    },
    channelImg : {
        type: String,
        required : [true, "Channel Image is required"]
    },
    handle: {
        type: String,
        required : [true, "handle is required"]
    },
    owner : { type: Schema.Types.ObjectId, ref: 'User' },
    description : {
        type : String,
        required: [true, "description is required"]                                               
    },
    channelBanner : {
        type : String,
        required: [true, "Channel Banner is required"]
    },
    subscribers: {
          type: String,
          required: [true, "Subscribers required"]
    },
    videos : [{ type: Schema.Types.ObjectId, ref: 'Video' }]
})


const Channel = mongoose.model('channel', channelSchema);

export default Channel;