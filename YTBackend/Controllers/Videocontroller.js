import Video from '../Models/VideoModel.js'
import Channel from '../Models/ChannelModel.js'
import User from '../Models/UserModel.js';
import Comment from '../Models/CommentModel.js'
import { uploadToCloudinary } from '../Utils/cloudinary.js'


// Add video to a Channel
export const addVideo = async (req, res) => {

    let { title, VideoUrl, ThumbnailUrl, description, channelId, uploader, views, duration, likes, dislikes} = req.body;

    let channelName = await Channel.findOne({ _id : channelId })

    let foundVideo = await Video.findOne({ videoUrl: VideoUrl })

    if(foundVideo){
        return res.status(500).json({ success : false , message : "Video already added"})
    }

    const video = new Video({
        title: title,
        videoUrl: VideoUrl,
        thumbnailUrl: ThumbnailUrl,
        description: description,
        channelId: channelId,
        uploader: uploader,
        ChannelName: channelName.channelname,
        ChannelImage: channelName.channelImg,
        views: views,
        duration: duration,
        likes: likes,
        dislikes: dislikes
    })

    const channel = await Channel.findOne({ _id : channelId})

    if(channel){
        try{

            let newVideo = await video.save();
            console.log('successfully saved')
            channel.videos.push(newVideo._id);
            await channel.save()
            res.send(newVideo);

         }catch(error){
              console.log('error while saving video', error);
         }
    }else{
        res.send({ message : "Error saving video data"})
    }
 
}


// Get a Video by ID 
export const getVideoByID = async (req, res) => {
     
    let id = req.params.id; 

    try {

        let video = await Video.findOne({ _id : id })

        let channelVideos = await Video.find({ channelId : video.channelId })

        res.json({ success : true, message : "video available", video : video, ChannelVideos : channelVideos })

    } catch (error) {

        res.json({ success : false, message : 'video not found', error : error })

    }
}

// Update a video information url, Description and so on
export const updateVideo = async (req, res) => {

    let { userID, videoID, thumbnailUrl, VideoTitle, VideoUrl, VideoDescription } = req.body;

    let VideoimageData = {}

     try {

        if(thumbnailUrl){
            const results = await uploadToCloudinary(thumbnailUrl, "my-profile")
            VideoimageData = results
        }
        console.log('video thumbnail upload successful', VideoimageData)
     } catch (error) {
        console.log('error uploading video thumbnail');
        return res.json({success : false, message: 'error uploading video thumbnail image', error: error})
     }

    try {
        
        await Video.findOneAndUpdate({ _id : videoID, uploader : userID } , {
            $set : { title : VideoTitle, videoUrl : VideoUrl, thumbnailUrl : VideoimageData.url, description : VideoDescription }
        }, { new : true }).then(data => {
            res.send({ success: true, message : 'updated Video successfully', UpdatedVideo : data})
        }).catch(err => {
            res.send({ success : false, message : "error updating comments", error : err})
        })

    } catch (error) {
        res.send({ sucess : false, message : "error updating comment", error : error})
    }

}

// Delete Video
export const deleteVideo = async (req, res) => {

    let { userID, VideoID } = req.body;

    try {
        
        await Video.deleteOne({ _id : VideoID, uploader : userID }).then(data => {
            res.send({ success: true, message : 'Deleted Video successfully', DeletedVideo : data})
        }).catch(err => {
            res.send({ success : false, message : "Error Deleting Video mongoose", error : err})
        })

    } catch (error) {
        res.send({ success : false, message : "Error in Deleting Video ", error : error})
    }

}

// Get all videos
export const getVideos = async (req, res) => {

    try{

        const videos = await Video.find({});
        res.json({success: true, videos : videos})

    }catch(error){
        res.json({ success : false, message : 'Error getting videos'})
    }

}

