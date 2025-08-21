import React, { useState } from 'react'
import '../styles/AdminNav.css'
import { Link } from 'react-router-dom'
import logowhite from '../../../img/admin/logo_white.png'

function AdminNav() {

    const [activeIndex, setActiveIndex] = useState(0);

  // 메뉴 배열
  const menuItems = [
    {name: '대시보드', link: ''},
    {name: '회원 관리', link: 'users'},
    {name: '게시판 관리', link: 'boards'}
  ];

  return (
    <div className='adminnav'>
      <div className='logoBox'>
        <img src={logowhite}></img>
      </div>
      <ul className='ul'>
        {menuItems.map((item, index) => (
          <li key={index}
          className={`li ${activeIndex === index ? 'on' : ''}`}
          onClick={() => setActiveIndex(index)}>
          <Link className='link' to={item.link}><p>{item.name}</p></Link>
        </li>
      ))}
      </ul>
    </div>
  )
}

export default AdminNav