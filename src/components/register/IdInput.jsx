import { useEffect, useRef, useState } from "react";
import { MyInfo } from "../../utils/api/MemberAPI";
import "./styles/IdInput.css";

export default function IdInput({ value, onChange, onValidChange }) {
  const [validationMessage, setValidationMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // 최신 요청만 반영하기 위한 ref
  const lastCheckedRef = useRef("");

  // 아이디 유효성 검사
  const validateId = (id) => {
    const englishOnlyRegex = /^[a-zA-Z0-9]*$/;
    if (!id) return "❌ 필수 입력란입니다.";
    if (!englishOnlyRegex.test(id)) return "❌ 아이디는 영문과 숫자만 입력 가능합니다.";
    if (id.length < 4) return "❌ 아이디는 최소 4자 이상이어야 합니다.";
    if (id.length > 12) return "❌ 아이디는 최대 12자까지 입력 가능합니다.";
    return "✅ 사용 가능한 아이디 형식입니다.";
  };

  // 입력이 바뀌면 이전 결과 초기화
  useEffect(() => {
    setIsValid(false);
    setValidationMessage("");
    setIsChecking(false);
    onValidChange?.(false, null);
  }, [value, onValidChange]);

  // 아이디 중복 체크 (✔ 버튼 클릭 시 실행)
  const checkIdAvailability = () => {
    const id = (value ?? "").trim();
    console.log("입력한 아이디:", id);

    if (!id) {
      setValidationMessage("❌ 아이디를 입력해주세요.");
      onValidChange(false, null);
      return;
    }

    // 로컬 유효성 검사
    const validationResult = validateId(id);
    if (!validationResult.includes("✅")) {
      setValidationMessage(validationResult);
      onValidChange(false, null);
      return;
    }

    setIsChecking(true);
    lastCheckedRef.current = id; // 이 시점의 값 저장

    // ✅ API: MyInfo.ValidateId(memberId) 사용 + response.data.available 체크
    MyInfo.ValidateId(id)
      .then((available) => {
        if(lastCheckedRef.current !== id) return;
        console.log("서버 응답 available", available);

        if (available) {
          setValidationMessage("✅ 사용 가능한 아이디입니다.");
          setIsValid(true);
          onValidChange(true, id);
        } else {
          setValidationMessage("❌ 중복된 아이디입니다.");
          setIsValid(false);
          onValidChange(false, null);
        }
      })
      .catch((error) => {
        if (lastCheckedRef.current !== id) return;
        console.log("서버 오류: ", error);
        setValidationMessage(
          error?.response?.data?.message || "❌ 서버 오류 발생. 다시 시도해주세요."
        );
        setIsValid(false);
        onValidChange(false, null);
      })
      .finally(() => {
        if (lastCheckedRef.current === id) setIsChecking(false);
      });
  };

  // 버튼 비활성 조건: 형식 틀리거나 로딩 중일 때
  const canCheck = !isChecking && validateId((value ?? "").trim()).includes("✅");

  return (
    <div className="form-row">
      <h3 className="form-label">
        <label htmlFor="m_id">아이디</label>
      </h3>

      {/* 입력 + 버튼 한 줄 */}
      <div className="field-line">
        <input
          id="m_id"
          className="field-input"
          maxLength={12}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="영문/숫자 4~12자"
          autoComplete="username"
        />
        <button
          type="button"
          className="field-btn"
          onClick={checkIdAvailability}
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