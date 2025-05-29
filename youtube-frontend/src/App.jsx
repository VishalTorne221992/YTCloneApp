import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Videolist from './components/Videolist.jsx'
import { Outlet } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { fetchVideosData } from './utils/videoSlice.js'
import Modal from 'react-modal'
import { ToastContainer } from 'react-toastify'
import SearchPage from './components/SearchPage.jsx'
//import { categories } from './utils/constants.js'

// const API = "AIzaSyAOpTNq7YvJsGfVCvGOWRAPJY44bizF20
// var fetchurl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,id,statistics&chart=mostPopular&regionCode=IN&maxResults=10&key=${API}`

Modal.setAppElement("#root")
function App() {

  let AllVideos = useSelector(store => store.Videos.videos);
  let AppVideos = AllVideos.videos;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [SearchText, setSearchText] = useState('');
  const [Searchflag, setSearchFlag] = useState(false)
  const [FilteredVideos, setFilteredVideos] = useState([])

  let dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {

    dispatch(fetchVideosData());

  }, [dispatch]);

  useEffect(() => {

    if(SearchText == ''){
      setSearchFlag(false)
    }

  }, [SearchText]);


  return (
    <div className='@container/wrapper max-h-screen overflow-auto flex flex-col'>
    
      <header className='flex w-full items-center @max-4lg/wrapper:relative @min-4lg/wrapper:justify-between p-2.5'>
        <Header toggleSidebar={toggleSidebar} Searchflag={Searchflag} setSearchFlag={setSearchFlag} SearchText={SearchText} setSearch={setSearchText} setFiltered={setFilteredVideos} />
      </header>
  
      <Outlet context={[toggleSidebar, isSidebarOpen, setFilteredVideos, FilteredVideos, setSearchFlag, Searchflag]} />
      <ToastContainer />
    </div>
  )
}

export default App
