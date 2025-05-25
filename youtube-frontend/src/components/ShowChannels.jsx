import React from 'react'
import { Link } from 'react-router-dom'
import DeletePopup from './DeletePopup';

export default function ShowChannels({ channel, isAuthorized, SetAllChannels}) {
    return (
        <div key={channel._id} className='h-full flex flex-col gap-1 p-1 items-center justify-center @max-md/ChannelContainer:ml-1 @max-lg/ChannelContainer:ml-3 @max-2xl/ChannelContainer:ml-5 @min-2xl/ChannelContainer:ml-10'>
            <div className='@max-md/ChannelContainer:w-32 @max-md/ChannelContainer:h-32
                            @max-lg/ChannelContainer:w-32 @max-lg/ChannelContainer:h-32
                            @max-2xl/ChannelContainer:w-32 @max-2xl/ChannelContainer:h-32 
                            @min-2xl/ChannelContainer:w-[9rem] @min-2xl/ChannelContainer:h-[9rem]
                            border-2 rounded-full relative'>
                <Link to={`/channel/${channel._id}`}>
                    <img className='w-full h-full object-cover rounded-full' src={channel.channelImg} alt={channel.channelname} />
                </Link>
                {isAuthorized && <div className='inline-block absolute bottom-0 -right-2'>
                    <DeletePopup key={channel._id} element={channel} UserAllChannels={SetAllChannels} />
                </div>}

            </div>
            <Link to={`/channel/${channel._id}`}>
                <h1 className='font-semibold text-lg justify-self-center'>{channel.channelname}</h1>
                <h1 className='font-semibold text-lg'>@{channel.handle}</h1>
            </Link>
        </div>
  )
}
