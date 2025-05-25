
function IFrame({videoUrl}) {
    
  return (
    <div className="max-w-[44rem] h-[289px] @min-md/videopage:rounded-md border-2
    @max-md/videopage:max-w-full @max-lg/videopage:max-w-full @max-lg/videopage:ml-0
    @max-4lg/videopage:max-w-full @min-4lg/videopage:max-w-[44rem] @min-4lg/videopage:h-[289px]">
            <iframe
              src={videoUrl}
              sandbox="allow-scripts allow-same-origin"
              width="100%"
              height="100%"
              allowfullscreen="allowfullscreen"
            ></iframe>
      </div>
  )
}

export default IFrame