import React, { useEffect } from 'react'

export default function useClickAway(ref, callback) {

    useEffect(() => {
      
        function handleClickAway(event){
            if(ref.current && !ref.current.contains(event.target)){
                callback();
            }
        }

        document.addEventListener('mousedown', handleClickAway)
    
      return () => {
        document.removeEventListener('mousedown', handleClickAway)
      }
    }, [ref])
    
}
