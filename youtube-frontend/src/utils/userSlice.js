import { createSlice, current } from '@reduxjs/toolkit';



// using slices to manage the state of the cart like adding, updating and deleting
// of items
const userSlice = createSlice({
    name: 'user',
    initialState : {
        userID : "100",
        username : 'Guest',
        AccountName : '',
        handle : '',
        profilepic : "https://img.icons8.com/?size=100&id=7820&format=png&color=000000",
        Channels : [],
        isAuthenticated : false
    },
    reducers : {
        loggedInUser : (state, action) => {
            
            state.userID = action.payload.userID,
            state.username = action.payload.username,
            state.AccountName = action.payload.AccountName,
            state.handle = action.payload.handle,
            state.profilepic = action.payload.pic,
            state.Channels = action.payload.Channels,
            state.isAuthenticated = action.payload.isAuthenticated
            
        },

        loggedOutUser : (state, action) => {
            state.userID = action.payload.userID,
            state.username = action.payload.username,
            state.profilepic = "https://img.icons8.com/?size=100&id=7820&format=png&color=000000",
            state.Channels = [],
            state.isAuthenticated = action.payload.isAuthenticated
        },

        userDeleteChannel : (state, action) => {
            state.Channels = state.Channels.filter((channel) => channel !== action.payload.channelID)
        }
    }
})

export const { loggedInUser, loggedOutUser } = userSlice.actions;

export default userSlice.reducer;