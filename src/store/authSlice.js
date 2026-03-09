export const createAuthSlice = (set) => ({
  auth: {
    user: null,
    token: null,
  },
  setAuth: (user, token) =>
    set((state) => {
      state.auth.user = user;
      state.auth.token = token;
    }),
  clearAuth: () =>
    set((state) => {
      state.auth.user = null;
      state.auth.token = null;
    }),
});
