import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const Layout = () => {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">

        <div className="">
          <Outlet />
        </div>

      </main>
    </div>
  )
}

export default Layout