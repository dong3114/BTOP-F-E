import React from 'react'
import AdminNav from '../../components/admin/layouts/AdminNav'
import { Outlet } from 'react-router-dom'
import './styles/AdminMain.css'

function AdminMain() {
  return (
      <div className='adminMain'>
        <div className='nav'>
          <AdminNav />
        </div>
        <div className='content'>
          <Outlet />
        </div>
      </div>

  )
}

export default AdminMain