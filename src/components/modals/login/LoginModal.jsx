import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Auth } from "../../../utils/api/MemberAPI"; // 경로는 프로젝트 구조에 맞춰 유지
import "./login_modal.css";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ open, onClose }) {
  const firstFieldRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // ESC 닫기 + 바디 스크롤 잠금 + 첫 필드 포커스
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 포커스 (포털 렌더 보장용)
    setTimeout(() => firstFieldRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]); // ✅ open 포함 (ESLint 훅 규칙 OK)

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setSubmitting(true);
    Auth.Login({ memberId: data.memberId, memberPw: data.memberPw })
      .then((res) => {
        if (!res?.error) onClose();
      })
      .catch((err) => {
        alert("로그인 정보를 확인하세요");
        navigate("/")
        onClose();
      })
      .finally(() => setSubmitting(false));
  };

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loginModalTitle"
      onMouseDown={handleBackdropClick}  // 배경 클릭 닫기
    >
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2 id="loginModalTitle">로그인</h2>
          <button
            type="button"
            className="modal-close"
            aria-label="닫기"
            onClick={onClose}            // X 버튼 닫기
          >
            ✕
          </button>
        </header>

        <form className="modal-body" onSubmit={handleSubmit}>
          <label>
            아이디
            <input
              ref={firstFieldRef}
              name="memberId"
              type="text"
              autoComplete="username"
              required
            />
          </label>
          <label>
            비밀번호
            <input
              name="memberPw"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <footer className="modal-footer">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "로그인 중…" : "로그인"}
            </button>
          </footer>
        </form>
      </div>
    </div>,
    document.body
  );
}
