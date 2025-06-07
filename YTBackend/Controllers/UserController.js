import User from "../Models/UserModel.js"
import Channel from '../Models/ChannelModel.js'
import Video from '../Models/VideoModel.js'

// create user and save to mongodb
export const createUser = async (req, res) => {

    let { Firstname, Lastname, email, password, Username, profilepic} = req.body
    console.log('sent email', email)

         try {
             
             User.register(new User({ Firstname: Firstname, email: email, 
                Lastname: Lastname, username: Username, profilepic: profilepic }), password, async (err, user) => {
                if(err){
                    res.json({ success : false, message : 'Your account could not be saved. Error:' + err})
                }else{

                    const newChannel = await Channel.create({
                        channelname: Username,
                        channelImg: profilepic,
                        handle: Username,
                        owner: user._id,
                        description: 'Welcome to official Youtube Channel',
                        channelBanner: 'https://thedogcoachedinburgh.co.uk/wp-content/themes/variations/assets/images/island/island-banner-about.jpg',
                        subscribers: '0'
                    })
            
                     try{
                        await User.updateOne({ email: email }, { $push: { Channels: { $each: [newChannel._id] } } });
                     }catch (error){
                        console.log('channel error',error)
                     }

                     
                    req.login(user, function(err){
                        if(err){
                            res.json({ success : false, message : err});
                        }else{
                            res.json({ success : true, message : "Your account has been saved"})
                        }
                    })
                }
             })

             
         } catch (error) {
             res.status(500).send({
                 message : error.message })
         }

    
}

// get all user information from mongodb
export const getAllUsers = async (req, res) => {
    const users = await User.find({})
    res.send(users)
}
