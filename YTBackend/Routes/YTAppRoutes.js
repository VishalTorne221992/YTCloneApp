import { createUser, getAllUsers } from "../Controllers/UserController.js";
import "dotenv/config.js"
import { Strategy } from "passport-local"
import User from "../Models/UserModel.js"
import jwt from 'jsonwebtoken'
import { addComment,  addVideo, getVideoByID, createChannel, 
         getVideos, getVideoComments, updateComment, 
         deleteComment, getChannelVideos, getChannelInfo, 
         getChannels, updateVideo, deleteVideo, UpdateChannelBanner, 
         UpdateChannelImage, updateChannelInfo, DeleteChannel } from "../Controllers/Videocontroller.js";

export function routes(app, passport){

    // Using passport local strategy to get the user email and password and authenticate with stored user

    passport.use(new Strategy({usernameField: 'email'}, User.authenticate()))
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    // registering the user and storing the user information in the database
    app.post('/api/register', createUser)

    // get all users route
    app.get('/api/users', getAllUsers)

    // using the passport.authenticate method to authenticate the user in the local DB
    app.post('/api/login', passport.authenticate('local'), function (req, res) {

        console.log(req.session)
        console.log(req.sessionID)
        console.log(req.session.passport.user)
        console.log(req.user)

        // get the user info from the request in order to sign the user with jwt
        let user = { userID : req.user._id, name : req.user.Firstname}
        const accesstoken = jwt.sign(user, process.env.JWT_TOKEN_SECRET, { expiresIn : "2h"})

        // res.cookie("token", accesstoken , {
        //     withCredentials: true,
        //     httpOnly: false
        // })

        // After successful login and send the response to the browser with the user and token for authorization
        res.status(201).json({ message : "User Logged in successfully", success : true , userID : req.user._id, username : req.user.Firstname, accountName: req.user.Firstname + " " + req.user.Lastname, handle : req.user.username, pic : req.user.profilepic, channels : req.user.Channels, token : accesstoken })
    })

    // Created a cartAuth route to authorize the user so that only user with the correct token 
    // and authorization can only view the cart or add item
    app.get('/api/UserAuth', authenticateUser, function (req, res){
           console.log('Verified User', req.user)
           console.log('session', req.session)
           res.send({ success : true, message : 'Authorization successful', user : req.user.userID})
    })

    // Created a checkoutAuth route to check if only user with valid token and valid user can 
    // access the checkout page
    app.get('/api/checkoutAuth', authenticateUser , function (req, res) {
        res.send({ success : true, message : 'Authorization successful', user : req.user.userID})
    })

    // Session expired middleware to check if the jwt token is expired and valid 
    function SessionExpiredMiddleware(req, res, next){
        console.log('session expired please login')
        next();
    }


    // checking the Login access status to allow only the logged in user with correct token
    // and valid token without expiration can access the site and can edit information
    const checkLoginStatus = async (req, res, next) => {

        let { message } = req.body;
        
             
        if(message == 'TokenExpiredError'){
            
            SessionExpiredMiddleware(req, res, next)

        }
        next();
        
    }

    app.delete('/api/logoutSession', checkLoginStatus, function (req, res) {

        console.log('user verified for logout', req.user)
        req.logout(function (err){
            if(err) console.log(err);
            console.log('session deleted')
        });

        // if successful logout then create a guest user if no one is logged in currently 
        let user = { userID : 100, name : 'Guest'}
        console.log('session after deletion',req.session)
        res.status(200).json({ success : true, message : "Logged Out Successfully", userID : user.userID , user : user.name})
    })

    // logout route to delete the current user and current user session 
    // and using the cart status middleware to check for valid user to logout  
    app.delete('/api/logout', checkLoginStatus, async (req, res) => {

        let { userid, message} = req.body;

        console.log('user verified for logout', req.user)
        req.logout(function (err){
            if(err) console.log(err);
            console.log('session deleted')
        });

        // if successful logout then create a guest user if no one is logged in currently 
        let user = { userID : 100, name : 'Guest'}
        console.log('session after deletion',req.session)
        res.status(200).json({ success : true, message : "Logged Out Successfully", userID : user.userID , user : user.name})
    })



    // authenticateUser middleware used to check the for valid token so that sent in the 
    // authorization header and allow only the valid users with valid token verified by jwt
    // to access the protected routes and forbid the others

    function authenticateUser(req, res, next){
        
        // get token from request header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1]
        console.log('token in middleware', token)

        // return null if not found
        if(token == null) return res.sendStatus(401)

        // verify with the secret to obtain the valid user from the serialized user
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
           if(err) return res.status(401).json({ success : false, message : err.name, user : 'Guest', userID : 100});
           req.user = decoded
           next()
        })
    }


    // Video routes

    app.post('/api/AddVideo', addVideo)

    app.get('/api/AllVideos', getVideos)

    app.put('/api/updateVideo', updateVideo)

    app.delete('/api/deleteVideo', deleteVideo)


    // Channel routes

    app.post('/api/createChannel', createChannel);

    app.get('/api/video/:id', getVideoByID);

    app.get('/api/getChannelVideos', getChannelVideos);

    app.get('/api/ChannelInfo/:id', getChannelInfo)

    app.get('/api/UserChannels/:id', getChannels)

    app.put('/api/updateChannelBanner', UpdateChannelBanner)

    app.put('/api/updateChannelImage', UpdateChannelImage)

    app.put('/api/UpdateChannelInfo', updateChannelInfo)

    app.delete('/api/channel/DeleteChannel', DeleteChannel)
    

    // Comment routes

    app.post('/api/AddComment', addComment)

    app.get('/api/getComments/:id', getVideoComments)

    app.put('/api/updateComment', updateComment);

    app.delete('/api/deleteComment', deleteComment);
}