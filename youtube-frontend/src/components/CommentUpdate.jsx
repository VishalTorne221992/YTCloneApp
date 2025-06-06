import React, { useState, useRef } from 'react'
import UpdateVideo from './UpdateVideo.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { ThumbsUp, ThumbsDown, X, Repeat, Shuffle, CheckIcon, XCircleIcon } from 'lucide-react'
import { UpdateCommentState } from '../utils/VideoCommentSlice.js'

function CommentUpdate({ comment }) {

    let dispatch = useDispatch()

    const [EditOpen, setEditOpen] = useState(false);
    const [DeletedCLicked, setDeletedCLicked] = useState(false);
    const [updatedComment, setUpdatedComment] = useState(comment.text);

    let userID = useSelector(store => store.userInfo.userID);
    let isAuthorized = useSelector(store => store.userInfo.isAuthenticated);
    let ChannelInfo = useSelector(store => store.UserChannel.Channeldetails);

    let commentRef = useRef(comment.text)

    const handleUpdatedComment = (e) => {
        e.preventDefault();
        setUpdatedComment(e.target.value);
    }

    const submitUpdatedComment = async (e) => {

        e.preventDefault();
            
        let UpdateCommentData = {
            userID : comment.user, 
            commentID : comment._id, 
            comment : updatedComment
        }

        const requestOptions = {

            method: 'PUT',
            credentials: 'include',
            mode: 'cors',
            headers: { 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(UpdateCommentData)
      
        }

        try {
      
            const res = await fetch('https://ytcloneappservice.onrender.com/api/updateComment', requestOptions)
            const data = await res.json();
            console.log('Comment updated successfully', data)
            
            let { text } = data.comment
            dispatch(UpdateCommentState({ updatedText : text, userID : comment.user }))
            commentRef.current = text;
      
        } catch (error) {
              alert('Error Updating Channel. Please try again after sometime...')
        }finally {
            setEditOpen(false)
        }
        
    }

    let CommentFlag = 'Comment';
    let UpdatedStateComments = useSelector(store => store.VideoComments.VideoComments);

    function toK(num){
        if(num > 1000){
        let q = num / 1000
        return Math.floor(q) + 'K'
        }
        return num
    }

    console.log('authorized', isAuthorized)

    return (
        <div className='flex @max-md/videopage:ml-0 @max-md/videopage:w-full @max-md/videopage:text-[.9rem] ring-1 ring-slate-200 ml-5 gap-2 m-3 relative'>
            <div className='flex'>
                <img className='w-10 h-10 rounded-full object-cover ring-slate-800 ring-1 mt-2 ml-2 mr-2' src={comment.user_pic} alt={comment.user} />
            </div>
            <div className='flex flex-col gap-2 p-0.5 pt-2'>
                {EditOpen ?
                    <div>
                        <input className='w-96 ring-1' value={updatedComment} type='text' onChange={(e) => handleUpdatedComment(e)} />
                        <CheckIcon className='inline-block' onClick={(e) => submitUpdatedComment(e)} />
                        <XCircleIcon className='inline-block' onClick={() => { setUpdatedComment(commentRef.current); setEditOpen(false)} }/>
                    </div>
                    : <p className='mr-8'>{commentRef.current}</p>}
                <div className='flex gap-2 text-sm'>
                    <ThumbsUp width='1.2rem' />{toK(comment.likes)}
                    <ThumbsDown width='1.2rem' />{comment.dislikes}
                </div>
            </div>
            <div className='inline-block absolute top-0 right-0 z-10 translate-y-[50%]'>
                {isAuthorized && <UpdateVideo key={comment._id} setEditOpen={setEditOpen} setDeletedCLicked={setDeletedCLicked} elementName={CommentFlag} element={comment} />}
            </div>
        </div>
    )
}

export default CommentUpdate
