import { MoreVerticalIcon } from 'lucide-react';
import React from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'


function Videoframe({ video }) {

  const navigate = useNavigate();

  function handleChannelClick(e){
      e.preventDefault();
      
      navigate(`/channel/${video.channelId}`)

  }
  
  return (
    <Link to={`/video/${video._id}`} className='Videogroup relative'>
      <div className="relative">
        <img className="rounded-lg aspect-video object-cover" src={video.thumbnailUrl} alt={video.title} />
        <p className="absolute bottom-2 right-2 text-sm bg-black bg-opacity-50 text-white px-1.5 font-medium rounded-md">
          {video.duration}
        </p>
      </div>
      <div className="flex gap-3 py-3 px-2 relative">
        <img className="h-9 w-9 rounded-full object-cover" src={video.ChannelImage} alt={video.ChannelName} />
        <div>
          <h2 className="group-hover:text-blue-500 font-semibold leading-snug line-clamp-2 dark:text-neutral-300" title={video.title}>
            {video.title}
          </h2>
          <p onMouseDown={(e) => handleChannelClick(e)} className="text-sm mt-1 text-neutral-700 hover:text-neutral-500 dark:text-neutral-300" onClick={(e) => handleChannelClick(e)}>
             {video.ChannelName}
          </p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {video.views} Views • {video.ChannelName} 
          </p>
        </div>
        <MoreVerticalIcon className='inline-block absolute top-0 -right-2 translate-y-[50%]' />
      </div>
    </Link>
  )
}

export default Videoframe