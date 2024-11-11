import React from 'react'
import Login from './Login'
import Register from './Register'

const LoginPage = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center mb-6 text-base font-semibold text-gray-900 dark:text-white mt-24">
        <Login />
        <Register />
    </div>
  )
}

export default LoginPage
