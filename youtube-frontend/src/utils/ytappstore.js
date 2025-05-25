import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import videoReducer from './videoSlice.js'
import VideoCommentsReducer from './VideoCommentSlice.js'
import UserChannelReducer from './UserChannelSlice.js'

// Create store for application
const appstore = configureStore({
    reducer : {
        userInfo : userReducer,
        UserChannel : UserChannelReducer,
        Videos : videoReducer,
        VideoComments : VideoCommentsReducer
    }
})

export default appstore