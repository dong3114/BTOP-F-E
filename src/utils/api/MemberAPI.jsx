import { useAuthStore } from "../store/AuthStore";
import BTOPAPI from "./BasicAPI"

// 주스탠드 로그인 응답 객체
const loginResponse = (data) => ({
    token: data.token,
    memberNo: data.memberNo,
    roleLevel: data.roleLevel ?? data.roleNumber,
    expires: data.expires ?? data.tokenExpires,
});

/**
 * 수정 일자: 2025.08.22 한동환
 * 수정 내용: Login 예외 처리 (401 권한 에러 처리)
 */
export const Auth = {
  Login: (payload) => {
    return BTOPAPI.post("/api/member/login", payload)
      .then(({ data }) => {
        console.log("API_URL =", process.env.REACT_APP_API_URL);
        const login = loginResponse(data);
        useAuthStore.getState().setSession(login);  // 세션 저장 (persist가 sessionStorage에 기록)
        return data; // 호출측에서 그대로 사용
      });
  },
  Logout: () => {
    useAuthStore.getState().logout();
    return Promise.resolve(true);
  },
  AdminLogin: (payload) => {
    return BTOPAPI.post("/api/admin", payload)
      .then(({ data }) => {
        console.log("API_URL =", process.env.REACT_APP_API_URL);
        const login = loginResponse(data);
        useAuthStore.getState().setSession(login);  // 세션 저장 (persist가 sessionStorage에 기록)
        return data; // 호출측에서 그대로 사용
      });
  },
}
