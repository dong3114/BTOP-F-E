import React, { useRef, useState } from 'react'
import './styles/AdminLogin.css'
import logogreen from '../../img/admin/logo_green.png'
import { Auth } from '../../utils/api/MemberAPI';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const firstFieldRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
      e.preventDefault();
      if (submitting) return;
  
      const form = e.currentTarget;
      const data = Object.fromEntries(new FormData(form));
  
      setSubmitting(true);
      Auth.AdminLogin({ memberId: data.memberId, memberPw: data.memberPw })
        .then((res) => {
          navigate("/admin/main")
        })
        .finally(() => setSubmitting(false));
    };

  return (
    <div className='logincontent'>

    <div className='loginbox'>
      <div className='logo'><img src={logogreen}></img></div>
      <form className='adminloginfrm' onSubmit={handleSubmit}>
        <div className='inputbox'><input type='text' ref={firstFieldRef} name='memberId' placeholder="아이디" required ></input></div>
        <div className='inputbox'><input type='password' name='memberPw' placeholder="비밀번호" required></input></div>
        <div className='btnbox'><button type='submit' disabled={submitting}>{submitting ? "로그인 중" : "로그인"}</button></div>
      </form>
    </div>
    </div>
  )
}

export default AdminLogin