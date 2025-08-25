import { useEffect, useRef, useState } from "react";
import { MyInfo } from "../../utils/api/MemberAPI";
import "./styles/NameInput.css";

export default function NameInput({ value, onChange, onValidChange }) {
  const [validationMessage, setValidationMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // 최신 요청만 반영하기 위한 ref
  const lastCheckedRef = useRef("");

  // 닉네임 유효성 검사 (로컬)
  const validateNick = (nick) => {
    const englishOnlyRegex = /^[a-zA-Z0-9]*$/;
    if (!nick) return "❌ 필수 입력란입니다.";
    if (!englishOnlyRegex.test(nick)) return "❌ 닉네임은 영문과 숫자만 입력 가능합니다.";
    if (nick.length < 4) return "❌ 닉네임은 최소 4자 이상이어야 합니다.";
    if (nick.length > 12) return "❌ 닉네임은 최대 12자까지 입력 가능합니다.";
    return "✅ 사용 가능한 닉네임 형식입니다.";
  };

  // 입력이 바뀌면 이전 결과 초기화
  useEffect(() => {
    setIsValid(false);
    setValidationMessage("");
    setIsChecking(false);
    onValidChange?.(false, null);
  }, [value, onValidChange]);

  // 닉네임 중복 체크
  const checkNickAvailability = () => {
    const nick = (value ?? "").trim();
    console.log("입력한 닉네임:", nick);

    if (!nick) {
      setValidationMessage("❌ 닉네임을 입력해주세요.");
      onValidChange(false, null);
      return;
    }

    // 로컬 유효성 검사
    const validationResult = validateNick(nick);
    if (!validationResult.includes("✅")) {
      setValidationMessage(validationResult);
      onValidChange(false, null);
      return;
    }

    setIsChecking(true);
    lastCheckedRef.current = nick;

    // ✅ API 호출: MyInfo.ValidateNick(memberNick)
    MyInfo.ValidateNick(nick)
      .then((available) => {
        if (lastCheckedRef.current !== nick) return;
        console.log("서버 응답 available", available);

        if (available) {
          setValidationMessage("✅ 사용 가능한 닉네임입니다.");
          setIsValid(true);
          onValidChange(true, nick);
        } else {
          setValidationMessage("❌ 중복된 닉네임입니다.");
          setIsValid(false);
          onValidChange(false, null);
        }
      })
      .catch((error) => {
        if (lastCheckedRef.current !== nick) return;
        console.log("서버 오류: ", error);
        setValidationMessage(
          error?.response?.data?.message || "❌ 서버 오류 발생. 다시 시도해주세요."
        );
        setIsValid(false);
        onValidChange(false, null);
      })
      .finally(() => {
        if (lastCheckedRef.current === nick) setIsChecking(false);
      });
  };

  // 버튼 활성 조건
  const canCheck = !isChecking && validateNick((value ?? "").trim()).includes("✅");

  return (
    <div className="form-row">
      <h3 className="form-label">
        <label htmlFor="m_nick">닉네임</label>
      </h3>

      <div className="field-line">
        <input
          id="m_nick"
          className="field-input"
          maxLength={12}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="영문/숫자 4~12자"
          autoComplete="nickname"
        />
        <button
          type="button"
          className="field-btn"
          onClick={checkNickAvailability}
          disabled={!canCheck}
        >
          {isChecking ? "확인 중..." : "중복 확인"}
        </button>
      </div>

      <div
        className="form-msg"
        aria-live="polite"
        style={{ visibility: validationMessage ? "visible" : "hidden" }}
      >
        {isChecking ? "중복 확인 중..." : validationMessage}
      </div>
    </div>
  );
}
