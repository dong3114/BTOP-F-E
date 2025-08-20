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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiTigerHead } from "react-icons/gi";
import './Header.css'; // Changed import path

// 로그인 모달 컴포넌트
const LoginModal = ({ open, onClose }) => {
    if (!open) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>로그인</h3>
                <p>이곳에 실제 로그인 폼이 들어갑니다.</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default function Header({ title }) {
    // 로그인 및 모달 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 로그인 버튼 클릭 핸들러
    const handleLoginClick = () => {
        setIsModalOpen(true);
    };

    // 로그아웃 버튼 클릭 핸들러
    const handleLogout = () => {
        setIsLoggedIn(false);
        console.log('로그아웃 되었습니다.');
        alert("로그아웃 되었습니다.");
    };

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // setIsLoggedIn(true); // 로그인 상태 업데이트시 사용가능
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="header-title-container">
                    <h3 className="header-title"><GiTigerHead className="title-icon" />{title}</h3>
                </div>
                <div className='nav'>
                    {/* 자유게시판 링크를 /post로 수정 */}
                    <Link to="/post" className="nav-link">자유 게시판</Link>
                    <Link to="/notice" className="nav-link">공지사항</Link>
                </div>
            </div>

            <div className="auth-buttons">
                {isLoggedIn ? (
                    <button className="auth-button logout" onClick={handleLogout}>로그아웃</button>
                ) : (
                    <>
                        <button className="auth-button login" onClick={handleLoginClick}>로그인</button>
                        <button className="auth-button signup">회원가입</button>
                    </>
                )}
            </div>
            
            {/* 로그인 모달 컴포넌트 */}
            <LoginModal open={isModalOpen} onClose={handleCloseModal} />
        </header>
    );
}