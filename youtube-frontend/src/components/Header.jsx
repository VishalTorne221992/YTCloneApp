import React, { useEffect, useRef, useState } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'
import LogoSection from './LogoSection'
import { useSelector, useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { loggedInUser, loggedOutUser } from '../utils/userSlice.js'
import { AddChannel } from '../utils/UserChannelSlice.js'
import { Edit, ArrowBigLeft, XSquareIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useClickAway from '../hooks/useClickAway.jsx'
import useResizeObserver from '@react-hook/resize-observer'


export default function Header({ toggleSidebar, setSearchFlag, SearchText, setSearch, setFiltered }) {

  const [registerModelOpen, setregisterModelOpen] = useState(false);
  const [LoginModelOpen, setLoginModelOpen] = useState(false);
  const [ChannelModelOpen, setChannelModelOpen] = useState(false)
  const [successStatus, setSuccessStatus] = useState('')
  const [ManageUser, setManageUser] = useState(false);
  const [ChannelImage, setChannelImage] = useState(null);
  const [UserProfileImage, setUserProfileImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [SearchVideoflag, setSearchVideoFlag] = useState(false)
  const [fullscreen, setFullScreen] = useState(false);

  let dispatch = useDispatch();
  const navigate = useNavigate();

  let searchInputRef = useRef(null)
  let AllVideos = useSelector(store => store.Videos.videos);
  let userID = useSelector(store => store.userInfo.userID);
  let username = useSelector(store => store.userInfo.username);
  let profilepicture = useSelector(store => store.userInfo.profilepic);
  let Authenticated = useSelector(store => store.userInfo.isAuthenticated);
  let ChannelsUser = useSelector(store => store.userInfo.Channels)
  let AccountName = useSelector(store => store.userInfo.AccountName)
  let handle = useSelector(store => store.userInfo.handle)

  const [size, setSize] = useState(0);
  const target = useRef(null);
  const BackSearchRef = useRef(null)
  const bodyRef = useRef(document.body)
  const userImg = useRef(null)

  const useSize = (target) => {

    React.useLayoutEffect(() => {
      setSize(target.current.getBoundingClientRect())
    }, [target])

    // Where the magic happens
    useResizeObserver(target, (entry) => setSize(entry.contentRect))
    return size
  }

  let ScreenWidth = useSize(bodyRef)

  useEffect(() => {

    const searchbar = document.querySelector('.searchbox')
    const searchClose = document.querySelector('.backSearch')
    const signinbox = document.querySelector('.user_content')
    const menuSidebar = document.querySelector('.xsticky')
    const SearchButton = document.querySelector(".SearchBtn")

    if (SearchVideoflag) {
      if (ScreenWidth.width <= 384) {

        searchbar.style.width = '80%'
        searchbar.style.margin = '0'
        searchbar.style.position = 'absolute'
        searchbar.style.right = '1.2rem'
        searchInputRef.current.style.display = 'inline'
        searchClose.style.display = 'block'
        searchClose.style.width = '3rem'
        searchClose.style.height = '2rem'
        signinbox.style.display = 'none'
        menuSidebar.style.display = 'none'

      } else if (ScreenWidth.width <= 448 && ScreenWidth.width > 384) {

        searchbar.style.width = '80%'
        searchbar.style.margin = '0'
        searchbar.style.position = 'absolute'
        searchbar.style.right = '1rem'
        searchInputRef.current.style.display = 'inline'
        searchClose.style.display = 'block'
        searchClose.style.width = '3rem'
        searchClose.style.height = '2rem'
        signinbox.style.display = 'none'
        menuSidebar.style.display = 'none'

      } else if (ScreenWidth.width <= 768 && ScreenWidth.width > 448) {

        searchbar.style.width = '85%'
        searchbar.style.margin = '0'
        searchbar.style.position = 'absolute'
        searchbar.style.right = '3rem'
        searchInputRef.current.style.display = 'inline'
        searchClose.style.display = 'block'
        searchClose.style.width = '3rem'
        searchClose.style.height = '2rem'
        signinbox.style.display = 'none'
        menuSidebar.style.display = 'none'

      } else if (ScreenWidth.width <= 992 && ScreenWidth.width > 768) {

        searchbar.style.width = '80%'
        searchbar.style.margin = '0'
        searchbar.style.position = 'absolute'
        searchbar.style.right = '5rem'
        searchInputRef.current.style.display = 'inline'
        searchClose.style.display = 'block'
        searchClose.style.width = '3rem'
        searchClose.style.height = '2rem'
        signinbox.style.display = 'none'
        menuSidebar.style.display = 'none'

      } else if (ScreenWidth.width > 992) {

        searchInputRef.current.style.display = 'inline'
        searchInputRef.current.borderBottomLeftRadius = '1rem'
        searchInputRef.current.borderTopLeftRadius = '1rem'
        searchInputRef.current.width = '100%'
        searchInputRef.current.textIndent = '1rem'
        searchInputRef.current.backgroundColor = 'white'
        SearchButton.style.width = '32px'
        searchbar.style.display = 'flex'
        searchbar.style.position = 'relative'
        searchbar.style.width = '576px'
        searchbar.style.right = '0'
        searchbar.style.backgroundColor = '#f8fafc'
        searchbar.style.border = '1px solid #90a1b9'
        searchbar.style.borderBottomLeftRadius = '16px'
        searchClose.style.display = 'none'
        signinbox.style.display = 'flex'
        menuSidebar.style.display = 'block'

      }
    }
  }, [ScreenWidth.width, SearchVideoflag])

  useEffect(() => {

    const searchbar = document.querySelector('.searchbox')
    const searchClose = document.querySelector('.backSearch')
    const signinbox = document.querySelector('.user_content')
    const menuSidebar = document.querySelector('.xsticky')
    const SearchButton = document.querySelector(".SearchBtn")

    if (fullscreen) {

      if (ScreenWidth.width <= 384 || ScreenWidth.width <= 448 || ScreenWidth.width <= 768 || ScreenWidth.width <= 992) {

        searchInputRef.current.style.display = 'none'
        SearchButton.style.width = 'max-content'
        SearchButton.style.backgroundColor = '#f8fafc'
        searchbar.style.position = 'absolute'
        searchbar.style.width = 'max-content'
        searchbar.style.marginLeft = '40px'
        searchbar.style.border = 'none'
        searchbar.style.right = '7rem'
        searchClose.style.display = 'none'
        signinbox.style.display = 'flex'
        menuSidebar.style.display = 'block'

      } else if (ScreenWidth.width > 992) {

        searchInputRef.current.style.display = 'inline'
        searchInputRef.current.borderBottomLeftRadius = '1rem'
        searchInputRef.current.borderTopLeftRadius = '1rem'
        searchInputRef.current.borderTopRightRadius = '1rem'
        searchInputRef.current.borderBottomRightRadius = '1rem'
        searchInputRef.current.width = '100%'
        searchInputRef.current.textIndent = '1rem'
        searchInputRef.current.backgroundColor = 'white'
        SearchButton.style.width = '32px'
        SearchButton.style.border = 'none'
        SearchButton.style.borderTopRightRadius = '1rem'
        SearchButton.style.borderBottomRightRadius = '1rem'
        searchbar.style.position = 'relative'
        searchbar.style.display = 'flex'
        searchbar.style.alignItems = 'center'
        searchbar.style.width = '576px'
        searchbar.style.right = '0'
        searchbar.style.backgroundColor = '#f8fafc'
        searchbar.style.border = '1px solid #90a1b9'
        searchbar.style.borderBottomLeftRadius = '16px'
        searchbar.style.borderBottomRightRadius = '16px'
        searchbar.style.borderTopRightRadius = '16px'
        searchbar.style.borderTopLeftRadius = '16px'
        searchClose.style.display = 'none'
        signinbox.style.display = 'flex'
        menuSidebar.style.display = 'block'

      }

    }

  }, [ScreenWidth, fullscreen])


  const videos = AllVideos.videos;

  const handleError = (err) => toast.error(err, { position: 'top-right' })

  const handleSuccess = (msg) => toast.success(msg, { position: 'top-right' })

  let localdata = localStorage.getItem('CurrentUser');

  useEffect(() => {
       if(localdata){
          console.log('Local data',localdata);
          let CurrentLoggedIn = localStorage.getItem('CurrentUser');
          let retrievedUser = JSON.parse(CurrentLoggedIn);

          let { user_ID, UserName, accountname, handleName, profilepic, ChannelsUser, token } = retrievedUser;
          Cookies.set('access-token', token)
          dispatch(loggedInUser({ userID: user_ID, username: UserName, AccountName: accountname, handle: handleName, pic: profilepic, Channels: ChannelsUser, isAuthenticated: true }))
       }
  }, [dispatch, localdata])
  


  const handleRegisterForm = async (e) => {
    e.preventDefault();

    const userRegisterationForm = document.getElementById('userRegisterForm');

    const userFormdata = new FormData(userRegisterationForm);

    let error = ''

    let fname = userFormdata.get('firstname')
    let lname = userFormdata.get('lastname') 
    let em = userFormdata.get('email'); 
    let pass = userFormdata.get('password');
    let handle = userFormdata.get('handle');

    function validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
     }

    if(fname === ''){
        error += 'Please enter firstname'
    }else if(lname === ''){
        error += 'Please enter last name'
    }else if(!validateEmail(em)){
        error += 'Please enter email'
    }else if(pass === ''){
        error += 'Please enter password'
    }else if(handle === ''){
        error += 'Please enter handle name'
    }else if(!UserProfileImage){
        error += 'Please select a image as a profile image'
    }

  
    if(error){
       console.log('error is', error)
       alert(error)
       return
    }

    const userformValues = {
      Firstname: userFormdata.get('firstname'),
      Lastname: userFormdata.get('lastname'),
      email: userFormdata.get('email'),
      password: userFormdata.get('password'),
      Username: userFormdata.get('handle'),
      profilepic: imageBase64
    }

    const requestOptions = {

      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userformValues)

    }

    try {
      const res = await fetch('https://ytcloneappservice.onrender.com/api/register', requestOptions)
      const data = await res.json();
      console.log('data', data)
      const { success, message } = data
      if (success) {
        handleSuccess(message + '. Please Login using your credentials !');
        setUserProfileImage(null);
        closeRegisterModal()
      } else {
        handleError(message)
      }
    } catch (e) {
      console.log('Error', e);
    }
  }

  function closeRegisterModal() {
    setregisterModelOpen(false);
  }

  function closeLoginModal() {
    setLoginModelOpen(false)
  }

  function closeChannelModal() {
    setChannelModelOpen(false)
  }

  function handleRegister(e) {
    e.preventDefault();

    setLoginModelOpen(false);
    setregisterModelOpen(true)
  }

  const handleInput = async (e) => {

    e.preventDefault();

    if (SearchText == '') {
      setSearchFlag(false)
      setSearchVideoFlag(false)
    }

    setSearch(e.target.value)

  }

  const handleSearch = async (e) => {

    e.preventDefault();
    setFullScreen(false);

    setSearchVideoFlag(true)

    const searchbar = document.querySelector('.searchbox')
    const searchClose = document.querySelector('.backSearch')
    const signinbox = document.querySelector('.user_content')
    const menuSidebar = document.querySelector('.xsticky')
    const SearchButton = document.querySelector(".SearchBtn")

    if (ScreenWidth.width <= 384) {

      searchbar.style.width = '75%'
      searchbar.style.margin = '0'
      searchbar.style.position = 'absolute'
      searchbar.style.right = '5px'
      searchInputRef.current.style.display = 'inline'
      searchClose.style.display = 'block'
      searchClose.style.width = '3rem'
      searchClose.style.height = '2rem'
      signinbox.style.display = 'none'
      menuSidebar.style.display = 'none'

    } else if (ScreenWidth.width <= 448 && ScreenWidth.width > 384) {

      searchbar.style.width = '80%'
      searchbar.style.margin = '0'
      searchbar.style.position = 'absolute'
      searchbar.style.right = '1rem'
      searchInputRef.current.style.display = 'inline'
      searchClose.style.display = 'block'
      searchClose.style.width = '3rem'
      searchClose.style.height = '2rem'
      signinbox.style.display = 'none'
      menuSidebar.style.display = 'none'

    } else if (ScreenWidth.width <= 768 && ScreenWidth.width > 448) {

      searchbar.style.width = '85%'
      searchbar.style.margin = '0'
      searchbar.style.position = 'absolute'
      searchbar.style.right = '3rem'
      searchInputRef.current.style.display = 'inline'
      searchClose.style.display = 'block'
      searchClose.style.width = '3rem'
      searchClose.style.height = '2rem'
      signinbox.style.display = 'none'
      menuSidebar.style.display = 'none'

    } else if (ScreenWidth.width <= 992 && ScreenWidth.width > 768) {

      searchbar.style.width = '80%'
      searchbar.style.margin = '0'
      searchbar.style.position = 'absolute'
      searchbar.style.right = '5rem'
      searchInputRef.current.style.display = 'inline'
      searchClose.style.display = 'block'
      searchClose.style.width = '3rem'
      searchClose.style.height = '2rem'
      signinbox.style.display = 'none'
      menuSidebar.style.display = 'none'

    } else if (ScreenWidth.width > 992) {

      setFullScreen(true)
      searchInputRef.current.style.display = 'inline'
      searchInputRef.current.borderBottomLeftRadius = '1rem'
      searchInputRef.current.borderTopLeftRadius = '1rem'
      searchInputRef.current.width = '100%'
      searchInputRef.current.textIndent = '1rem'
      searchInputRef.current.backgroundColor = 'white'
      SearchButton.style.width = '32px'
      searchbar.style.display = 'flex'
      searchbar.style.position = 'relative'
      searchbar.style.width = '576px'
      searchbar.style.backgroundColor = '#f8fafc'
      searchbar.style.border = '1px solid #90a1b9'
      searchbar.style.borderBottomLeftRadius = '16px'
      searchClose.style.display = 'none'
      signinbox.style.display = 'flex'
      menuSidebar.style.display = 'block'

    }

    const filter = videos.filter((video) => {
      return video.title.toLowerCase().includes(SearchText.toLowerCase());
    })

    setSearchFlag(true);
    setFiltered(filter);

  }

  function handleBackSearchBtn(e) {
    e.preventDefault();

    const searchbar = document.querySelector('.searchbox')
    const searchClose = document.querySelector('.backSearch')
    const signinbox = document.querySelector('.user_content')
    const menuSidebar = document.querySelector('.xsticky')
    const SearchButton = document.querySelector(".SearchBtn")

    if (ScreenWidth.width <= 384 || ScreenWidth.width <= 448 || ScreenWidth.width <= 768 || ScreenWidth.width <= 992) {

      searchInputRef.current.style.display = 'none'
      SearchButton.style.width = 'max-content'
      SearchButton.style.border = 'none'
      searchbar.style.display = 'flex'
      searchbar.style.position = 'absolute'
      searchbar.style.width = 'max-content'
      searchbar.style.border = 'none'
      searchbar.style.right = '7rem'

    }

    searchClose.style.display = 'none'
    signinbox.style.display = 'flex'
    menuSidebar.style.display = 'block'

    setSearchVideoFlag(false)
    setFullScreen(true)

  }

  // Handle Login when user clicks the login button
  const handleLogin = async (e) => {

    e.preventDefault();

    const userloginInfo = document.getElementById('userloginform');

    const userLoginData = new FormData(userloginInfo);

    let loginDetails = {
      email: userLoginData.get('email'),
      password: userLoginData.get('password')
    }

    const requestOptions = {

      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginDetails)

    }

    try {

      const res = await fetch('https://ytcloneappservice.onrender.com/api/login', requestOptions)
      const data = await res.json();
      const { message, success, userID, username, accountName, handle, pic, channels, token } = data
       
      if (success) {
        const LocalUser = {
         user_ID : userID,
         UserName : username,
         accountname : accountName,
         handleName : handle,
         profilepic : pic,
         ChannelsUser : channels,
         token : token  
      }
        handleSuccess(message + " Welcome, " + username);
        dispatch(loggedInUser({ userID: userID, username: username, AccountName: accountName, handle: handle, pic: pic, Channels: channels, isAuthenticated: true }))
        Cookies.set('access-token', token)
        localStorage.setItem('CurrentUser', JSON.stringify(LocalUser))
        closeLoginModal()

      } else {
        handleError(message)
        setSuccessStatus("User Already Exists with the given email !!")
      }
    } catch (e) {
      handleError('Email or Password Incorrect !')
    }

  }

  // convert image file to base64
  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    const ChangedProfileImgName = document.querySelector('#ProfileImageName');
    ChangedProfileImgName.textContent = e.target.files[0].name;
    setUserProfileImage(file);
    setFileToBase64(file);
  };

  // receive file from form
  const handleChannelImage = (e) => {
    const file = e.target.files[0];
    const ChangedFileName = document.querySelector('#ChannelNamePara');
    ChangedFileName.textContent = e.target.files[0].name;
    setChannelImage(file);
    setFileToBase64(file);
  };

  const handleCreateChannelModal = async () => {

    let customErrorMessage = 'Please Login to create Channel'

    if(username === 'Guest'){
       LogoutSession(customErrorMessage, 'Session Expired. Please Login to continue..')
       return
    }

    let accesstoken = Cookies.get('access-token')

    // Check User Authentication
    const requestOptions = {

      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${accesstoken}`,
        'Content-Type': 'application/json'
      }
    }

    try {
      const res = await fetch('https://ytcloneappservice.onrender.com/api/UserAuth', requestOptions)
      const data = await res.json()
      const { success, message, user } = data;

      if (success) {
        setChannelModelOpen(true)
      } else {
        if (message == 'TokenExpiredError') {
          LogoutSession(customErrorMessage, message)
        } else {
          dispatch(loggedOutUser({ userID: userID, username: user, isAuthenticated: false }))
          handleError('Please Login to Create a Channel !')
        }

      }

    } catch (err) {
      console.log('Error', err);
      handleError('Login Error ! Please try after sometime')
    }

  }

  // Handling Creation of User Channel
  const handleCreateChannel = async (e) => {

    e.preventDefault();

    let error = '';

    const CreateChannelData = document.getElementById('CreateChannelform');

    const NewChannelFormdata = new FormData(CreateChannelData)

    let chnname = NewChannelFormdata.get('ChannelName')
    let chnhandle = NewChannelFormdata.get('handle');

    if(chnname === ''){
      error += 'Please Enter Channel Name';
    }else if(chnhandle === ''){
      error += 'Please Enter Channel Handle (some funky name)'
    }else if(!ChannelImage){
      error += 'Please upload a channel image';
    }

    if(error){
       console.log('Channel creation error is', error)
       alert(error)
       return
    }

    // Dispatch User form data to the Server
    let NewChannelData = {
      channelName: NewChannelFormdata.get('ChannelName'),
      handle: NewChannelFormdata.get('handle'),
      userID: userID,
      description: NewChannelFormdata.get('ChannelDescription'),
      ChannelImage: imageBase64
    }

    const requestOptions = {

      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(NewChannelData)

    }

    try {

      const res = await fetch('https://ytcloneappservice.onrender.com/api/createChannel', requestOptions)
      const data = await res.json();
      console.log('Channel creation successful', data)
      dispatch(AddChannel({ NewChannelInfo : data, UserLoggedIn : userID }))
      setChannelImage(null)
      closeChannelModal();
    } catch (error) {
      setChannelImage(null)
      handleError('Error Creating Channel Please try again after sometime')
    }

  }

  function toggleManageUser() {
    setManageUser(prev => !prev)
  }

  // Handle Logout button
  const handleLogOut = async () => {

    let accesstoken = Cookies.get('access-token')

    const requestOptions = {

      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${accesstoken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userid: userID,
        message: 'user logout'
      })
    }

    try {

      const res = await fetch('https://ytcloneappservice.onrender.com/api/logout', requestOptions)
      const data = await res.json();

      const { success, message, userID, user } = data;
      if (success) {
        Cookies.remove('access-token')
        localStorage.removeItem('CurrentUser')
        setTimeout(() => {
          navigate('/')
        }, 1000);

        handleSuccess(message)
        dispatch(loggedOutUser({ userID: userID, username: user, isAuthenticated: false }))
        setManageUser(false)

      } else {
        Cookies.remove('access-token')
        setTimeout(() => {
          navigate('/')
        }, 1000);

        handleError(message)
        dispatch(loggedOutUser({ userID: userID, username: user, isAuthenticated: false }))
      }
    } catch (e) {
      handleError('Log out Error please try after sometime ...')
    }

  }

  // Handle When the user session gets expired
  const LogoutSession = async (customErrorMessage, errmsg) => {

    let accesstoken = Cookies.get('access-token')

    let checkUserSession = {
      userid: userID,
      message: errmsg
    }

    const requestOptions = {

      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${accesstoken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkUserSession)
    }

    try {

      const res = await fetch('https://ytcloneappservice.onrender.com/api/logoutSession', requestOptions)
      const data = await res.json();
      const { success, userID, user } = data;

      if (success) {
        localStorage.removeItem('CurrentUser')
        setTimeout(() => {
          navigate('/')
        }, 1000);

        handleSuccess(customErrorMessage)
        Cookies.remove('access-token')
        dispatch(loggedOutUser({ userID: userID, username: user }))

      }
    } catch (error) {
      console.log(error)
      alert('Session Error. Please try after sometime')
    }

  }

  // Handle User Channel Menu while User logs in
  const ManageUserBox = () => {

    let ManageUserRef = useRef(null)

    const alerClickAway = () => {
      console.log('clicked away outside');
      setManageUser(false)
    }

    // Manage User Channel Box when clicked away from it
    useClickAway(ManageUserRef, alerClickAway)

    return (
      <div ref={ManageUserRef} className='flex flex-col cursor-pointer gap-2 items-center w-[10rem] h-[13rem] pt-2 pb-2 ring-1 ring-slate-200 rounded-xs absolute z-50 bg-white right-0 mt-2.5'>
        <div><img className='w-14 h-14 rounded-full object-cover ring-slate-800 ring-1 mr-8 ml-5' src={profilepicture} alt={username} /></div>
        <h1>{AccountName} </h1>
        <h1> @{handle} </h1>
        <hr className='w-full h-0.5 bg-slate-100 opacity-30 mt-1' />
        <Link onClick={() => setManageUser(false)} to={`/channel/${ChannelsUser[0]}`}><button className='cursor-pointer'> Manage Channel </button></Link>
        <button onClick={() => handleLogOut()}> Sign out </button>
      </div>
    )
  }

  return (
    <>
      <div className='xsticky'>
        <LogoSection toggleSidebar={toggleSidebar} setSearchFlag={setSearchFlag} />
      </div>

      <ArrowBigLeft ref={BackSearchRef} className='backSearch hidden' onClick={(e) => handleBackSearchBtn(e)} />

      <div ref={target} className="searchbox flex @min-4lg/wrapper:ml-10 @min-4lg/wrapper:w-xl border-1 rounded-bl-2xl rounded-tl-2xl rounded-br-2xl rounded-tr-2xl bg-slate-50 border-slate-400
       @max-sm/wrapper:w-max @max-sm/wrapper:justify-self-end @max-sm/wrapper:border-none @max-sm/wrapper:bg-none 
       @max-md/wrapper:w-max @max-md/wrapper:border-none @max-md/wrapper:bg-none 
       @max-lg/wrapper:w-max @max-lg/wrapper:border-none @max-lg/wrapper:bg-none
       @max-4lg/wrapper:w-max @max-4lg/wrapper:absolute @max-4lg/wrapper:right-28 @max-4lg/wrapper:border-none @max-4lg/wrapper:bg-none">
        <input ref={searchInputRef} value={SearchText} onChange={(e) => handleInput(e)} className='SearchVideoInput h-9 bg-white indent-4 w-full 
        max-[992px]:hidden rounded-bl-2xl rounded-tl-2xl' type="text" name="search" id="search" placeholder='Search' />
        <button onClick={(e) => handleSearch(e)}
          className='SearchBtn @max-sm/wrapper:w-max @max-md/wrapper:w-max @max-lg/wrapper:w-max @max-4lg/wrapper:w-max'>
          <img className='@max-sm/wrapper:w-6 @min-sm/wrapper:w-8 @min-lg/wrapper:w-8 @min-4lg/wrapper:w-8 w-8' src="https://img.icons8.com/?size=100&id=XU3XKgdpT0qG&format=png&color=000000" alt="search" /></button>
      </div>

      <div className='user_content flex @max-4lg/wrapper:absolute @max-4lg/wrapper:right-4 z-50'>
        <button className='btn_create_channel w-max flex justify-center items-center mr-8 ml-5 cursor-pointer 
        @max-sm/wrapper:ml-3 @max-sm/wrapper:mr-0 @max-md/wrapper:ml-3 @max-lg/wrapper:mr-0 @max-4lg/wrapper:mr-0'
          onClick={() => handleCreateChannelModal()}><img className='@max-sm/wrapper:w-5 @max-md/wrapper:w-5 @max-lg/wrapper:w-5 w-5 mr-3' src="https://img.icons8.com/?size=100&id=3220&format=png&color=000000" alt="" /> <span className='max-[992px]:hidden'>Create Channel</span> </button>
        
        {
          username == 'Guest' ? <button className='flex justify-center cursor-pointer items-center
           @max-sm/wrapper:mr-0 @max-sm/wrapper:text-[.9rem] @max-sm/wrapper:w-max @max-sm/wrapper:border-none
           @max-md/wrapper:mr-0 @max-md/wrapper:text-[.9rem] @max-md/wrapper:w-max @max-md/wrapper:border-none
           @max-lg/wrapper:mr-0 @max-lg/wrapper:text-[.9rem] @max-lg/wrapper:w-max @max-lg/wrapper:border-none
           @max-4lg/wrapper:mr-0 @max-4lg/wrapper:text-[.9rem] @max-4lg/wrapper:w-max @max-4lg/wrapper:border-none
           gap-2 p-2 border-2 w-32 mr-4 border-slate-100 text-blue-600' onClick={() => setLoginModelOpen(true)}><img className='@max-sm/wrapper:w-8 @min-sm/wrapper:w-10' src="https://img.icons8.com/?size=100&id=7820&format=png&color=000000" alt="" /> <span className='max-[992px]:hidden'>Sign in</span> </button>
            : <div ref={userImg} className='relative'>

              <img className='@max-4lg/wrapper:w-12 @max-4lg/wrapper:h-12 @min-4lg/wrapper:w-14 @min-4lg/wrapper:h-14 rounded-full object-cover ring-slate-800 ring-1 @min-4lg/wrapper:mr-8 @min-4lg/wrapper:ml-5' src={profilepicture} alt={username} onClick={() => toggleManageUser()} />

              {ManageUser && <ManageUserBox />}

            </div>
        }

        <Modal
          isOpen={ChannelModelOpen}
          //onAfterOpen={afterOpenModal}
          onRequestClose={closeChannelModal}
          className='customStylesChannel'
          overlayClassName='customOverlayStylesChannel'
          contentLabel="Create Channel Modal"
        >

          <form id='CreateChannelform' className='flex relative flex-col justify-center items-center w-full gap-3 h-full px-5 border-2'>

            <div>
              <h1 className='text-2xl font-semibold absolute top-0 left-0 p-2'>How you'll appear</h1>
            </div>

            <div className="profileChannelLogo flex flex-col items-center justify-center m-auto">

              <label className='ChannelChangeLabel cursor-pointer m-auto relative' htmlFor="img">
                <img className='ChannelImgChange' src={profilepicture} alt={username} />
                <Edit className='absolute bottom-2 right-1' />
              </label>
              <p id='ChannelNamePara' className='w-max mt-1' >Select Channel Image</p>
              <input type="file" accept='image/*' name="uploadfile" id="img" style={{ display: "none" }} onChange={handleChannelImage} />

            </div>

            <div>
              <label className='block' htmlFor='ChannelName'>Channel Name :</label>
              <input className='ring-blue-300 ring-2 rounded-lg' type="text" name="ChannelName" id="ChannelName" />
            </div>

            <div>
              <label className='block' htmlFor='handle'>Handle :</label>
              <input className='ring-blue-300 ring-2 rounded-lg' type="text" name="handle" id="handle" />
            </div>

            <div>
              <label className='block' htmlFor='ChannelDescription'>Channel Description :</label>
              <textarea rows='3' cols='5' className='ring-blue-300 indent-1.5 ring-2 rounded-lg' name="ChannelDescription" id="ChannelDescription" />
            </div>

            <div className='ChannelBtn'>

              <input type='submit' className='ChannelSubmit text-blue-700 font-bold ring-2 rounded-md' onClick={(e) => handleCreateChannel(e)} value='Create Channel' />
              <button className='ring-2 rounded-lg' onClick={() => setChannelModelOpen(false)}> Cancel </button>

            </div>

            <div>{successStatus}</div>

          </form>

        </Modal>

        <Modal
          isOpen={LoginModelOpen}
          //onAfterOpen={afterOpenModal}
          onRequestClose={closeLoginModal}
          className='LoginModalStyles'
          overlayClassName='LoginModalOverlayStyles'
          contentLabel="Register User Modal"
        >

          <form id='userloginform' className='flex flex-col w-full gap-5 h-full px-5'>

            <div className='flex items-center w-full mt-4 relative'>
              <div className='flex items-center gap-2'>
                <h1 className='text-[1.2rem] font-semibold'>Sign In </h1>
                <img className='w-8 inline' src="https://img.icons8.com/?size=100&id=9a46bTk3awwI&format=png&color=000000" alt="youtube_logo" />
              </div>
              <XSquareIcon onClick={closeLoginModal} className='w-8 absolute right-4' />
            </div>

            <div>
              <p>Email</p>
              <input className='EmailLoginInput ring-blue-300 ring-2 ml-2 rounded-lg' type="text" name="email" id="email" />
            </div>

            <div>
              <p>Password</p>
              <input className='PassLoginInput ring-blue-300 ring-2 ml-2 rounded-lg' type="password" name="password" id="password" />
            </div>

            <button className='place-self-start ring-2 bg-blue-500 text-white font-semibold rounded-lg p-1.5 px-2 text-md' onClick={(e) => handleLogin(e)}>Sign In</button>


            <div className='CreateAcc flex gap-5 items-center'>

              <p className='NewYTText'>New to YouTube ? </p>
              <button className='NewAccBtn bg-red-500 text-white p-1.5 font-bold' onClick={(e) => handleRegister(e)}> CREATE AN ACCOUNT </button>

            </div>

            <div>{successStatus}</div>

          </form>

        </Modal>


        <Modal
          isOpen={registerModelOpen}
          //onAfterOpen={afterOpenModal}
          onRequestClose={closeRegisterModal}
          className='customStylesRegister'
          overlayClassName='customOverlayStylesRegister'
          contentLabel="Register User Modal"
        >
          <button className='text-lg font-bold float-end mr-4' onClick={closeRegisterModal}>X</button>
          <div className='modal-YTlogo flex items-center'>
            <img className='w-8' src="https://img.icons8.com/?size=100&id=9a46bTk3awwI&format=png&color=000000" alt="youtube_logo" />
            <h1 className='text-xl' style={{ fontFamily: "Roboto Condensed, sans-serif", fontWeight: 600 }}>YouTube</h1>
          </div>
          <div className='text-xl font-medium m-2'>Create your Youtube Account </div>

          <div className='registrationBox'>
            <form id='userRegisterForm' className='Registerform_style border-slate-500 border-1 relative'>

            <div className="UserImageLogo flex flex-col items-center justify-center m-auto">

              <label className='UserImageLabel cursor-pointer m-auto relative' htmlFor="img">
                <img className='UserImageChange' src={profilepicture} alt={username} />
                <Edit className='absolute bottom-2 right-1' />
              </label>
              <p id='ProfileImageName' className='w-max mt-1' >Select Profile Image</p>
              <input type="file" accept='image/*' name="uploadfile" id="img" style={{ display: "none" }} onChange={handleProfileImage} />

            </div>
            

              <label htmlFor="fname">FirstName :</label>
              <input className='ring-blue-300 ring-2 rounded-lg' type="text" name="firstname" id="fname" />

              <label htmlFor="lname">LastName :</label>
              <input className='ring-blue-300 ring-2 rounded-lg' type="text" name="lastname" id="lname" />

              <label htmlFor="email">Email :</label>
              <input className='ring-blue-300 ring-2 rounded-lg' type="text" name="email" id="email" />

              <label htmlFor="password">Password : </label>
              <input className='ring-blue-300 ring-2 rounded-lg' type="password" name="password" id="password" />

              <label htmlFor="handle">Handle: </label>
              <input className='ring-blue-300 ring-2 rounded-lg' type="text" placeholder='@SomefancyName' name="handle" id="handle" />
              
              <input className='RegisterSubmit ring-red-600 rounded-xl ring-2' onClick={(e) => handleRegisterForm(e)} type="submit" value="Register" />
              
            </form>

            
            <div className="ModalMainLogo w-full flex justify-center items-center">
              <img className='YTLogoImg' src="https://img.icons8.com/?size=100&id=9a46bTk3awwI&format=png&color=000000" alt="youtube_logo" />
            </div>
          </div>
        </Modal>
      </div>

    </>
  )
}
