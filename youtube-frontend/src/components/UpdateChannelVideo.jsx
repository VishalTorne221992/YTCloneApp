import React, { useRef, useState } from 'react';
import Modal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import UpdateVideo from './UpdateVideo';
import { Link } from 'react-router-dom'
import { Dot, Edit } from 'lucide-react';
import { UpdateVideoState } from '../utils/UserChannelSlice.js'

function UpdateChannelVideo({ ChnVideo }) {

    let dispatch = useDispatch();

    let userID = useSelector(store => store.userInfo.userID);

    const [VideoEditModelOpen, setVideoEditModelOpen] = useState(false);

    const [VideoDeletedClicked, setVideoDeletedClicked] = useState(false);

    const [VideoImageBase64, setVideoImageBase64] = useState()

    const [SuccessStatus, setSuccessStatus] = useState('')

    const [updatedVideoValues, setUpdatedVideoValues] = useState({
        VideoName : ChnVideo.title,
        VideoURL : ChnVideo.videoUrl,
        VideoDescription : ChnVideo.description
    })

    let VideoFlag = 'Video'

    function closeVideoEditModal() {
        setVideoEditModelOpen(false)
    }

    
    const handleUpdateVideo = async (e) => {

    e.preventDefault();

    let EditedVideoValues = {
        userID : userID,
        videoID : ChnVideo._id,
        thumbnailUrl : VideoImageBase64,
        VideoTitle : updatedVideoValues.VideoName,
        VideoUrl : updatedVideoValues.VideoURL,
        VideoDescription : updatedVideoValues.VideoDescription
    }

    console.log('Submited updated Values', EditedVideoValues)

    const requestOptions = {
    
            method: 'PUT',
            credentials: 'include',
            mode: 'cors',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(EditedVideoValues)
            
        }
    
        try {
        
            const res = await fetch('https://ytcloneappservice.onrender.com/api/updateVideo', requestOptions)
            const data = await res.json();
            console.log('Video updated successfully', data)
            
            let { title, videoUrl, thumbnailUrl, description, ChannelImage } = data.UpdatedVideo

            let { message } = data

            setSuccessStatus(message)

            dispatch(UpdateVideoState({
                userID : userID,
                videoID : ChnVideo._id,
                thumbnailUrl : thumbnailUrl,
                VideoTitle : title,
                VideoUrl : videoUrl,
                VideoDescription : description
            }))

            //commentRef.current = text;
        
        } catch (error) {
                alert('Error Updating Channel Please try again later...')
        }finally {
            
            setVideoEditModelOpen(false)
        }

}

    // convert image file to base64
    const setFileToBase64 = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
        setVideoImageBase64(reader.result);
        };
    };

    // receive file from form
    const handleVideoImage = (e) => {
        const file = e.target.files[0];
        setFileToBase64(file);
    };


    const handleCancelVideoEditing = async (e) => {

        e.preventDefault();

        setVideoEditModelOpen(false);

        setUpdatedVideoValues({...updatedVideoValues, 
            VideoName : ChnVideo.title,
            VideoURL : ChnVideo.videoUrl,
            VideoDescription : ChnVideo.description
        })

    }

    return (
        <div className='flex flex-col w-full gap-1'>

            <div className="relative">
                <Link to={`/video/${ChnVideo._id}`}>
                <img className="border-2 rounded-lg aspect-video object-cover" src={ChnVideo.thumbnailUrl} alt={ChnVideo.title} />
                <p className="absolute bottom-2 right-2 text-sm bg-black bg-opacity-50 text-white px-1.5 font-medium rounded-md">
                    {ChnVideo.duration}
                </p>
                </Link>
            </div>

            <div className='relative'>

                <Link to={`/video/${ChnVideo._id}`}>
                <h2 className="group-hover:text-blue-500 font-semibold leading-snug line-clamp-2 dark:text-neutral-300" title={ChnVideo.title}>
                    {ChnVideo.title}
                </h2>
                </Link>

                <div className='flex'>
                    <p>{ChnVideo.views}</p>
                    <Dot />
                    <p>{ChnVideo.likes}</p>
                </div>

                <div className='inline-block absolute top-0 right-0'>
                    <UpdateVideo key={ChnVideo._id} setEditOpen={setVideoEditModelOpen} setDeletedCLicked={setVideoDeletedClicked} elementName={VideoFlag} element={ChnVideo} />
                </div>

            </div>

            <Modal
                isOpen={VideoEditModelOpen}
                //onAfterOpen={afterOpenModal}
                onRequestClose={closeVideoEditModal}
                className='customStylesVideo'
                overlayClassName='customStylesOverlayVideo'
                contentLabel="Create Channel Modal"
            >

                <form id='UpdateChannelVideoform' className='flex relative flex-col justify-center items-center w-full gap-3 h-full px-5 border-2'>

                    <div>
                        <h1 className='text-2xl font-semibold absolute top-0 left-0 p-1'>Edit Channel Video : </h1>
                    </div>

                    <div className="profileUpdateVideoLogo flex flex-col items-center justify-center m-auto">

                        <label className='ChannelChangeLabel cursor-pointer m-auto relative' htmlFor="img">
                            <img className='ChannelVideoImgChange' src={ChnVideo.thumbnailUrl} alt={ChnVideo.title} />
                            <Edit className='absolute bottom-0 right-0 bg-white' />
                        </label>
                        <p id='ChannelNamePara' className='w-max mt-1'>Select Channel Image</p>
                        <input style={{display: 'none'}} type="file" accept='image/*' name="uploadfile" id="imgfile" onChange={handleVideoImage} />

                    </div>

                    <div className='-mt-5'>
                        <label className='block' htmlFor='ChannelName'>Video Name :</label>
                        <input value={updatedVideoValues.VideoName} onChange={(e) => setUpdatedVideoValues({...updatedVideoValues, VideoName : e.target.value})} className='ring-blue-300 ring-2 w-84 h-6 ml-2 rounded-lg' type="text" name="VideoName" id="VideoName" />
                    </div>

                    <div>
                        <label className='block' htmlFor='handle'>Video URL :</label>
                        <input value={updatedVideoValues.VideoURL} onChange={(e) => setUpdatedVideoValues({...updatedVideoValues, VideoURL : e.target.value})} className='ring-blue-300 ring-2 w-84 h-6 ml-2 rounded-lg' type="text" name="VideoURL" id="VideoURL" />
                    </div>

                    <div>
                        <label className='block' htmlFor='ChannelDescription'>Video Description :</label>
                        <textarea value={updatedVideoValues.VideoDescription} onChange={(e) => setUpdatedVideoValues({...updatedVideoValues, VideoDescription : e.target.value})} rows='3' cols='5' className='ring-blue-300 indent-1.5 ring-2 w-84 ml-2 rounded-lg' name="VideoDescription" id="VideoDescription" />
                    </div>

                    <div className='UpdateVideoChannelBtn'>

                        <button className='ring-2 p-2 rounded-lg' onClick={(e) => handleCancelVideoEditing(e)}> Cancel </button>
                        <input type='submit' className='text-blue-700 p-1.5 font-bold ring-2 rounded-md' onClick={(e) => handleUpdateVideo(e)} value='Update Video Info' />

                    </div>

                    <div>{SuccessStatus}</div>

                </form>

            </Modal>

        </div>
    )
}

export default UpdateChannelVideo
