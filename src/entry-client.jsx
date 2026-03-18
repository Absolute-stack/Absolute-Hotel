import App from "./App.jsx";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { hydrateRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { setAuthToken } from "./lib/axios.js";
import { getQueryClient } from "./lib/queryClient.js";

const queryClient = getQueryClient();

async function initAuth() {
  try {
    const { refresh, getMe } = await import("./api/auth.js");
    const { useStore } = await import("./store/store.js");

    const { accessToken } = await refresh();
    setAuthToken(accessToken);

    const { user } = await getMe();
    useStore.getState().setAuth(user, accessToken);
  } catch {
    // Guest user — app loads normally
  }
}

initAuth().finally(() => {
  hydrateRoot(
    document.getElementById("root"),
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
});
