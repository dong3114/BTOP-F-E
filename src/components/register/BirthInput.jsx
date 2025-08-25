import { useEffect, useMemo, useState } from "react";
import "./styles/BirthInput.css";

export default function BirthInput({ value = "", onChange, onValidChange }) {
  const [msg, setMsg] = useState("");

  const todayStr = useMemo(() => {
    const d = new Date();
    const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return dt.toISOString().slice(0, 10); // YYYY-MM-DD
  }, []);

  useEffect(() => {
    const v = (value ?? "").trim();
    if (!v) {
      setMsg("");
      onValidChange?.(false);
      return;
    }
    const okFmt = /^\d{4}-\d{2}-\d{2}$/.test(v);
    const notFuture = okFmt && v <= todayStr;
    const ok = okFmt && notFuture;

    setMsg(ok ? "✅ 입력 완료" : "❌ 올바른 날짜를 입력해주세요.");
    onValidChange?.(ok);
  }, [value, todayStr, onValidChange]);

  return (
    <div className="form-row birth-input">
      <h3 className="form-label">
        <label htmlFor="m_birth">생년월일</label>
      </h3>

      <div className="field-line">
        <input
          id="m_birth"
          type="date"
          className="field-input"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="YYYY-MM-DD"
          max={todayStr}
          aria-label="생년월일"
        />
      </div>

      <div
        className={`form-msg ${msg.startsWith("❌") ? "error" : ""}`}
        aria-live="polite"
        style={{ visibility: msg ? "visible" : "hidden" }}
      >
        {msg}
      </div>
    </div>
  );
}
