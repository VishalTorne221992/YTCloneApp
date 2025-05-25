import React from 'react'
import LogoSection from './LogoSection'
import { sidebarLinks } from '../utils/constants';
import { Home, Video, TvMinimal, UserRound, History, Clock4, Flame, Music, Gamepad2, Trophy, TvMinimalPlay, ListMusic, Tv, Settings, Flag, CircleHelp, MessageSquareWarning } from "lucide-react";


const iconComponents = { Home, Video, TvMinimal, UserRound, History, Clock4, Flame, Music, Gamepad2, Trophy, TvMinimalPlay, ListMusic, Tv, Settings, Flag, CircleHelp, MessageSquareWarning };

export const Link = ({ link, IconComponent }) => {
  return (
    <a href={link.url} className={`flex text-[15px] items-center py-2.5 px-3 rounded-lg
       hover:bg-neutral-200 mb-1 whitespace-nowrap dark:text-neutral-300 dark:hover:bg-neutral-500`} >
      {IconComponent && <IconComponent className="mr-2.5 h-5 w-5" />}
      {link.title}
    </a>
  );
};

function Sidebar({ toggleSidebar, isSidebarOpen }) {
  return (
    <aside className={`${isSidebarOpen
      ? "max-md:left-0 w-[280px] px-3"
      : "max-md:left-[-100%] w-0 px-0"
      } max-md:absolute max-md:h-screen max-md:top-0 bg-white overflow-hidden max-md:transition-all z-50 max-md:duration-200`}>

      <div className="md:hidden p-6 px-1 sticky top-0 bg-white">
        <LogoSection toggleSidebar={toggleSidebar} />
      </div>
      
      <div style={{scrollbarWidth: 'thin'}} className="overflow-y-auto mt-3 h-[calc(100vh-70px)] pb-6">
        
        {sidebarLinks.map((category, catIndex) => (
          <div key={catIndex}>
            
            {category.categoryTitle && (
              <h4 className="text-[15px] font-semibold mb-2 ml-2 mt-4">
                {category.categoryTitle}
              </h4>
            )}
            
            {category.links.map((link, index) => {

              const IconComponent = iconComponents[link.icon];
              
              return (
                <React.Fragment key={`${catIndex}-${index}`}>
                  <Link link={link} IconComponent={IconComponent} />
                  
                  {index === category.links.length - 1 &&
                    catIndex !== sidebarLinks.length - 1 && (
                      <div className="h-[1px] my-2.5 bg-neutral-200"></div>
                    )}
                    
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>

    </aside>
  )
}

export default Sidebar