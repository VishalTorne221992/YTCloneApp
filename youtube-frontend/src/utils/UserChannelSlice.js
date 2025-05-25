import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Define the async thunk for fetching products and category data

  export const fetchChannelInfo = createAsyncThunk('categories/fetchChannelInfo', async (id) => {
    const response = await fetch(`http://localhost:4002/api/ChannelInfo/${id}`);
    const jsonData = await response.json();
    return jsonData;
  });

  export const fetchUserChannelData = createAsyncThunk('YoutubeClone/fetchUserChannelData', async (id) => {
    const response = await fetch(`http://localhost:4002/api/UserChannels/${id}`);
    const jsonData = await response.json();
    console.log('userchannels', jsonData);
    return jsonData;
  });


const UserChannelSlice = createSlice({
    name: 'YTBVideoComments',
    initialState : {
        CurrentChannelUser : '',
        Channeldetails : [],
        UserChannels : [],
        ChannelVideos : [],
        loading : false,
        error : null
    },
    reducers:{
      AddCurrentUser : (state, action) => {
          state.CurrentChannelUser = action.payload.UserID
      },
      AddChannel : (state, action) => {
        
         if(state.CurrentChannelUser == action.payload.UserLoggedIn){
            state.UserChannels.push(action.payload.NewChannelInfo)
         }
         
      },

      UpdateVideoState : (state, action) => {

        state.ChannelVideos = state.ChannelVideos.map((ChannelVideo) => {
            if(ChannelVideo._id === action.payload.videoID){
                return (
                    ChannelVideo.title = action.payload.VideoTitle,
                    ChannelVideo.videoUrl = action.payload.VideoUrl,
                    ChannelVideo.thumbnailUrl = action.payload.thumbnailUrl,
                    ChannelVideo.description = action.payload.VideoDescription
                )
            }
            return ChannelVideo;
        })
                                  
      },

      DeleteVideoState : (state, action) => {
          
          state.ChannelVideos = state.ChannelVideos.filter((video) => video._id !== action.payload.VideoID);
      },

      updateChannelBanner : (state, action) => {
          state.Channeldetails.channelBanner = action.payload.ChangedBanner;
      },

      UpdateChannelImage : (state, action) => {
        state.Channeldetails.channelImg = action.payload.ChangedImage;
      },

      UpdateChannelInfo : (state, action) => {

        state.Channeldetails.channelname = action.payload.ChannelName,
        state.Channeldetails.channelImg = action.payload.ChannelImg,
        state.Channeldetails.handle = action.payload.Handle,
        state.Channeldetails.description = action.payload.ChannelDescription

      },

      DeleteChannel : (state, action) => {

           state.UserChannels.filter((channel) => channel._id = action.payload.channelID)
           state.ChannelVideos.filter((channelVideo) => channelVideo.channelId = action.payload.channelID)
      
      }

    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchChannelInfo.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchChannelInfo.fulfilled, (state, action) => {

            state.loading = true;
            state.Channeldetails = action.payload.ChannelInfo;
            state.CurrentChannelUser = action.payload.ChannelInfo.owner;

          })
          .addCase(fetchChannelInfo.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(fetchUserChannelData.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchUserChannelData.fulfilled, (state, action) => {

            state.loading = false;
            state.UserChannels = action.payload.Channels;
            state.ChannelVideos = action.payload.UserChannelVideos;

          })
          .addCase(fetchUserChannelData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
      },
})

export const { AddCurrentUser, AddChannel, UpdateVideoState, DeleteVideoState, updateChannelBanner, 
  UpdateChannelImage, UpdateChannelInfo, DeleteChannel } = UserChannelSlice.actions;

export default UserChannelSlice.reducer;