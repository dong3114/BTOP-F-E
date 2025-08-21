import React from 'react'
import './styles/AdminLogin.css'
import logogreen from '../../img/admin/logo_green.png'

function AdminLogin() {
  return (
    <div className='logincontent'>

    <div className='loginbox'>
      <div className='logo'><img src={logogreen}></img></div>
      <div className='inputbox'><input type='text' name='id' placeholder="아이디" ></input></div>
      <div className='inputbox'><input type='password' name='password' placeholder="비밀번호"></input></div>
      <div className='btnbox'><button type='submit'>로그인</button></div>
    </div>
    </div>
  )
}

export default AdminLogin