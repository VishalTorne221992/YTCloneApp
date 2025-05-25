import Sidebar from './Sidebar.jsx';
import Videoframe from "./Videoframe.jsx"

// Showing the Search page and passing filtered videos, sidebar and search flag to ensure the search page shows
// on search icon click
function SearchPage({ FilteredVideos, toggleSidebar, isSidebarOpen, setSearchFlag}) {

  
  return (
    <div className='flex overflow-auto z-10'>

    <div className={`w-full overflow-x-hidden custom_scrollbar ${isSidebarOpen}`}>
      <div className='grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] mt-0 pb-6'>
        {
          FilteredVideos.length > 0 ? FilteredVideos.map(video => {
            return <Videoframe key={video._id} video={video} setSearchFlag={setSearchFlag}/>
          }) : <h1 className='text-2xl font-bold'>No Results found</h1>
        }
      </div>
    </div>

  </div>
  )
}

export default SearchPage