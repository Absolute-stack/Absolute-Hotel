import App from "./App.jsx";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { hydrateRoot } from "react-dom/client";
import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { setAuthToken } from "./lib/axios.js";
import { getQueryClient } from "./lib/queryClient.js";

const queryClient = getQueryClient();
const dehydratedState = window.__REACT_QUERY_STATE__;

async function initAuth() {
  try {
    // Rehydrate token from persisted zustand state first
    const { useStore } = await import("./store/store.js");
    const persistedToken = useStore.getState().auth.token;
    if (persistedToken) setAuthToken(persistedToken); // ← restore immediately

    const { refresh, getMe } = await import("./api/auth.js");
    const { accessToken } = await refresh();
    setAuthToken(accessToken);
    const { user } = await getMe();
    useStore.getState().setAuth(user, accessToken);
  } catch {
    // Guest user
  }
}

initAuth().finally(() => {
  hydrateRoot(
    document.getElementById("root"),
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HydrationBoundary>
      </QueryClientProvider>
    </StrictMode>,
  );
});
