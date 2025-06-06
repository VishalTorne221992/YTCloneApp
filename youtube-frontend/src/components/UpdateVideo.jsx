import React, { useState, useRef } from 'react'
import { MoreVerticalIcon } from 'lucide-react'
import useClickAway from '../hooks/useClickAway'
import { useDispatch } from 'react-redux';
import { DeleteCommentState } from '../utils/VideoCommentSlice.js'
import { DeleteVideoState } from '../utils/UserChannelSlice.js'


function UpdateVideo({ elementName, element, setEditOpen, setDeletedCLicked }) {

  const [ElementMore, setElementMore] = useState(false);

  const targetElem = useRef(element._id)

  let dispatch = useDispatch();
  

  const ManageVideosMore = ({ elemName, elem, setEdit, setDeleted }) => {

    let targetPopup = useRef(null)
    
    const alertClickAway = () => {
      setElementMore(false)
    }
  

    useClickAway(targetPopup, alertClickAway)

    const handleEdit = async (e) => {

       setEdit(true);
       setElementMore(prev => !prev)

    }
 
    const handleVideoDelete = async (e) => {

        setDeleted(true)

      e.preventDefault();
                  
      let DeleteVideoData = {
          userID : elem.user, 
          VideoID : elem._id
      }

      const requestOptions = {

          method: 'delete',
          credentials: 'include',
          mode: 'cors',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(DeleteVideoData)
    
      }

      try {
    
          const res = await fetch('https://ytcloneappservice.onrender.com/api/deleteVideo', requestOptions)
          const data = await res.json();
          
          dispatch(DeleteVideoState({ userID : elem.uploader, VideoID : elem._id }))
      
    
      } catch (error) {
            alert('Error Deleting Video Please try again after sometime ...')
      }finally {
          setDeleted(false)
          setEdit(false)
      }
    }

    const handleDelete = async (e) => {

      if( elemName == 'Video'){
          handleVideoDelete()
      }

      setDeleted(true)

      e.preventDefault();
                  
      let DeleteCommentData = {
          userID : elem.user, 
          commentID : elem._id
      }

      const requestOptions = {

          method: 'delete',
          credentials: 'include',
          mode: 'cors',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(DeleteCommentData)
    
      }

      try {
    
          const res = await fetch('https://ytcloneappservice.onrender.com/api/deleteComment', requestOptions)
          const data = await res.json();
          console.log('Comment deleted successfully', data)
          
          let { comment } = data
          dispatch(DeleteCommentState({ userID : elem.user, commentID : elem._id }))
      
    
      } catch (error) {
            alert('Error Deleting Comment. Please try again later ...')
      }finally {
          setDeleted(false)
          setEdit(false)
      }
    }

    return (
      <div ref={targetPopup} className='flex flex-col animate-more bg-white transition-all border-2 duration-75 items-center w-max h-max ring-1 ring-slate-200 rounded-xs absolute top-0 right-0 p-1 z-50 mt-2.5'>
            <div id='editBtn' className='pl-4 pr-4 cursor-pointer' onClick={(e) => handleEdit(e)}>Edit</div>
            <hr className='w-full h-0.5 bg-slate-100 opacity-30 p-0' />
            <div className='pl-4 pr-4 cursor-pointer' onClick={(e) => handleDelete(e)}>Delete</div>
      </div>
    )
  }

  function ToggleVideosMore() {

    setElementMore(prev => !prev)

  }

  return (
    <div>

      <MoreVerticalIcon ref={targetElem} className='top-0 justify-self-end cursor-pointer' onClick={() => ToggleVideosMore()} />
      {ElementMore && element._id !== targetElem.current && <ManageVideosMore setEdit={setEditOpen} setDeleted={setDeletedCLicked} elemName={elementName} elem={element} />}

    </div>
  )
}

export default UpdateVideo
