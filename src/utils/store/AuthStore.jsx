// src/store/auth.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      userInfo: null, // { token, memberNo, roleNumber, expires(ms) }

      // 서버 DTO 그대로 주입 (권장)
      setSession: ({ token, memberNo, roleNumber, expires }) =>
        set({ userInfo: { token, memberNo, roleNumber, expires } }),

      logout: () => {
        set({ userInfo: null });
        useAuthStore.persist.clearStorage(); // persist 데이터 제거
      },

      // 헬퍼
      isExpired: () => {
        const exp = get().userInfo?.expires;
        return !!exp && Date.now() >= exp;
      },
      getAuthHeader: () => {
        const t = get().userInfo?.token;
        return t ? { Authorization: `Bearer ${t}` } : {};
      },
    }),
    {
      name: 'btop-app',
      storage: createJSONStorage(() => sessionStorage), // 새로고침 유지, 브라우저 종료 시 해제
      partialize: (state) => ({ userInfo: state.userInfo }),
      onRehydrateStorage: () => (state) => {
        const exp = state?.userInfo?.expires;
        if (exp && Date.now() >= exp) state?.logout?.();
      },
    }
  )
);
