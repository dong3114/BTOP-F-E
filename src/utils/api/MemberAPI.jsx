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

export const MyInfo = {
  MemberInfo: () => {
    return BTOPAPI.get("/api/member/info")
      .then(({data}) => {
        if(data == null) {
          console.log("회원 정보가 없습니다.");
          return;
        }
        console.log("회원정보: ", data)
        return data;
      });
  },
  ValidateId: (memberId) => {
    return BTOPAPI.get("/api/member/register/validate/id", {params: {memberId}} )
      .then(({data}) => {
        // !!두번 쓰는이유 truthy/falsy 값을 boolean으로 강제 캐스팅
        const available = !!data?.available;
        const text = available? "유효":"불가";
        console.log(`회원 아이디${memberId}는 ${text}합니다.`)
        return available;
      })
  },
  ValidateNick: (memberNick) => {
    return BTOPAPI.get("/api/member/register/validate/nick", {params
      :{memberNick}
    })
      .then(({data}) => {
        const available = !!data?.available;
        const text = available? "유효":"불가"
        console.log(`회원 닉네임${memberNick}는w ${text}합니다.`)
        return available;
      })
  },
  ValidateEmail: (memberEmail) => {
    return BTOPAPI.get("/api/member/register/validate/email", {params:{memberEmail}})
      .then(({data}) => {
        const available = !!data?.available;
        const text = available? "유효":"불가"
        console.log(`회원 이메일${memberEmail}는w ${text}합니다.`)
        return available;
      })
  },
  Confirm: (memberInfo) => {
    return BTOPAPI.post("/api/member/register", memberInfo)
      .then((res) => {
        console.log("회원가입 성공", res);
      })
      .catch((err) => {
        console.error("에러 발생", err);
      })
  },
}
