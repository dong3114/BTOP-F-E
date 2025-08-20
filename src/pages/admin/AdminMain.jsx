import React from 'react'
import AdminNav from '../../components/admin/layouts/AdminNav'
import { Outlet } from 'react-router-dom'
import './styles/main.css'

function AdminMain() {
  return (
      <div className='adminMain'>
        <AdminNav />
        <div>
          <Outlet />
        </div>
      </div>

  )
}

export default AdminMain