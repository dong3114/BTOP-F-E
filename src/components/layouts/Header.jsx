// src/components/MainHeader.jsx
import { Link, NavLink } from "react-router-dom";
import "./MainHeader.css";
import { useAuthStore } from "../../utils/store/AuthStore";
import { useNavigate } from 'react-router-dom'
import { Auth } from "../../utils/api/MemberAPI";
import { useState } from "react";
import LoginModal from "../modals/login/LoginModal";

export default function MainHeader() {
  const [open, setOpen] = useState(false);
  const userInfo = useAuthStore((s) => s.userInfo);
  const isAuthed = !!userInfo?.token;               // 또는 !!userInfo?.memberNo
  const navigate = useNavigate();

  const handleLogout = () =>
    Auth.Logout().then(() => navigate("/")).catch(() => {});

  return (
    <header className="header-bar">
      <div className="header-inner">
        {/* 왼쪽: 로고 */}
        <div className="nav-left">
          <Link to="/" className="logo" aria-label="홈으로 이동">
            BTOP로고
          </Link>
        </div>

        {/* 오른쪽: 네비게이션 */}
        <nav className="nav-right" aria-label="Primary">
          <NavLink to="/posts" className="nav-item">게시판</NavLink>
          <NavLink to="/notices" className="nav-item">공지사항</NavLink>

          {isAuthed ? (
            <>
              {/* 프로필/마이페이지 링크 */}
              <NavLink to={`/members/${userInfo.memberNo}`} className="nav-item">
                내 프로필
              </NavLink>
              {/* 로그아웃은 링크가 아니라 버튼 */}
              <button type="button" className="nav-item nav-cta" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <button className="nav-item nav-cta" onClick={() => setOpen(true)}>
              로그인
            </button>
          )}
        </nav>
        <LoginModal open={open} onClose={() => setOpen(false)} />
      </div>
      <hr />
    </header>
  );
}
