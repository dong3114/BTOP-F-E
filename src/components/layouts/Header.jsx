// src/components/MainHeader.jsx
// react관련 임포트
import { useState } from "react";
import { Link } from "react-router-dom";
import { GiTigerHead } from "react-icons/gi";
import { useNavigate } from 'react-router-dom'
// 사용자 커스텀 임포트 파일
import { Auth } from "../../utils/api/MemberAPI";
import LoginModal from "../modals/login/LoginModal";
import { useAuthStore } from "../../utils/store/AuthStore";
// css 파일
import './Header.css'; // Changed import path

export default function Header({ title }) {
    // 로그인 및 모달 상태 관리
    const [open, setOpen] = useState(false);
    const userInfo = useAuthStore((s) => s.userInfo);
    const isAuthed = !!userInfo?.token;               // 또는 !!userInfo?.memberNo
    const navigate = useNavigate();
    
    // 로그아웃
    const handleLogout = () =>
    Auth.Logout().then(() => {
        console.log('로그아웃 되었습니다.');
        alert("로그아웃 되었습니다.");
        navigate("/")})
        .catch(() => {});

    return (
        <header className="header">
            <div className="header-left">
                <div className="header-title-container">
                    <Link to="/" >
                        <img
                            src="/logo_re.jpg"
                            alt="마스코트"
                            style={{
                                width: "72px",
                                height: "72px",
                                objectFit: "contain",
                                borderRadius: "8px",
                            }}
                        />
                    </Link>
                </div>
                <div className='nav'>
                    {/* 자유게시판 링크를 /post로 수정 */}
                    <Link to="/post" className="nav-link">자유 게시판</Link>
                    <Link to="/notice" className="nav-link">공지사항</Link>
                </div>
            </div>

            <div className="auth-buttons">
                {isAuthed ? (
                    <button className="auth-button logout" onClick={handleLogout}>로그아웃</button>
                ) : (
                    <>
                        <button className="auth-button login" onClick={() => setOpen(true)}>로그인</button>
                        <button className="auth-button signup">회원가입</button>
                    </>
                )}
            </div>
            {/* 로그인 모달 컴포넌트 */}
            <LoginModal open={open} onClose={() => setOpen(false)} />
        </header>
    );
}