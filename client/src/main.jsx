import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import GenClips from './components/GenClips'
import SavedClips from './components/SavedClips'
import LoginPage from './components/LoginPage'
import SubscriptionForm from './components/SubscriptionForm'
import NotFound from './components/NotFound'

import './index.css'
import App from './App.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <GenClips />
      }, 
      {
        path: '/saved',
        element: <SavedClips />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/subscribe',
        element: <SubscriptionForm />
      },
      // {
      //   path: '*',
      //   element: <NotFound />
      // }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
