import { useEffect, useState } from "react";
import "./styles/PhoneNumberInput.css";

function formatPhone(input) {
  // 숫자 외 제거
  const digits = (input || "").replace(/\D/g, "");
  // 3-4-4 형태로 하이픈 삽입
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export default function PhoneNumberInput({ value, onChange, onValidChange }) {
  const [val, setVal] = useState("");

  useEffect(() => {
    setVal(typeof value === "string" ? value : "");
    // 유효성 체크는 안 하지만, 값이 있으면 true로 간주(원하면 false로 바꿔도 됨)
    onValidChange?.(!!value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e) => {
    const next = formatPhone(e.target.value);
    setVal(next);
    onChange?.(next);
    onValidChange?.(!!next);
  };

  return (
    <div className="form-row">
      <h3 className="form-label">
        <label htmlFor="m_phone">휴대폰 번호</label>
      </h3>

      <div className="field-line">
        <input
          id="m_phone"
          className="field-input"
          value={val}
          onChange={handleChange}
          placeholder="010-1234-5678"
          inputMode="numeric"
          autoComplete="tel"
        />
      </div>

      <div
        className="form-msg"
        aria-live="polite"
        style={{ visibility: "hidden" }}
      >
        {/* 검증 메시지 없음 */}
      </div>
    </div>
  );
}
