import React, { useEffect, useState } from 'react'
import { useOutletContext } from "react-router-dom"
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Videoframe from "./Videoframe"
import SearchPage from './SearchPage.jsx';
import { categories } from '../utils/constants.js'

function Videolist() {

  const [toggleSidebar, isSidebarOpen, setFilteredVideos, FilteredVideos, setSearchFlag, Searchflag] = useOutletContext();
  
  const [CapsuleSearch, setCapsuleSearch] = useState(false)

  let AllVideos = useSelector(store => store.Videos.videos);

  const videos = AllVideos.videos;

  useEffect(() => {
    setCapsuleSearch(true)
  }, [FilteredVideos])

  // Handle Capsule click
  function handleCapsuleClick(e){
     
     let capsule = e.target.textContent;
     const filter = videos.filter((video) => {
      return video.title.toLowerCase().includes(capsule.toLowerCase());
    })

    if(capsule === 'All'){
      setFilteredVideos(videos)
      return
    }

    setSearchFlag(true)
    setFilteredVideos(filter)
     
  } 

  // List All the videos and return a component that shows them on the screen
  const ListVideos = videos && videos.map(video => { return <Videoframe key={video._id} video={video} setSearchFlag={setSearchFlag} /> })


  return (
    <div style={{scrollbarWidth: 'none'}} className='flex overflow-scroll z-30'>

      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className={`w-full max-sm:px-2 px-4 overflow-x-hidden ${isSidebarOpen}`}>

      <div className="sticky bg-white top-0 z-40 pb-4 pr-2 pl-2 pt-3 flex items-center m-auto gap-3 overflow-auto" style={{ scrollbarWidth : 'none'}}>
        {
          categories && categories.map((category) => {
            return <div key={category} onMouseDown={(e) => handleCapsuleClick(e)} className={`text-[15px] h-8 font-medium whitespace-nowrap rounded-lg px-3 py-1 ${category === "All" ? 'bg-black text-white hover:bg-neutral-950' : 'bg-neutral-200 text-black hover:bg-neutral-300'} cursor-pointer`}>{category}</div>
          })
        }
      </div>
        
        <div className='grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] mt-5 pb-6'>
          {
            !CapsuleSearch || !Searchflag ? ListVideos : <SearchPage toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} setSearchFlag={setSearchFlag} FilteredVideos={FilteredVideos} />
          }
        </div>
      </div>

    </div>
  )
}

export default Videolist