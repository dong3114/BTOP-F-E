import axios from "axios";
import { toast } from 'react-toastify';
import { useAuthStore } from "../store/AuthStore";

const BASE_URL = process.env.REACT_APP_API_URL

const BTOPAPI = axios.create({
  baseURL: BASE_URL,
  headers: {"Content-Type": "application/json" },
  withCredentials: false, // JWT 인증 등 세션 쿠키 필요 시 추가
});

BTOPAPI.interceptors.request.use(
  (config) => {
    const { token, isExpired, getAuthHeader, logout } = useAuthStore.getState();
    // 토큰은 있지만 만료 됐을 때(여기서 바로 세션 정리)
    if (token && isExpired()) {
      logout();
      console.log(`url 위치: ${BASE_URL}`)
      return Promise.reject({ status: 401, message: "Token expired" });
    }
    // 스토어에서 헤더 주입
    console.log(`url 위치: ${BASE_URL}`)
    Object.assign(config.headers, getAuthHeader());
    return config;
  },
  (err) => Promise.reject(err)
);

// 응답 인터셉터
let toastLock = false;  // 토스트 과다 방지
const showToastOnce = (msg) => {
  if (toastLock) return;
  toastLock = true;
  toast.error(msg);
  setTimeout(() => (toastLock = false), 1200);
};

BTOPAPI.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status ?? 0;

    if (status === 0) {
      showToastOnce('서버 연결 실패');
      return Promise.reject(err);
    }
    
    switch (status) {
      case 401:
        useAuthStore.getState().logout(); 
        showToastOnce('로그인이 필요합니다.');
        break;
      case 403:
        showToastOnce('권한이 없습니다.');
        break;
      case 500:
        showToastOnce('서버 에러입니다.');
        break;
      default:
        showToastOnce(err?.response?.data?.errorMessage || "알 수 없는 오류입니다.");
        break;
    }
    return Promise.reject(err); // 호출부에서 catch로 받게 함
  }
);

export default BTOPAPI;