// Create a Channel from information images, handle name and Channel name
export const createChannel = async (req, res) => {

     let { channelName, handle, userID, description, ChannelImage } = req.body;

     let foundChannel = await Channel.findOne({ channelname : channelName})

     if(foundChannel){
        return res.status(500).json({ success : false, message : "channel is already added with the name. Please use another name"})
     }

     let channelimageData = {}

     try {

        if(ChannelImage){
            const results = await uploadToCloudinary(ChannelImage, "my-profile")
            channelimageData = results
        }
        console.log('image upload successful', channelimageData)
     } catch (error) {
        console.log('error uploading channel image');
        return res.json({success : false, message: 'error uploading channel image', error: error})
     }

     
     let newChannel = new Channel({
        channelname: channelName,
        channelImg : channelimageData.url,
        handle: handle,
        owner: userID,
        description: description,
        channelBanner : 'https://thedogcoachedinburgh.co.uk/wp-content/themes/variations/assets/images/island/island-banner-about.jpg',
        subscribers : '3k'
     })

     const UserFound = await User.findOne({ _id : userID})
     
     if(UserFound){

        try{

            let Channel = await newChannel.save();
            UserFound.Channels.push(Channel._id)
            await UserFound.save();
            res.send(Channel)

         }catch(error){
            res.send({ message : "error saving channel", error : error})
         }

     }else{
         res.send({ message : "User not found !!"})
     }
  
}


// Channel info updation
export const updateChannelInfo = async (req, res) => {

    let { userID, ChannelID, ChannelName, ChannelHandle, ChannelDescription, ChannelChangedImage} = req.body;

    let channelChangeimageData = {}

     try {

        if(ChannelChangedImage){
            const results = await uploadToCloudinary(ChannelChangedImage, "my-profile")
            channelChangeimageData = results
        }
        console.log('image upload successful', channelChangeimageData)
     } catch (error) {
        console.log('error uploading channel image');
        return res.json({success : false, message: 'error uploading channel image', error: error})
     }

     try {
        
        await Channel.findOneAndUpdate({ _id : ChannelID, owner : userID } , {
            $set : { channelname : ChannelName, handle : ChannelHandle, channelImg : channelChangeimageData.url, description : ChannelDescription }
        }, { new : true }).then(data => {
            res.send({ success: true, message : 'updated Channel successfully', UpdatedChannelInfo : data})
        }).catch(err => {
            res.send({ success : false, message : "error updating Channel Info", error : err})
        })

    } catch (error) {
        res.send({ sucess : false, message : "Internal error updating Channel", error : error})
    }

}

// Update Channel image
export const UpdateChannelImage = async (req, res) => {

    let { userID, ChannelID, ChannelChangedImage} = req.body;

    let channelChangeImgData = {}

     try {

        if(ChannelChangedImage){
            const results = await uploadToCloudinary(ChannelChangedImage, "my-profile")
            channelChangeImgData = results
        }
        console.log('image upload Channel Image successful', channelChangeImgData)
     } catch (error) {
        console.log('error uploading channel image');
        return res.json({success : false, message: 'error uploading channel Image', error: error})
     }

     try {
        
        await Channel.findOneAndUpdate({ _id : ChannelID, owner : userID } , {
            $set : { channelImg : channelChangeImgData.url }
        }, { new : true }).then(data => {
            res.send({ success: true, message : 'updated Channel Image successfully', UpdatedChannelImage : data})
        }).catch(err => {
            res.send({ success : false, message : "error updating Channel Images", error : err})
        })

       } catch (error) {
            res.send({ sucess : false, message : "Internal error updating Channel", error : error})
       }

}


// Update Channel Banner
export const UpdateChannelBanner = async (req, res) => {

    let { userID, ChannelID, ChannelChangedBanner} = req.body;

    let channelChangeBannerData = {}

     try {

        if(ChannelChangedBanner){
            const results = await uploadToCloudinary(ChannelChangedBanner, "my-profile")
            channelChangeBannerData = results
        }
        console.log('image upload Channel Banner successful', channelChangeBannerData)
     } catch (error) {
        console.log('error uploading channel image');
        return res.json({success : false, message: 'error uploading channel Banner', error: error})
     }

     try {
        
        await Channel.findOneAndUpdate({ _id : ChannelID, owner : userID } , {
            $set : { channelBanner : channelChangeBannerData.url }
        }, { new : true }).then(data => {
            res.send({ success: true, message : 'updated Channel Banner successfully', UpdatedChannelData : data})
        }).catch(err => {
            res.send({ success : false, message : "error updating Channel Banner", error : err})
        })

       } catch (error) {
            res.send({ sucess : false, message : "error updating Channel banner", error : error})
       }

}


