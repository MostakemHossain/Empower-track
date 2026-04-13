import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const Layout = () => {
  return (
    <div className='flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30'>
        <Sidebar/>
        <main className='flex overflow-y-auto'>
            <div className='pt-16 sm:p-0 sm:pt-6 lg:p-8 max-w-400 mx-auto'>
            <Outlet/>
            </div>
        </main>
    </div>
  )
}

export default Layout