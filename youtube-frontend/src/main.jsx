import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import ytappstore from './utils/ytappstore.js'
import App from './App.jsx'
import './App.css'
import Videolist from './components/Videolist.jsx'
import VideoPage from './components/VideoPage.jsx';
import Error from './components/Error.jsx'
import ChannelPage from './components/ChannelPage.jsx';


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Videolist />
      },
      {
        path: "/Error",
        element: <Error />
      },
      {
        path: "/video/:id",
        element: <VideoPage />
      },
      {
        path: "/channel/:id",
        element: <ChannelPage />
      }
    ]
  }
  // {
  //   path: "/channel",
  //   element: <ChannelPage />,
  //   errorElement: <Error />,
  //   children:[

  //     {
  //       path: "/channel/:id",
  //       element: <ChannelPage />
  //     }

  //   ]
  // }
])

createRoot(document.getElementById('root')).render(

  <Provider store={ytappstore}>
    <StrictMode>
      <RouterProvider router={appRouter} />
    </StrictMode>
  </Provider>
)
