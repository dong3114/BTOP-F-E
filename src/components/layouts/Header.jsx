// src/components/MainHeader.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../utils/store/AuthStore";
import { Auth } from "../../utils/api/MemberAPI";
import LoginModal from "../modals/login/LoginModal";
import ProfileDropdown from "../dropdowns/DropdownMenu";
import "./styles/Header.css";

export default function Header({ title }) {
  const [openLogin, setOpenLogin] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const userInfo = useAuthStore((s) => s.userInfo);
  const isAuthed = !!userInfo?.token; // 또는 !!userInfo?.memberNo
  const navigate = useNavigate();

  const handleLogout = () =>
    Auth.Logout()
      .then(() => {
        alert("로그아웃 되었습니다.");
        navigate("/");
      })
      .catch(() => {});

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-title-container">
          <Link to="/">
            <img
              src="/logo_re.jpg"
              alt="마스코트"
              style={{ width: 72, height: 72, objectFit: "contain", borderRadius: 8 }}
            />
          </Link>
        </div>
        <nav className="nav">
          <Link to="/post" className="nav-link">공지사항</Link>
          {/* <Link to="/notice" className="nav-link">공지사항</Link> */}
        </nav>
      </div>

      <div className="auth-buttons">
        {isAuthed ? (
          <>
            {/*  앵커 래퍼: 이 요소의 '오른쪽 끝'을 기준으로 드롭다운이 뜸 */}
            <div className="header-actions">
              <button
                type="button"
                className="profile-trigger"
                onClick={() => setOpenProfile(v => !v)}
                aria-label="프로필 열기"
                style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}
              >
                <img
                  src={userInfo?.profileImageUrl || "/default_user.png"}
                  alt="프로필"
                  className="avatar avatar--sm"
                  width={40}
                  height={40}
                />
              </button>

              <button className="auth-button logout" onClick={handleLogout}>
                로그아웃
              </button>

              <ProfileDropdown
                isOpen={openProfile}
                onClose={() => setOpenProfile(false)}
              />
            </div>
          </>
        ) : (
          <>
            <button className="auth-button login" onClick={() => setOpenLogin(true)}>
              로그인
            </button>
            <button className="auth-button signup" onClick={() => navigate("/member/register")}>회원가입</button>
          </>
        )}
      </div>

      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
    </header>
  );
}
