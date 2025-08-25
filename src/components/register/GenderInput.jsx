import { useEffect, useState } from "react";
import "./styles/GenderInput.css";

export default function GenderInput({ value = "", onChange, onValidChange }) {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const ok = value === "m" || value === "w";
    setMsg(ok ? "✅ 선택됨" : "");
    onValidChange?.(ok);
  }, [value, onValidChange]);

  return (
    <div className="form-row gender-input">
      <h3 className="form-label">
        <label>성별</label>
      </h3>

      <div className="field-line">
        <div className="gender-group" role="radiogroup" aria-label="성별">
          <label className={`gender-option ${value === "m" ? "checked" : ""}`}>
            <input
              type="radio"
              name="memberGender"
              value="m"
              checked={value === "m"}
              onChange={(e) => onChange?.(e.target.value)}
            />
            <span>남</span>
          </label>

          <label className={`gender-option ${value === "w" ? "checked" : ""}`}>
            <input
              type="radio"
              name="memberGender"
              value="w"
              checked={value === "w"}
              onChange={(e) => onChange?.(e.target.value)}
            />
            <span>여</span>
          </label>
        </div>
      </div>

      <div
        className="form-msg"
        aria-live="polite"
        style={{ visibility: msg ? "visible" : "hidden" }}
      >
        {msg}
      </div>
    </div>
  );
}
