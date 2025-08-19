import { useAuthStore } from "../store/authStore";
import BTOPAPI from "./BasicAPI"

// 주스탠드 로그인 응답 객체
const loginResponse = (data) => ({
    token: data.token,
    memberNo: data.memberNo,
    roleLevel: data.roleLevel ?? data.roleNumber,
    expires: data.expires ?? data.tokenExpires,
});

export const Auth = {
  Login: (payload) => {
    return BTOPAPI.post("/api/member/login", payload)
      .then(({ data }) => {
        const login = loginResponse(data);
        useAuthStore.getState().setSession(login);  // 세션 저장 (persist가 sessionStorage에 기록)
        return data; // 호출측에서 그대로 사용
      });
  },
  Logout: () => {
    useAuthStore.getState().logout();
    return Promise.resolve(true);
  },
}
