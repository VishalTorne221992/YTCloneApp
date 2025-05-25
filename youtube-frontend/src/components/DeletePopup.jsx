import React, { useState, useRef} from 'react'
import { MoreVerticalIcon } from 'lucide-react'
import useClickAway from '../hooks/useClickAway'
import { useSelector, useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { loggedOutUser } from '../utils/userSlice.js'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function DeletePopup({ element, UserAllChannels }) {

    const [DeleteMore, setDeleteMore] = useState(false)

    let dispatch = useDispatch();
    let navigate = useNavigate();

    const targetElem = useRef(element._id)

    let userID = useSelector(store => store.userInfo.userID);

    const alerClickAway = () => {
        console.log('clicked away outside');
        setDeleteMore(false)
    }

    useClickAway(targetElem, alerClickAway)

    const handleError = (err) => toast.error(err, { position: 'top-right' })
  
    const handleSuccess = (msg) => toast.success(msg, { position: 'top-right' })


    const DeleteChannelData = async (user, element) => {

        let deleteChannelInfo = {
          userID : user,
          channelID : element._id
        }

        const requestOptions = {

          method: 'DELETE',
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(deleteChannelInfo)
        }

        try {

              const res = await fetch('http://localhost:4002/api/channel/DeleteChannel', requestOptions)
              const data = await res.json();
              console.log('Channel successfully Deleted', data)

              UserAllChannels((prev) => prev.filter((channel) => channel._id !== element._id))
              
         } catch (error) {
              console.log('Error Deleting Channel', error);
         }

    }

    const handleDeleteMore = async (e) => {

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
      
           try{
            const res = await fetch('http://localhost:4002/api/UserAuth', requestOptions)
            const data = await res.json()
            console.log('Authentication response', data)
            const { success, message, user } = data;
      
            if(success){
               DeleteChannelData(user, element)
            }else{
              let UID = "100";
              if(message == 'TokenExpiredError'){
                  let customErrorMessage = 'Session Expired. Please Login to continue..'
                  LogOutExpiration(customErrorMessage, message)
              }else{
                dispatch(loggedOutUser({userID : UID, username : user, isAuthenticated : false}))
                handleError('Please Login to Create a Channel !')
              }
              
            }
            
           }catch(err){
            console.log('Error',err);
            handleError('Login Error ! Please try after sometime')
           }

    }

    const LogOutExpiration = async (customErrorMessage, errmsg) => {

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
        const { success, userID, user} = data;

        if(success){

          setTimeout(() => {
            navigate('/')
          }, 1000);

          handleSuccess(errmsg)
          Cookies.remove('access-token')
          dispatch(loggedOutUser({userID : userID, username : user}))

        }
        } catch (error) {
          console.log(error)
        }

    }

    const ManageDeleteMore = () => {
        return (
          <div className='flex flex-col animate-more bg-white transition-all border-2 duration-75 items-center w-max h-max ring-1 ring-slate-200 rounded-xs absolute top-0 right-0 p-1 z-50 mt-2.5'>
            <div className='pl-4 pr-4' onClick={(e) => handleDeleteMore(e)}>Delete</div>
          </div>
        )
      }

      function ToggleDeleteMore() {

        setDeleteMore(prev => !prev)

      }

    return (
        <div ref={targetElem} className=''>

            <MoreVerticalIcon className='top-0 justify-self-end cursor-pointer' onClick={() => ToggleDeleteMore()} />
            { DeleteMore && element._id !== targetElem.current && <ManageDeleteMore /> }

        </div>
    )
}

export default DeletePopup