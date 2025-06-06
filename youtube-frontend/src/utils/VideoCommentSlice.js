import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Define the async thunk for fetching products and category data
export const fetchVideoComments = createAsyncThunk('YoutubeClone/fetchVideoComments', async (id) => {
    const response = await fetch(`https://ytcloneappservice.onrender.com/api/getComments/${id}`);
    const jsonData = await response.json();
    console.log('returned from video comments', jsonData)
    return jsonData;
  });

  // export const fetchCategoriesData = createAsyncThunk('categories/fetchCategoriesData', async () => {
  //   const response = await fetch('https://dummyjson.com/products/category-list');
  //   const jsonData = await response.json();
  //   return jsonData;
  // });



const VideoCommentSlice = createSlice({
    name: 'YTBVideoComments',
    initialState : {
        VideoComments : [],
        loading : false,
        error : null
    },
    reducers:{
        UpdateCommentState : (state, action) => {

              state.VideoComments = state.VideoComments.map((comment) => {
                  if(comment._id === action.payload.userID){
                      return comment.text = action.payload.updatedText;
                  }
                  return comment;
              })
                                        
            },

        AddCommentState : (state, action) => {
              state.VideoComments.push(action.payload)
        },

        DeleteCommentState : (state, action) => {

          state.VideoComments = state.VideoComments.filter((comment) => comment._id !== action.payload.commentID)
        }
    
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchVideoComments.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchVideoComments.fulfilled, (state, action) => {
            state.loading = true;
            state.VideoComments = action.payload.comments;
          })
          .addCase(fetchVideoComments.rejected, (state, action) => {
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

export const { UpdateCommentState, AddCommentState, DeleteCommentState } = VideoCommentSlice.actions;

export default VideoCommentSlice.reducer;
