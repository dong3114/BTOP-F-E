import { useEffect, useRef, useState } from "react";
import { getRegionByAddress } from "../../utils/api/KakaoAPI";
import "./styles/AddressPicker.css";

export default function AddressPicker({ value, onChange, onValidChange }) {
  const [loading, setLoading] = useState(false);
  const [regionString, setRegionString] = useState(value || "");
  const [preview, setPreview] = useState({ sido: "", sigungu: "", dong: "" });
  const scriptLoaded = useRef(false);

  // Postcode 스크립트 로드
  useEffect(() => {
    if (window.daum?.Postcode) { scriptLoaded.current = true; return; }
    const s = document.createElement("script");
    s.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    s.async = true;
    s.onload = () => { scriptLoaded.current = true; };
    document.body.appendChild(s);
  }, []);

  // 외부 value 반영
  useEffect(() => { setRegionString(value || ""); }, [value]);

  const openPostcode = () => {
    if (!scriptLoaded.current) return;
    new window.daum.Postcode({
      oncomplete: async (data) => {
        const fullAddress = data.roadAddress || data.jibunAddress || "";
        if (!fullAddress) {
          setPreview({ sido: "", sigungu: "", dong: "" });
          setRegionString("");
          onChange?.("");
          onValidChange?.(false);
          return;
        }

        try {
          setLoading(true);
          const r = await getRegionByAddress(fullAddress);
          if (r) {
            const str = [r.sido, r.sigungu, r.dong].filter(Boolean).join(" ");
            setPreview(r);
            setRegionString(str);
            onChange?.(str);        // ★ 부모에는 시군구 문자열만 반환
            onValidChange?.(true);
          } else {
            onValidChange?.(false);
          }
        } catch (e) {
          console.error(e);
          onValidChange?.(false);
        } finally {
          setLoading(false);
        }
      },
    }).open();
  };

  return (
    <div className="form-row">
      <h3 className="form-label">
        <label>주소(시/군/구)</label>
      </h3>

      <div className="field-line">
        <input
          className="field-input"
          value={regionString}
          onChange={(e) => {
            const v = e.target.value;
            setRegionString(v);
            onChange?.(v);
            onValidChange?.(false); // 수동 수정 시 재검증
          }}
          placeholder="주소찾기로 시/군/구를 선택하세요"
          readOnly
        />
        <button
          type="button"
          className="field-btn"
          onClick={openPostcode}
          disabled={loading}
        >
          {loading ? "확인 중..." : "주소찾기"}
        </button>
      </div>

      {(preview.sido || preview.sigungu || preview.dong) && (
        <div className="form-msg" aria-live="polite">
          {preview.sido} {preview.sigungu} {preview.dong}
        </div>
      )}
    </div>
  );
}
