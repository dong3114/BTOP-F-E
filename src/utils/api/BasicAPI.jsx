import axios from "axios";
import { toast } from 'react-toastify';
import { useAuthStore } from "../store/authStore";

const BTOPAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    // Authorization 헤더 추가 예시
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});

BTOPAPI.interceptors.request.use(
  (config) => {
    const { isExpired, getAuthHeader, logout } = useAuthStore.getState();
    // 만료 컷(여기서 바로 세션 정리)
    if (isExpired()) {
      logout();
      return Promise.reject({ status: 401, message: "Token expired" });
    }
    // 스토어에서 헤더 주입
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