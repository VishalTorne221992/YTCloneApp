import React, { useState, useEffect, useCallback } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'
import { useOutletContext, useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar.jsx';
import { AddCurrentUser, fetchChannelInfo, fetchUserChannelData, updateChannelBanner, UpdateChannelImage, UpdateChannelInfo } from '../utils/UserChannelSlice.js'
import { loggedOutUser } from '../utils/userSlice.js'
import { Dot, Edit } from 'lucide-react'
import UpdateChannelVideo from './UpdateChannelVideo.jsx';
import Cookies from 'js-cookie'
import ShowChannels from './ShowChannels.jsx';


function ChannelPage() {

  let { id } = useParams();
  let dispatch = useDispatch();
  let navigate = useNavigate();

  let userID = useSelector(store => store.userInfo.userID);
  let ChannelInfo = useSelector(store => store.UserChannel.Channeldetails);
  let CurrentChannelUser = useSelector(store => store.UserChannel.CurrentChannelUser);
  let UserChannels = useSelector(store => store.UserChannel.UserChannels);
  let ChannelVideos = useSelector(store => store.UserChannel.ChannelVideos);
  const [AllChannels, SetAllChannels] = useState(UserChannels);

  const [toggleSidebar, isSidebarOpen] = useOutletContext();
  const [ChannelEditModelOpen, setChannelEditModelOpen] = useState(false)
  const [updatedChannelValues, setUpdatedChannelValues] = useState({
    ChannelName: ChannelInfo.channelname,
    ChannelHandle: ChannelInfo.handle,
    ChannelDescription: ChannelInfo.description
  })
  const [imageBase64, setImageBase64] = useState("");
  const [ChannelimageBase64, setChannelImageBase64] = useState(ChannelInfo.channelImg);
  const [UpdatedChannelImage, setUpdatedChannelImage] = useState(null)
  const [successStatus, setSuccessStatus] = useState('')

  useEffect(() => {
    
    // Get Data from server related to the Channel based on Channel ID and also add current channel user
    dispatch(AddCurrentUser({ UserID : ChannelInfo.owner }))
    dispatch(fetchChannelInfo(id));
    dispatch(fetchUserChannelData(id));

  }, [id, dispatch, ChannelInfo.owner])

  useEffect(() => {

      SetAllChannels(UserChannels)
     
  },[UserChannels, id])


  const handleError = (err) => toast.error(err, { position: 'top-right' })

  const handleSuccess = (msg) => toast.success(msg, { position: 'top-right' })


  const listItems = document.querySelectorAll('.ytlist > li')
  const panels = document.querySelectorAll('.panel')

  listItems.forEach(item => {
    item.addEventListener('click', (e) => {

      if (e.target.matches('li')) {

        const { id } = e.target.dataset

        listItems.forEach(newItem => {
          if (newItem.dataset.id !== id) {
            newItem.style.fontWeight = 'normal'
          }
        })

        item.style.fontWeight = 'bold';

        panels.forEach(p => p.style.display = 'none')

        const selector = `.panel[id="${id}"]`

        const showpanel = document.querySelector(selector)

        showpanel.style.display = 'block';
      }
    })
  })

  const handleChannelEditModel = async (e) => {

    e.preventDefault();

    // Update channel details based on the edited values
    setUpdatedChannelValues({
      ...updatedChannelValues,
      ChannelName: ChannelInfo.channelname,
      ChannelHandle: ChannelInfo.handle,
      ChannelDescription: ChannelInfo.description
    })

    let accesstoken = Cookies.get('access-token')

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
      const res = await fetch('http://localhost:4002/api/UserAuth', requestOptions)
      const data = await res.json()
      console.log('Authentication response', data)
      const { success, message, user } = data;

      if (success) {
        setChannelEditModelOpen(true);
      } else {
        if (message == 'TokenExpiredError') {
          let customErrorMessage = 'Session Expired. Please Login to continue..'
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

  // convert image file to base64
  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
  };

  function closeChannelEditModal() {
    setChannelEditModelOpen(false)
  }

  // update channel Image
  const ChangeChannelImage = async (userID, ChannelImage) => {

    let ChannelImageUpdate = {
      userID: userID,
      ChannelID: ChannelInfo._id,
      ChannelChangedBanner: ChannelImage
    }

    const requestOptions = {

      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ChannelImageUpdate)
    }

    try {
      const res = await fetch('http://localhost:4002/api/channel/updateChannelImage', requestOptions)
      const data = await res.json();
      let { channelImg } = data.UpdatedChannelImage;
      dispatch(UpdateChannelImage({ ChangedImage: channelImg }))
      
    } catch (error) {
      console.log('Error changing Image', error);
    }

  }

  // update channel Image
  const handleUpdateChannelImage = async (e) => {
    const file = e.target.files[0];
    setUpdatedChannelImage(file);
    setFileToBase64(file);

    let accesstoken = Cookies.get('access-token')

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
      const res = await fetch('http://localhost:4002/api/UserAuth', requestOptions)
      const data = await res.json()
      console.log('Authentication response', data)
      const { success, message, user } = data;

      if (success) {
        ChangeChannelImage(user, imageBase64)
      } else {
        if (message == 'TokenExpiredError') {
          let customErrorMessage = 'Session Expired. Please Login to continue..'
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

  const UpdateChannelProfile = async (userID, ModalChannelImage) => {

    let ModalChannelImageUpdate = {
      userID: userID,
      ChannelID: ChannelInfo._id,
      ChannelName: updatedChannelValues.ChannelName,
      ChannelHandle: updatedChannelValues.ChannelHandle,
      ChannelDescription: updatedChannelValues.ChannelDescription,
      ChannelChangedImage: ModalChannelImage
    }

    const requestOptions = {

      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ModalChannelImageUpdate)
    }

    try {
      const res = await fetch('http://localhost:4002/api/UpdateChannelInfo', requestOptions)
      const data = await res.json();
      let { channelname, channelImg, handle, description } = data.UpdatedChannelInfo;
      let { message } = data
      dispatch(UpdateChannelInfo({ ChannelName: channelname, ChannelImg: channelImg, Handle: handle, ChannelDescription: description }))
      console.log('ChannelImage successfully updated', data)
      setSuccessStatus(message)
    } catch (error) {
      console.log('Error changing Image', error);
    }

  }

  // Update channel info
  const handleUpdateChannel = async (e) => {
    e.preventDefault();

    let accesstoken = Cookies.get('access-token')

    const requestOptions = {

      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${accesstoken}`,
        'Content-Type': 'application/json'
      }
    }

    // Check user is authorized or session expired or not
    try {
      const res = await fetch('http://localhost:4002/api/UserAuth', requestOptions)
      const data = await res.json()
      console.log('Authentication response', data)
      const { success, message, user } = data;

      if (success) {
        UpdateChannelProfile(user, ChannelimageBase64)
      } else {
        if (message == 'TokenExpiredError') {
          let customErrorMessage = 'Session Expired. Please Login to continue..'
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

  const ChangeBanner = async (userID, BannerImage) => {

    let BannerUpdate = {
      userID: userID,
      ChannelID: ChannelInfo._id,
      ChannelChangedBanner: BannerImage
    }

    const requestOptions = {

      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(BannerUpdate)
    }

    try {
      const res = await fetch('http://localhost:4002/api/updateChannelBanner', requestOptions)
      const data = await res.json();
      let { channelBanner } = data.UpdatedChannelData;
      dispatch(updateChannelBanner({ ChangedBanner: channelBanner }))
      console.log('banner successfully updated', data)
    } catch (error) {
      console.log('Error changing Banner', error);
    }
  }

  const UpdateChannelBannerImage = async (e) => {
    const file = e.target.files[0];
    setUpdatedChannelImage(file);
    setFileToBase64(file);

    let accesstoken = Cookies.get('access-token')

    const requestOptions = {

      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${accesstoken}`,
        'Content-Type': 'application/json'
      }
    }

    // Check user is authorized or session expired or not
    try {
      const res = await fetch('http://localhost:4002/api/UserAuth', requestOptions)
      const data = await res.json()
      console.log('Authentication response', data)
      const { success, message, user } = data;

      if (success) {
        ChangeBanner(user, imageBase64)
      } else {
        if (message == 'TokenExpiredError') {
          let customErrorMessage = 'Session Expired. Please Login to continue..'
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

  // convert image file to base64
  const setModalFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setChannelImageBase64(reader.result);
    };
  };

  const handleChannelImageChangeModal = (e) => {
    const file = e.target.files[0];
    setUpdatedChannelImage(file);
    setModalFileToBase64(file);
  }

  const handleCancelChannelEditing = async (e) => {

    e.preventDefault();

    setChannelEditModelOpen(false);

    setUpdatedChannelValues({
      ...updatedChannelValues,
      ChannelName: ChannelInfo.channelname,
      ChannelHandle: ChannelInfo.handle,
      ChannelDescription: ChannelInfo.description
    })

  }

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

      const res = await fetch('http://localhost:4002/api/logoutSession', requestOptions)
      const data = await res.json();
      const { success, userID, user } = data;

      if (success) {

        setTimeout(() => {
          navigate('/')
        }, 1000);

        handleSuccess(customErrorMessage)
        Cookies.remove('access-token')
        dispatch(loggedOutUser({ userID: userID, username: user }))

      }
    } catch (error) {
      console.log(error)
    }

  }

  let isAuthorized = ChannelInfo.owner == userID;

  return (
    <div className='ChannelPageWrapper flex'>

      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <main className='@container/ChannelContainer flex flex-col w-full gap-4 items-center'>

        <div className="banner w-[90%] border-2 h-[8rem] relative">
          <label className='cursor-pointer block' htmlFor="UpdateChannelImg">
            <img className='w-full h-[8rem] object-cover' src={ChannelInfo.channelBanner} alt={ChannelInfo.channelname} />
            {isAuthorized && <Edit className='absolute bottom-1 right-1 bg-white' />}
          </label>
          {isAuthorized && <input type="file" accept='image/*' name="uploadUpdatedImgChannelfile" id="UpdateChannelImg" style={{ display: "none" }} onChange={UpdateChannelBannerImage} />}
        </div>

        <div className="ChannelInfo overflow-hidden flex 
        @max-md/ChannelContainer:flex-col @max-md/ChannelContainer:gap-2
        @max-lg/ChannelContainer:flex-col @max-lg/ChannelContainer:gap-2
        @max-2xl/ChannelContainer:flex-col @max-2xl/ChannelContainer:gap-2 @max-2xl/ChannelContainer:items-start  
        @min-2xl/ChannelContainer:p-4 @min-2xl/ChannelContainer:gap-8
        w-[90%] border-2 items-center relative">

        <div className='flex 
          @max-md/ChannelContainer:gap-2 @max-md/ChannelContainer:mt-2
          @max-lg/ChannelContainer:gap-2 @max-lg/ChannelContainer:mt-2
          @max-2xl/ChannelContainer:gap-2 @max-2xl/ChannelContainer:mt-2 @max-2xl/ChannelContainer:ml-2 
          @min-2xl/ChannelContainer:gap-4'>
            <div className='@max-sm/ChannelContainer:w-20 @max-sm/ChannelContainer:h-16
            @min-sm/ChannelContainer:w-32 @min-sm/ChannelContainer:h-24
            @min-2xl/ChannelContainer:w-40 @min-2xl/ChannelContainer:h-40 
            flex flex-col items-center border-2 rounded-full'>
              <label className='cursor-pointer relative' htmlFor="UpdateChannelImg">
                <img className='@max-sm/ChannelContainer:w-20 @max-sm/ChannelContainer:h-16 @min-sm/ChannelContainer:w-32 @min-sm/ChannelContainer:h-24
                @min-2xl/ChannelContainer:w-40 @min-2xl/ChannelContainer:h-40 rounded-full object-cover ring-slate-800 ring-1' src={ChannelInfo.channelImg} alt={ChannelInfo.channelname} />
                {isAuthorized && <Edit className='absolute @max-sm/ChannelContainer:bottom-0 @max-sm/ChannelContainer:right-0 bottom-2 right-1'/>}
              </label>
              {isAuthorized && <input type="file" accept='image/*' name="uploadUpdatedImgChannelfile" id="UpdateChannelImg" style={{ display: "none" }} onChange={handleUpdateChannelImage} />}
            </div>

            <div className="ChannelName flex flex-col p-1 @max-md/ChannelContainer:w-[85%] @max-md/ChannelContainer:gap-1
            @max-lg/ChannelContainer:w-[85%] @max-lg/ChannelContainer:gap-1
            @max-2xl/ChannelContainer:w-[85%] @max-2xl/ChannelContainer:gap-1 @max-2xl/ChannelContainer:ml-1
            
            @min-2xl/ChannelContainer:gap-2">
              <h1 className='@max-md/ChannelContainer:text-xl
              @max-lg/ChannelContainer:text-2xl @max-2xl/ChannelContainer:text-2xl
              @min-md/ChannelContainer:text-3xl font-bold'>{ChannelInfo.channelname}</h1>
              <div className='flex @max-md/ChannelContainer:gap-1 @min-md/ChannelContainer:gap-1 @max-md/ChannelContainer:flex-col @max-lg/ChannelContainer:flex-col @max-2xl/ChannelContainer:flex-col'>
                @{ChannelInfo.handle}
                <div className='flex @max-md/ChannelContainer:flex @max-lg/ChannelContainer:flex @max-2xl/ChannelContainer:flex'>
                  <div className='flex @max-md/ChannelContainer:text-[0.8rem] @max-md/ChannelContainer:flex @max-md/ChannelContainer:text-nowrap
                   @max-md/ChannelContainer:ml-0 @max-2xl/ChannelContainer:flex-col @max-2xl/ChannelContainer:ml-0
                  @max-lg/ChannelContainer:flex-col @max-lg/ChannelContainer:ml-0 ml-2'> 
                  <Dot className='@max-md/ChannelContainer:hidden @max-lg/ChannelContainer:hidden 
                  @max-2xl/ChannelContainer:hidden'/> 117k Subscribers</div>
                  <div className='flex @max-md/ChannelContainer:text-[0.8rem] @max-md/ChannelContainer:flex 
                  @max-md/ChannelContainer:ml-0 @max-lg/ChannelContainer:flex @max-lg/ChannelContainer:ml-0 
                  @max-2xl/ChannelContainer:flex @max-2xl/ChannelContainer:ml-0 ml-2'><Dot />15 Videos</div>
                </div>
              </div>
            </div>
          </div>
          <div className='@max-md/ChannelContainer:flex-col @max-md/ChannelContainer:p-1 @max-md/ChannelContainer:text-[.92rem]
          @max-lg/ChannelContainer:flex-col @max-lg/ChannelContainer:p-1 @max-lg/ChannelContainer:text-[.92rem] 
          @max-2xl/ChannelContainer:flex-col @max-2xl/ChannelContainer:p-1 @max-2xl/ChannelContainer:text-[.92rem] @max-2xl/ChannelContainer:ml-2
          @max-2lg/ChannelContainer:flex-col @max-2lg/ChannelContainer:p-1 @max-2lg/ChannelContainer:text-[.92rem] @max-2lg/ChannelContainer:ml-2
          @min-2lg/ChannelContainer:absolute @min-2lg/ChannelContainer:bottom-4 @min-2lg/ChannelContainer:left-48
          @min-2xlg/ChannelContainer:absolute @min-2xlg/ChannelContainer:bottom-9 @min-2xlg/ChannelContainer:left-48
          '>
            <p className='@max-md/ChannelContainer:mb-3 @max-lg/ChannelContainer:mb-3 @max-2xl/ChannelContainer:mb-3 @min-2xl/ChannelContainer:mb-2'>Welcome to official Youtube Channel of {ChannelInfo.channelname} {ChannelInfo.description} <span className='font-semibold'>...more</span> </p>
            <button className='bg-black text-white @max-md/ChannelContainer:mb-2 @max-lg/ChannelContainer:mb-2 @max-2xl/ChannelContainer:mb-2 rounded-2xl text-sm font-semibold w-max h-max p-2 pt-1 pb-1 ml-2'>Subscribe</button>
          </div>

   
          {isAuthorized && <Edit onClick={(e) => handleChannelEditModel(e)} className='absolute bottom-1 right-1' />}
          <Modal 
            isOpen={ChannelEditModelOpen}
            //onAfterOpen={afterOpenModal}
            onRequestClose={closeChannelEditModal}
            className='customStylesChannelEdit'
            overlayClassName='OverlayStylesChannelEdit'
            contentLabel="Update Channel Modal"
          >

            <form id='UpdateChannelform' className='flex relative flex-col justify-center items-center w-full gap-3 h-full px-5 border-2'>

              <div>
                <h1 className='text-2xl font-semibold absolute top-0 left-0 p-1'>How you'll appear</h1>
              </div>

              <div className="profileUpdateChannelLogo flex flex-col items-center justify-center m-auto">

                <label className='ChannelChangeLabel cursor-pointer m-auto relative' htmlFor="img">
                  <img className='ChannelImgChange' src={ChannelInfo.channelImg} alt={ChannelInfo.channelname} />
                  <Edit className='absolute bottom-2 right-1' />
                </label>
                <p id='ChannelNamePara' className='w-max mt-1'>Select Channel Image</p>
                <input type="file" accept='image/*' name="uploadfile" id="img" style={{ display: "none" }} onChange={handleChannelImageChangeModal} />

              </div>

              <div className='-mt-5'>
                <label className='block' htmlFor='ChannelName'>Channel Name :</label>
                <input value={updatedChannelValues.ChannelName} onChange={(e) => setUpdatedChannelValues({ ...updatedChannelValues, ChannelName: e.target.value })} className='ring-blue-300 ring-2 w-84 h-6 ml-2 rounded-lg' type="text" name="ChannelName" id="ChannelName" />
              </div>

              <div>
                <label className='block' htmlFor='handle'>Handle :</label>
                <input value={updatedChannelValues.ChannelHandle} onChange={(e) => setUpdatedChannelValues({ ...updatedChannelValues, ChannelHandle: e.target.value })} className='ring-blue-300 ring-2 w-84 h-6 ml-2 rounded-lg' type="text" name="handle" id="handle" />
              </div>

              <div>
                <label className='block' htmlFor='ChannelDescription'>Channel Description :</label>
                <textarea value={updatedChannelValues.ChannelDescription} onChange={(e) => setUpdatedChannelValues({ ...updatedChannelValues, ChannelDescription: e.target.value })} rows='3' cols='5' className='ring-blue-300 indent-1.5 ring-2 w-84 ml-2 rounded-lg' name="ChannelDescription" id="ChannelDescription" />
              </div>

              <div className='UpdateChannelBtn'>

                <button className='ring-2 p-2 rounded-lg' onClick={(e) => handleCancelChannelEditing(e)}> Cancel </button>
                <input type='submit' className='text-blue-700 p-1.5 font-bold ring-2 rounded-md' onClick={(e) => handleUpdateChannel(e)} value='Create Channel' />

              </div>

              <div>{successStatus}</div>

            </form>

          </Modal>
        </div>



        <div className="ChannelVideos w-[90%] p-2 border-2">

          <ul style={{ scrollbarWidth : 'none'}} className='ytlist flex text-[1rem] text-slate-800 font-semibold gap-4 cursor-pointer m-2 relative overflow-scroll'>

            <li data-id='home' className='border-slate-500 hover:border-b-2 min-h-8'>Home</li>
            <li data-id='channelvideo' className='border-slate-500 hover:border-b-2'>Videos</li>
            <li data-id='channelshorts' className='border-slate-500 hover:border-b-2'>Shorts</li>
            <li className='border-slate-500 hover:border-b-2'>Live</li>
            <li className='border-slate-500 hover:border-b-2'>Playlist</li>
            <li className='border-slate-500 hover:border-b-2'>Community</li>

          </ul>

          <div id='content' className='w-full h-72 -mt-2'>

            <div className='panel flex w-full h-full overflow-scroll' id='home' style={{ display: 'block', scrollbarWidth : "none" }}>

              <div className='flex items-center w-full h-full @max-md/ChannelContainer:p-0 @max-lg/ChannelContainer:p-0 @max-2xl/ChannelContainer:p-1 p-2'>
                {
                  AllChannels && AllChannels.map((channel) => {

                    return <ShowChannels key={channel._id} channel={channel} isAuthorized={isAuthorized} SetAllChannels={SetAllChannels} />
                      
                  })
                }
              </div>


            </div>

            <div className='panel w-full h-full flex overflow-scroll' id='channelvideo' style={{ display: "none", scrollbarWidth : "none" }}>

              <div className='ChannelVideos flex h-full gap-2 p-2'>

                {

                  ChannelVideos && ChannelVideos.map((vid) => {
                    return (
                      <UpdateChannelVideo key={vid._id} ChnVideo={vid} />
                    )
                  })

                }

              </div>

            </div>

            <div className='panel' id='channelshorts' style={{ display: 'none' }}> shorts </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default ChannelPage