import { useEffect, useMemo, useState } from "react";
import "./styles/EmailInput.css";

const DOMAIN_OPTIONS = [
  "",
  "gmail.com",
  "naver.com",
  "daum.net",
  "kakao.com",
  "outlook.com",
  "직접 입력",
];

export default function EmailInput({ value, onChange, onValidChange }) {
  // value는 전체 이메일(local@domain)로 들어오고 나가도록 처리
  const [local, setLocal] = useState("");
  const [domain, setDomain] = useState("");
  const [domainMode, setDomainMode] = useState(""); // select 선택값
  const [message, setMessage] = useState("");

  // value가 변경되면 분해
  useEffect(() => {
    if (typeof value !== "string") {
      setLocal("");
      setDomain("");
      setDomainMode("");
      setMessage("");
      onValidChange?.(false);
      return;
    }
    const [l, d] = value.split("@");
    setLocal(l || "");
    setDomain(d || "");
    setDomainMode(DOMAIN_OPTIONS.includes(d) ? d : (d ? "직접 입력" : ""));
    setMessage("");
    onValidChange?.(!!l && !!d);
  }, [value]); // onValidChange는 아래 useEffect에서 일관 처리

  // 이메일 합치기
  const email = useMemo(() => {
    const d = domainMode === "직접 입력" ? domain : domainMode;
    return local && d ? `${local}@${d}` : "";
  }, [local, domain, domainMode]);

  useEffect(() => {
    onChange?.(email);
    onValidChange?.(!!email);
    setMessage(email ? "✅ 입력 완료" : "");
  }, [email, onChange, onValidChange]);

  return (
    <div className="form-row">
      <h3 className="form-label">
        <label htmlFor="m_email_local">이메일</label>
      </h3>

      <div className="email-line">
        <input
          id="m_email_local"
          className="field-input email-local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="이메일 아이디"
          autoComplete="email"
        />
        <span className="at">@</span>
        <select
          className="field-input email-domain-select"
          value={domainMode}
          onChange={(e) => setDomainMode(e.target.value)}
        >
          <option value="">도메인 선택</option>
          {DOMAIN_OPTIONS.slice(1).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {domainMode === "직접 입력" && (
        <div className="field-line" style={{ marginTop: 8 }}>
          <input
            className="field-input"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="예: example.com"
          />
        </div>
      )}

      <div
        className="form-msg"
        aria-live="polite"
        style={{ visibility: message ? "visible" : "hidden" }}
      >
        {message}
      </div>
    </div>
  );
}
