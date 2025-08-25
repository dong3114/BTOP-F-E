import { useState } from "react";
import { MyInfo } from "../../utils/api/MemberAPI";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./styles/RegisterButton.css";
import { useNavigate } from "react-router-dom";

export default function RegisterButton({ isValid, memberInfo }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!isValid || loading) return;
    try {
      setLoading(true);
      await MyInfo.Confirm(memberInfo);
      alert("회원가입이 완료되었습니다!");
      navigate("/");
    } catch (e) {
      alert(e?.response?.data?.message ?? "회원가입 중 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-btn-wrapper" aria-busy={loading}>
      {loading ? (
        // 버튼 자리에 동일 크기의 스켈레톤 표시 (오른쪽 정렬 유지)
        <div className="register-btn-skeleton">
          <Skeleton height={44} borderRadius={8} />
        </div>
      ) : (
        <button
          type="button"
          className="register-btn"
          onClick={handleClick}
          disabled={!isValid}
        >
          회원가입
        </button>
      )}
    </div>
  );
}
