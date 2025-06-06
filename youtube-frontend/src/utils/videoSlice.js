import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Define the async thunk for fetching products and category data
export const fetchVideosData = createAsyncThunk('products/fetchVideosData', async () => {
    const response = await fetch('https://ytcloneappservice.onrender.com/api/AllVideos');
    const jsonData = await response.json();
    return jsonData;
  });

  // export const fetchCategoriesData = createAsyncThunk('categories/fetchCategoriesData', async () => {
  //   const response = await fetch('https://dummyjson.com/products/category-list');
  //   const jsonData = await response.json();
  //   return jsonData;
  // });



const videoSlice = createSlice({
    name: 'YTBVideos',
    initialState : {
        //categories : [],
        videos : [],
        loading : false,
        error : null
    },
    reducers:{
       DeleteChannelVideos : (state, action) => {
           state.videos = state.videos.filter((video) => video.channelId !== action.payload.channelID)
       }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchVideosData.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchVideosData.fulfilled, (state, action) => {
            state.loading = true;
            state.videos = action.payload;
          })
          .addCase(fetchVideosData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          // .addCase(fetchCategoriesData.pending, (state) => {
          //   state.loading = true;
          // })
          // .addCase(fetchCategoriesData.fulfilled, (state, action) => {
          //   state.loading = false;
          //   state.categories = action.payload;
          // })
          // .addCase(fetchCategoriesData.rejected, (state, action) => {
          //   state.loading = false;
          //   state.error = action.error.message;
          // });
      },
})

export const { DeleteChannelVideos } = videoSlice.actions;

export default videoSlice.reducer;
