import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import IFrame from './IFrame.jsx'
import { useOutletContext } from "react-router-dom"
import { fetchVideoComments, AddCommentState } from '../utils/VideoCommentSlice.js'
import Sidebar from './Sidebar';
import CommentUpdate from './CommentUpdate.jsx';
import { ThumbsUp, ThumbsDown, X, Repeat, Shuffle } from 'lucide-react'
import useClickAway from '../hooks/useClickAway'


function VideoPage() {

  let { id } = useParams()
  let dispatch = useDispatch();

  const [Video, setVideo] = useState([])
  const [ChannelData, setChannelData] = useState([])
  const [NewComment, setNewComment] = useState([])
  const [AddComment, setAddComment] = useState(false)
  const [toggleSidebar, isSidebarOpen] = useOutletContext();

  const NewCommentRef = useRef(null);
  const NewCommentinputRef = useRef('');

  let userID = useSelector(store => store.userInfo.userID);
  let username = useSelector(store => store.userInfo.username);
  let profilepicture = useSelector(store => store.userInfo.profilepic);

  useEffect(() => {

    // Get Video Details based on ID
    const getVideoDetails = async () => {

      const videodetails = await fetch(`http://localhost:4002/api/video/${id}`)

      const videodata = await videodetails.json();

      console.log('data', videodata)

      setVideo(videodata.video)
      setChannelData(videodata.ChannelVideos)

    }

    dispatch(fetchVideoComments(id));
    getVideoDetails();

  }, [dispatch, id])

  const alertClickAway = () => {
    
    setAddComment(false)

  }

  useClickAway(NewCommentRef, alertClickAway)


  let VideoUrl = Video.videoUrl + '?modestbranding=1'
  let Comments = useSelector(store => store.VideoComments.VideoComments);

  console.log('Video comments', Comments)

  const handleCreateComment = async (e) => {

    e.preventDefault();

    let UpdateCommentData = {
      userID: userID,
      videoId: Video._id,
      comment: NewComment
    }

    const requestOptions = {

      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(UpdateCommentData)

    }

    try {

      const res = await fetch('http://localhost:4002/api/AddComment', requestOptions)
      const data = await res.json();
      let { Comment } = data
      dispatch(AddCommentState(Comment))

    } catch (error) {
      console.log("error adding comment", error);
    } finally {
      setNewComment('');
      setAddComment(false)
    }



  }

  let AllVideos = useSelector(store => store.Videos.videos);
  
  const videos = AllVideos.videos;

  const RelatedVideos = videos.slice(0, 8)

  function toK(num){
        if(num > 1000){
        let q = num / 1000
        return Math.floor(q) + 'K'
        }
        return num
    }

  return (
    <div className='VideoPageWrapper flex'>

      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

    <main className='@container/videopage flex flex-col w-full'>
      <section className='TopSection w-full flex items-center 
        @max-md/videopage:flex-col @max-md/videopage:p-0 
        @max-lg/videopage:flex-col @max-lg/videopage:p-0 
        @max-2xl/videopage:flex-col @max-2xl/videopage:p-0
        @max-3xl/videopage:flex-col @max-3xl/videopage:p-0
        @max-4lg/videopage:flex-col @max-4lg/videopage:p-0
        @min-4lg/videopage:pt-2 pl-4 pt-0 pb-0'>

        <div className="VideoContainer 
          @max-md/videopage:w-full
          @max-md/videopage:p-0 @max-lg/videopage:w-full @max-2xl/videopage:w-full 
          @max-lg/videopage:p-0 @max-3xl/videopage:w-full @max-3xl/videopage:p-0
          @max-4lg/videopage:w-full @max-4lg/videopage:p-0
          @max-2xl/videopage:p-0 @min-4lg/videopage:p-5 @min-4lg/videopage:w-[70%]">
            <div className='@max-md/videopage:w-[100%] @max-lg/videopage:w-[100%]
            @max-2xl/videopage:w-[100%] @max-3xl/videopage:w-[100%]
            @max-4lg/videopage:w-[100%] @min-4lg/videopage:max-w-[44rem]'>
              <IFrame videoUrl={VideoUrl} />
              <div className="videoDescription 
              @max-md/videopage:w-[100%] @max-md/videopage:ml-0 
              @max-lg/videopage:w-[100%] @max-lg/videopage:ml-0
              @max-2xl/videopage:w-[100%] @max-2xl/videopage:ml-0
              @max-3xl/videopage:w-[100%] @max-3xl/videopage:ml-0
              @max-4lg/videopage:w-[100%] @max-4lg/videopage:ml-0 
              @min-4lg/videopage:w-[100%] @min-4lg/videopage:ml-0
              flex flex-col relative p-2 text-sm ml-5">

                <div className='flex font-semibold text-xl ml-2'>
                  <h1 className=''>{Video.title}</h1>
                </div>

                <div className='flex items-center mt-2 
                @max-sm/videopage:-ml-0.5 @max-sm/videopage:text-[.8rem]
                @max-md/videopage:flex-col @max-md/videopage:items-start
                @max-lg/videopage:flex-col @max-lg/videopage:items-start
                @max-2xl/videopage:flex-col @max-2xl/videopage:items-start
                @max-3xl/videopage:flex-col @max-3xl/videopage:items-start
                @max-4lg/videopage:flex-col @max-4lg/videopage:items-start'>
                  <div className='flex items-center'>
                    <img className='@max-sm/videopage:w-12 @max-sm/videopage:h-12 @min-sm/videopage:w-14 
                    @min-sm/videopage:h-14 rounded-full object-cover ring-slate-800 
                    @max-sm/videopage:ml-0 @max-sm/videopage:mr-1 ring-1 @min-sm/videopage:ml-2 @min-sm/videopage:mr-2' src={profilepicture} alt={username} />
                    <div className='flex flex-col justify-items-center'>
                      <h1 className='font-semibold'>{Video.ChannelName}</h1>
                      <h1>1K Subscribers</h1>
                    </div>
                  </div>
                  <div className='flex 
                  @max-sm/videopage:absolute @max-sm/videopage:right-0.5 @max-sm/videopage:mt-2
                  @max-md/videopage:absolute @max-md/videopage:right-3 @max-md/videopage:mt-3
                  @max-lg/videopage:absolute @max-lg/videopage:right-3 @max-lg/videopage:mt-3
                  @max-2xl/videopage:absolute @max-2xl/videopage:right-3 @max-2xl/videopage:mt-3
                  @max-3xl/videopage:absolute @max-3xl/videopage:right-3 @max-3xl/videopage:mt-3
                  @max-4lg/videopage:absolute @max-4lg/videopage:right-3 @max-4lg/videopage:mt-3'>
                    <div className='relative'>
                      <button className='bg-slate-200 rounded-2xl text-sm font-semibold @max-md/videopage:text-[.8rem] @max-md/videopage:w-12 @max-md/videopage:h-8 @min-md/videopage:w-16 @min-md/videopage:h-8 ml-4'>Join</button>
                      <button className='bg-black text-white rounded-2xl @max-md/videopage:text-[.8rem] @min-md/videopage:text-sm font-semibold w-max h-max p-2 pt-1 pb-1 ml-1.5'>Subscribe</button>
                    </div>
                  </div>

                  <div className="likeDetails flex text-sm 
                  @max-sm/videopage:-ml-2 @max-sm/videopage:text-[.9rem]
                  @max-md/videopage:mt-3 @max-md/videopage:left-0
                  @max-lg/videopage:mt-3 @max-lg/videopage:left-0 
                  @max-3xl/videopage:left-0 @max-3xl/videopage:mt-3
                  @max-4lg/videopage:left-0 @max-4lg/videopage:mt-3
                  @max-2xl/videopage:mt-3 @max-2xl/videopage:left-0 @min-4lg/videopage:absolute right-2">
                    <button className='flex items-center gap-2 bg-slate-200 rounded-tl-2xl rounded-bl-2xl text-sm w-max h-max p-2 pt-1 pb-1 ml-4'><ThumbsUp />{toK(Video.likes)}</button>
                    <button className='flex items-center gap-2 bg-slate-200 rounded-br-2xl rounded-tr-2xl text-sm w-max h-max phare-2 pt-1 pb-1'><ThumbsDown />{toK(Video.dislikes)}</button>
                    <button className='flex items-center gap-2 bg-slate-200 rounded-2xl text-sm w-max h-max p-1 pt-1 pb-1 ml-4'>Share</button>
                    <button className='flex items-center gap-2 bg-slate-200 rounded-2xl text-sm w-max h-max p-1 pt-1 pb-1 ml-4'>Download</button>
                  </div>

                </div>

                <div className="DescriptionBox 
                @max-md/videopage:w-full @max-md/videopage:flex @max-md/videopage:flex-col
                @max-lg/videopage:w-full @max-lg/videopage:flex-col 
                @max-2xl/videopage:w-full @max-2xl/videopage:flex-col
                @max-3xl/videopage:w-full @max-3xl/videopage:flex-col
                @max-4lg/videopage:w-full @max-4lg/videopage:flex-col
                @min-4lg/videopage:flex-col
                   p-2.5 bg-slate-200 mt-2 rounded-lg">

                  <h1 className='font-semibold'>{Video.views} views 3 days ago</h1>
                  <p>{Video.description}</p>
                  <p className='font-semibold'>...more</p>

                </div>

              </div>
            </div>
          </div>
          <div className="channelVideos flex @max-4lg/videopage:w-full @min-4lg/videopage:w-[30%] 
          @min-4lg/videopage:h-full">

            <div className="channelData flex flex-col gap-2 @max-4lg/videopage:w-full @min-4lg/videopage:gap-3 w-[14rem] 
            @min-4lg/videopage:w-[20rem] @min-4lg/videopage:ml-0 @min-4lg/videopage:mt-5 h-max relative">

              <div className="channelHeader text-lg font-semibold">
                <h1>More from {Video.ChannelName}</h1>
                <div className='flex gap-2 w-10'>
                  <Repeat />
                  <Shuffle />
                </div>
              </div>

              <p className='text-lg absolute right-3 text-slate-500'><X /></p>

              <div style={{ scrollbarWidth: 'none' }}
                className="channelVideos @max-md/videopage:overflow-auto @max-md/videopage:flex 
              @max-lg/videopage:overflow-auto @max-lg/videopage:flex 
              @max-2xl/videopage:overflow-auto @max-2xl/videopage:flex 
              @max-3xl/videopage:overflow-auto @max-3xl/videopage:flex @min-2xl/videopage:justify-center
              @max-4lg/videopage:overflow-auto @max-4lg/videopage:flex @max-4lg/videopage:items-center
              @min-4lg/videopage:flex @min-4lg/videopage:flex-col @min-4lg/videopage:gap-2">

                {
                  ChannelData && ChannelData.map((channel) => {

                    return <Link to={`/video/${channel._id}`} className='@max-md/videopage:flex-col @max-md/videopage:items-center
                    @max-lg/videopage:flex-col @max-lg/videopage:items-center justify-items-center
                    @max-2xl/videopage:flex-col @max-2xl/videopage:items-center
                    @max-3xl/videopage:flex-col @max-3xl/videopage:items-center
                    @max-4lg/videopage:flex-col @max-4lg/videopage:items-center 
                    @min-4lg/videopage:flex @min-4lg/videopage:gap-1 border-2 rounded-md p-2 mb-1 hover:bg-slate-200 cursor-pointer'>
                      <img className='w-28 h-18 object-cover ring-slate-800 ring-1' src={channel.thumbnailUrl} alt={channel.ChannelName} />
                      <div className='flex flex-col
                      @max-md/videopage:flex-col @max-md/videopage:text-nowrap 
                      @max-lg/videopage:flex-col @max-lg/videopage:text-nowrap 
                      @max-2xl/videopage:flex-col @max-2xl/videopage:text-nowrap
                      @max-3xl/videopage:flex-col @max-3xl/videopage:text-nowrap
                      @max-4lg/videopage:flex-col @max-4lg/videopage:text-nowrap
                      @min-4lg/videopage:flex-col
                      @min-4lg/videopage:justify-start @min-4lg/videopage:gap-2
                      gap-1 ml-3'>
                        <p className=''>{channel.title}</p>
                        <p className='text-sm text-slate-800'>{channel.ChannelName}</p>
                      </div>
                    </Link>

                  })
                }

              </div>

            </div>

          </div>

        </section>

        <section className='BottomSection flex
        @max-md/videopage:flex-col @max-lg/videopage:flex-col 
        @max-2xl/videopage:flex-col @max-3xl/videopage:flex-col @max-4lg/videopage:flex-col pl-2'>

          <div className="commentSection flex flex-col gap-4 @min-4lg/videopage:basis-9/12 p-5 pt-0">

            <div className="commentHeader font-bold text-xl @max-md/videopage:ml-2 ml-8">{Comments.length} Comments</div>

            <div ref={NewCommentRef} className="newComment flex justify-start @max-md/videopage:ml-0 ml-2 mb-5 relative">

              <img className='w-11 h-11 rounded-full object-cover ring-slate-800 ring-1 @max-md/videopage:ml-0 ml-2 mr-2' src={profilepicture} alt={username} />
              <div className='relative right-1'>
                <input ref={NewCommentinputRef} value={NewComment} onChange={(e) => setNewComment(e.target.value)} onFocus={() => setAddComment(true)}
                  className='h-9 indent-4 rounded-sm
                @max-xs/videopage:w-[12rem] @min-xs/videopage:w-[13rem] @min-sm/videopage:w-[18rem] 
                @min-md/videopage:w-[20rem] @min-lg/videopage:w-[23rem] @min-xl/videopage:w-[30rem] 
                @min-2xl/videopage:w-[33.5rem] @min-[45rem]/videopage:w-[36.5rem] 
                @min-3xl/videopage:w-[39rem] @min-[50rem]/videopage:w-[41rem] @min-[52rem]/videopage:w-[43rem]
                @min-[54rem]/videopage:w-[44rem] @min-4xl/videopage:w-[48rem] @min-4lg/videopage:w-3xl
                @min-4lg/videopage:mr-8 @min-4lg/videopage:ml-2' type="text" name="newcomment" id="newcomment" placeholder='Add a comment...' />
                <div>
                  {AddComment && <div className='flex absolute @max-md/videopage:right-0 @max-lg/videopage:right-2 
                  @max-2xl/videopage:right-2 @max-3xl/videopage:right-2 @max-4lg/videopage:right-2 right-10 gap-3 mt-2'> <button>Cancel</button> <button onClick={(e) => handleCreateComment(e)} className='bg-black text-white rounded-md font-semibold p-1.5'>Comment</button></div>}
                </div>
              </div>

            </div>

            <div>

              {
                Comments && Comments.map((comment) => {
                  return (
                    <CommentUpdate key={comment._id} comment={comment} video={Video} />
                  )
                })
              }

            </div>

          </div>

          <div className="RelatedContainer @max-md/videopage:hidden @max-lg/videopage:hidden 
          @max-2xl/videopage:hidden @max-3xl/videopage:hidden 
          @max-4lg/videopage:hidden @min-4lg/videopage:basis-4/12 
          p-8 flex">


            <div className="RelatedData flex flex-col gap-2 @max-4lg/videopage:w-full @min-4lg/videopage:gap-3 w-[14rem] 
            @min-4lg/videopage:w-[20rem] @min-4lg/videopage:ml-0 @min-4lg/videopage:mt-5 h-max relative">

              <div className="RelatedHeader text-lg font-semibold">
                <h1>Related Videos</h1>
              </div>

              <div style={{ scrollbarWidth: 'none' }}
                className="RelatedVideos @max-md/videopage:overflow-auto @max-md/videopage:flex 
              @max-lg/videopage:overflow-auto @max-lg/videopage:flex
              @max-2xl/videopage:overflow-auto @max-2xl/videopage:flex
              @max-3xl/videopage:overflow-auto @max-3xl/videopage:flex
              @max-4lg/videopage:overflow-auto @max-4lg/videopage:flex
              @min-4lg/videopage:flex @min-4lg/videopage:flex-col @min-4lg/videopage:gap-2">

                {
                  RelatedVideos && RelatedVideos.map((Related) => {

                    return <Link to={`/video/${Related._id}`} className='@max-md/videopage:flex-col @max-md/videopage:items-center
                    @max-lg/videopage:flex-col @max-lg/videopage:items-center justify-items-center
                    @max-2xl/videopage:flex-col @max-2xl/videopage:items-center
                    @max-3xl/videopage:flex-col @max-3xl/videopage:items-center
                    @max-4lg/videopage:flex-col @max-4lg/videopage:items-center 
                    @min-4lg/videopage:flex @min-4lg/videopage:gap-1 border-4 p-2 mb-1 hover:bg-slate-200 cursor-pointer'>
                      <img className='w-28 h-18 object-cover ring-slate-800 ring-1' src={Related.thumbnailUrl} alt={Related.ChannelName} />
                      <div className='flex flex-col
                      @max-md/videopage:flex-col @max-md/videopage:text-nowrap 
                      @max-lg/videopage:flex-col @max-lg/videopage:text-nowrap 
                      @max-2xl/videopage:flex-col @max-2xl/videopage:text-nowrap
                      @max-3xl/videopage:flex-col @max-3xl/videopage:text-nowrap
                      @max-4lg/videopage:flex-col @max-4lg/videopage:text-nowrap
                      @min-4lg/videopage:flex-col
                      @min-4lg/videopage:justify-start @min-4lg/videopage:gap-2
                      gap-1 ml-3'>
                        <p className=''>{Related.title}</p>
                        <p className='text-sm text-slate-800'>{Related.ChannelName}</p>
                      </div>
                    </Link>

                  })
                }

              </div>

            </div>



          </div>

        </section>

      </main>
    </div>
  )
}

export default VideoPage