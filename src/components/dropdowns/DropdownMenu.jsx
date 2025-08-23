// src/components/dropdown/ProfileDropdown.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useAuthStore } from "../../utils/store/AuthStore";
import "./styles/DropdownMenu.css";

const MY_PAGE_URL = "/myPage/myInfo";

export default function ProfileDropdown({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();

  // ✅ 객체 리턴 대신 단일 값 선택
  const userInfo = useAuthStore((s) => s.userInfo);

  const [profile, setProfile] = useState(null); // { userName, profileImageUrl }
  const [loading, setLoading] = useState(true);

  const panelRef = useRef(null);

  // ✅ onClose를 ref에 보관해 의존성에서 제거
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // 바깥 클릭 닫기 (deps: isOpen)
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) onCloseRef.current();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isOpen]);

  // ESC 닫기 (deps: isOpen)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // 데모용: 1초 후 스켈레톤 → 실제 데이터
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const t = setTimeout(() => {
      setProfile({
        userName: userInfo?.userName || "홍길동",
        profileImageUrl: userInfo?.profileImageUrl ?? null,
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(t);
  }, [isOpen, userInfo?.userName, userInfo?.profileImageUrl]);

  const goMyPage = () => {
    navigate(MY_PAGE_URL);
    onCloseRef.current();
    window.scrollTo(0, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="dropdown">
      <div ref={panelRef} className="dropdown__panel" role="menu" aria-label="사용자 메뉴">
        <div className="dropdown__caret" aria-hidden />

        <button type="button" className="dropdown__close" onClick={() => onCloseRef.current()} aria-label="닫기">
          ✕
        </button>

        {loading ? (
          <>
            <div className="dropdown__profile">
              <div className="dropdown__avatar">
                <Skeleton circle width={80} height={80} />
              </div>
              <div className="dropdown__meta" style={{ width: "100%" }}>
                <Skeleton height={18} width={120} />
                <Skeleton height={14} width={90} style={{ marginTop: 8 }} />
              </div>
            </div>

            <div className="dropdown__divider" />

            <div className="dropdown__section">
              <div className="dropdown__title">
                <Skeleton height={16} width={60} />
              </div>
              <Skeleton height={36} />
            </div>
          </>
        ) : (
          <>
            <div className="dropdown__profile">
              <button
                type="button"
                className="dropdown__avatarBtn"
                onClick={goMyPage}
                aria-label="마이페이지로 이동"
              >
                <img
                  className="avatar avatar--lg"
                  src={profile?.profileImageUrl || "/default_user.png"}
                  alt="프로필 이미지"
                  width={100}
                  height={100}
                  onError={(e) => {
                    e.currentTarget.src = "/default_user.png";
                  }}
                />
              </button>

              <div className="dropdown__meta">
                <div className="dropdown__name">{profile?.userName || "사용자"}</div>
              </div>
            </div>

            <div className="dropdown__divider" />

            <div className="dropdown__section">
              <div className="dropdown__title">내 정보</div>
              <button type="button" className="dropdown__primaryBtn" onClick={goMyPage}>
                마이페이지
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
