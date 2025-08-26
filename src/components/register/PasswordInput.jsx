import { useEffect, useState } from "react";
import "./styles/PasswordInput.css";

export default function PasswordInput({ value, onChange, onValidChange }) {
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  // 매 입력 변화 시 검증
  useEffect(() => {
    const pwd = (value ?? "").trim();
    const cfm = (confirm ?? "").trim();

    if (!pwd && !cfm) {
      setMessage("");
      onValidChange?.(false);
      return;
    }
    if (!pwd) {
      setMessage("❌ 비밀번호를 입력해주세요.");
      onValidChange?.(false);
      return;
    }
    if (!cfm) {
      setMessage("ℹ️ 비밀번호 확인을 입력해주세요.");
      onValidChange?.(false);
      return;
    }
    if (pwd !== cfm) {
      setMessage("❌ 비밀번호가 일치하지 않습니다.");
      onValidChange?.(false);
      return;
    }
    setMessage("✅ 비밀번호가 일치합니다.");
    onValidChange?.(true);
  }, [value, confirm, onValidChange]);

  return (
    <div className="form-row">
      <h3 className="form-label">
        <label htmlFor="m_pw">비밀번호</label>
      </h3>

      <div className="field-line">
        <input
          id="m_pw"
          type="password"
          className="field-input"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="비밀번호"
          autoComplete="new-password"
        />
      </div>

      <div className="field-line" style={{ marginTop: 8 }}>
        <input
          id="m_pw_confirm"
          type="password"
          className="field-input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="비밀번호 확인"
          autoComplete="new-password"
        />
      </div>

      <div
        className={`form-msg ${message.startsWith("❌") ? "error" : ""}`}
        aria-live="polite"
        style={{ visibility: message ? "visible" : "hidden" }}
      >
        {message}
      </div>
    </div>
  );
}
