import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function LogoSection({ toggleSidebar, setSearchFlag }) {

  let navigate = useNavigate();

  function handleLogoClick(e){
     e.preventDefault();

     setSearchFlag(false);
     navigate('/')
  }


  return (
    <div className='flex cursor-pointer'>

      <button onClick={toggleSidebar} className='yt_menu w-max mr-5 ml-2
       @max-sm/wrapper:mr-2.5 @max-sm/wrapper:ml-0
       @max-md/wrapper:mr-2.5 @max-md/wrapper:ml-0
       @max-4lg/wrapper:mr-2.5 @max-4lg/wrapper:ml-0
       @min-4lg/wrapper:w-max @min-4lg/wrapper:mr-5 @min-4lg/wrapper:ml-2
      '> <img className='@max-sm/wrapper:w-6 @max-md/wrapper:w-6 @max-4lg/wrapper:w-6 @min-4lg/wrapper:w-8 w-8' src="https://img.icons8.com/?size=100&id=120374&format=png&color=000000" alt="" /></button>
      <Link onClick={(e) => handleLogoClick(e)} style={{ textDecoration: 'none' }} className='flex items-center text-nowrap'>
        <img className='min-w-1 max-w-8' src="https://img.icons8.com/?size=100&id=9a46bTk3awwI&format=png&color=000000" alt="youtube_logo" />
        <h1 className='@min-sm/wrapper:text-lg @max-sm/wrapper:text-[1rem] @min-md/wrapper:text-lg @max-md/wrapper:text-[1rem]' 
        style={{ fontFamily: "Roboto Condensed, sans-serif", fontWeight: 600 }}>
        YouTube <sup>IN</sup></h1>
      </Link>
    
    </div>
  )
}

export default LogoSection