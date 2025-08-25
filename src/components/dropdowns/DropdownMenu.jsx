// src/components/dropdown/ProfileDropdown.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useAuthStore } from "../../utils/store/AuthStore";
import "./styles/DropdownMenu.css";
import { MyInfo } from "../../utils/api/MemberAPI";

const MY_PAGE_URL = "/myPage/myInfo";

export default function ProfileDropdown({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const memberNo = useAuthStore((s) => s.userInfo?.memberNo);
  const [memberNick, setMemberNick] = useState("사용자");
  const [profileImageUrl, setProfileImageUrl] = useState(null); // 문자열(null 허용)
  const [loading, setLoading] = useState(false);

  const panelRef = useRef(null);

  // 최신 onClose 보존
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) onCloseRef.current();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isOpen]);

  // ESC 닫기
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onCloseRef.current(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !memberNo) return;
    let cancelled = false;
    setLoading(true);

    MyInfo.MemberInfo()
      .then((data) => {
        if (cancelled) return;
        setMemberNick(data?.memberNick ?? "사용자");

        setProfileImageUrl(data?.profileImageUrl ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[MemberInfo] error:", err);
        setMemberNick("사용자");
        setProfileImageUrl(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isOpen, memberNo]);

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
        <button type="button" className="dropdown__close" onClick={() => onCloseRef.current()} aria-label="닫기">✕</button>

        {loading ? (
          <>
            <div className="dropdown__profile">
              <div className="dropdown__avatar"><Skeleton circle width={80} height={80} /></div>
              <div className="dropdown__meta" style={{ width: "100%" }}>
                <Skeleton height={18} width={120} />
                <Skeleton height={14} width={90} style={{ marginTop: 8 }} />
              </div>
            </div>
            <div className="dropdown__divider" />
            <div className="dropdown__section">
              <div className="dropdown__title"><Skeleton height={16} width={60} /></div>
              <Skeleton height={36} />
            </div>
          </>
        ) : (
          <>
            <div className="dropdown__profile">
              <button type="button" className="dropdown__avatarBtn" onClick={goMyPage} aria-label="마이페이지로 이동">
                <img
                  className="avatar avatar--lg"
                  src={profileImageUrl || "/default_user.png"}
                  alt="프로필 이미지"
                  width={100}
                  height={100}
                  onError={(e) => { e.currentTarget.src = "/default_user.png"; }}
                />
              </button>
              <div className="dropdown__meta">
                <div className="dropdown__name">{memberNick}</div>
              </div>
            </div>

            <div className="dropdown__divider" />
            <div className="dropdown__section">
              <div className="dropdown__title">내 정보</div>
              <button type="button" className="dropdown__primaryBtn" onClick={goMyPage}>마이페이지</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}