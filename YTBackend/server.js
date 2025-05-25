import { config } from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import passport from 'passport'
import { routes } from './Routes/YTAppRoutes.js'
import flash from 'express-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'node:path'
import { resolve } from 'node:path';
const { Schema } = mongoose;

// create a express app
const app = express();

config();

// use neccessary packages for parsing json, cookie and using session in the app. 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : false}))
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
app.use(flash())
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized : false
}))

// use passport package of nodejs for authentication of the user and login
app.use(passport.initialize());
app.use(passport.session())

// add cors package to allow cors
app.use(cors({ 
    origin: true,
    credentials : true}));

// connect mongoose to mongodb atlas using the connect method and a connection string obtained
// by creating a database in mongodb atlas
async function connectToDB(){
    try {
        await mongoose.connect("mongodb+srv://vt221992:hhp8cQWPiEc5t9dr@youtubeclonecl.7nme80b.mongodb.net/?retryWrites=true&w=majority&appName=YoutubeCloneCL");
        console.log('Connected to mongoDB');
    } catch (error) {
        console.log('error connecting mongodb',error);
    }
}
connectToDB();


// get connection
const db = mongoose.connection;


// when database is connected show connection successful or error

db.on("open", () => {
    console.log("DB Connection successful");
})

db.on("error", () => {
    console.log("DB connection failed");
})

// run validators provided for the mongoose schema
mongoose.set('runValidators', true)


let PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

console.log("connected api")


// eslint-disable-next-line no-undef
// if(process.env.NODE_ENV == "production"){

//         const filename = fileURLToPath(import.meta.url)
//         const dirname = path.dirname(filename)
        
//         app.use(express.static(path.resolve(dirname,'dist')))

//         app.get('/*', (req, res) => {    
//              res.sendFile(path.resolve(dirname,'index.html'))
//         })

// }

//serveStatic(app, express);

// created a separate routes file for all app route handling and authentication/authorization
routes(app, passport)