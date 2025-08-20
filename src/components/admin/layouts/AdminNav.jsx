import React from 'react'
import '../styles/AdminNav.css'
import { Link } from 'react-router-dom'
import home from '../../../img/admin/home.png'

function AdminNav() {
  return (
    <div className='adminnav'>
      <ul className='ul'>
        <li className='li on'>
          <Link className='link' to=''><img src={home} /><p>대시보드</p></Link>
        </li>
        <li className='li'>
          <Link className='link' to='users'><p>회원 관리</p></Link>
        </li>
        <li className='li'>
          <Link className='link' to='boards'><p>게시판 관리</p></Link>
        </li>
      </ul>
    </div>
  )
}

export default AdminNav