// Delete Channel with Info and also from user information
export const DeleteChannel = async (req, res) => {

     let { userID, channelID } = req.body;

     let successResponse = '';
     let errorResponse = ''

     try {

        const user = await User.findOne({ _id : userID })
        
        if(user){
            user.Channels.pull({_id : channelID})
            await user.save();

            await Channel.deleteOne({ _id : channelID, owner : userID }).then(async (data) => {
                successResponse += 'Channel deleted successfully';
            }).catch(err => {
                errorResponse += 'Error Deleting Channel mongoose'
            })
        } 

        let DeletedVideos = await Video.find({ channelId : channelID })
            
            console.log('Deleted Videos', DeletedVideos)
            
            await Comment.deleteMany({ video : { $in : DeletedVideos} }).then(async (data) => {
                successResponse += 'Channel videos comment deleted successfully'
    
                await Video.deleteMany({ channelId : channelID }).then(data => {
                    successResponse += 'Channel videos successfully'
                }).catch(err => {
                    errorResponse += 'Error Deleting Channel videos mongoose'
                })
                
            }).catch(err => {
                errorResponse += 'Error Deleting Channel videos comments mongoose'
            })


        return res.json({ success : true, message : "Channel Successfully deleted with contents", SiteResponse : successResponse})

    } catch (error) {
        return res.json({ success : false, message : "Error in Deleting Channel video comments", error : errorResponse})
    }

}

// Get all Channel videos
export const getChannelVideos = async (req, res) => {

    let { channelId } = req.body;

    try {
        let channelVideos = await Video.find({ channelId: channelId })
        res.status(200).json({ success : true, message : "successfully found videos", videos : channelVideos})
    } catch (error) {
        res.status(500).json({ success: false, message : "error finding videos", error : error})
    }
    
}

// Get Channel information
export const getChannelInfo = async (req, res) => {

    let channelId = req.params.id;

    try {

        let channelinfo = await Channel.findOne({ _id : channelId })
        res.json({ success : true, message : 'successfully got channel data', ChannelInfo : channelinfo})
        
    } catch (error) {
        res.json({ success : false, message : 'error finding channel data', error : error})
    }

}

// Get Channels of a specific user
export const getChannels = async (req, res) => {

    let channelID = req.params.id;
    
    try{

        let channel = await Channel.findOne({ _id : channelID})

        let userChannels = await Channel.find({ owner : channel.owner })

        let UserChannelvideos = await Video.find({ channelId : channelID })

        res.json({ success: true, message : 'successfully found channels', Channels : userChannels, UserChannelVideos : UserChannelvideos})
        
    }catch(error){
        res.json({ success : false, message : 'error finding channels', error : error})
    }
}


// Add a comment
export const addComment = async (req, res) => {

    let { userID, videoId, comment } = req.body;

    const user = await User.findOne({ _id : userID })

    const video = await Video.findOne({ _id: videoId })

    console.log('user found', user, video)

    if(user && video){

        let newComment = new Comment({
            user : user._id,
            video: videoId,
            user_pic: user.profilepic,
            text : comment
        })

        try{

           let comment = await newComment.save();
           console.log('comment saved successfully');
           video.comments.push(comment);
           await video.save();
           res.json({ success : true, Comment : comment, user_picture : user.profilepic })

        }catch(error){
            
           res.json({ success: false , message : "error saving comment"})

        }
    }else{
         res.json({ success : false , message : 'user or video does not exist'})
    }

}

// Get comments of a video base on id
export const getVideoComments = async (req, res) => {

    let videoId = req.params.id;

    try{

        let comments = await Comment.find({ video: videoId })
        res.json({ success : true, comments : comments})

    }catch(error){
        res.json({success : false, message : 'Error getting comments', error : error})
    }
    

}

// update a comment
export const updateComment = async (req, res) => {
    
    let { userID, commentID, comment } = req.body;

    try {
        
        await Comment.findOneAndUpdate({ _id : commentID, user : userID } , {
            $set : { text : comment }
        }, { new : true }).then(data => {
            res.send({ success: true, message : 'updated successfully', comment : data})
        }).catch(err => {
            res.send({ success : false, message : "error updating comments", error : err})
        })

    } catch (error) {
        res.send({ sucess : false, message : "error updating comment", error : error})
    }



}

// Delete a comment
export const deleteComment = async (req, res) => {

    let { userID, commentID } = req.body;

    try {
         await Comment.deleteOne({ _id: commentID, user : userID }).then(data => {
              res.status(200).json({ success : true, message : "Successfully deleted comment", comment : data})
         }).catch(err => {
            res.status(500).json({ success : false, message : "error deleting comment", error : err})
         })
    } catch (error) {
         res.status(500).json({ success: false , message : "internal error deleting comment", error : error })
    }

}
