// authSlice.js
import { setAuthToken, clearAuthToken } from "../lib/axios.js";

export const createAuthSlice = (set) => ({
  auth: { user: null, token: null },
  setAuth: (user, token) => {
    setAuthToken(token); // ← always sync window.__AUTH_TOKEN__
    set((state) => {
      state.auth.user = user;
      state.auth.token = token;
    });
  },
  clearAuth: () => {
    clearAuthToken(); // ← clear on logout
    set((state) => {
      state.auth.user = null;
      state.auth.token = null;
    });
  },
});
