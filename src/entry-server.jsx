import App from "./App.jsx";
import { StrictMode } from "react";
import { makeQueryClient } from "./lib/queryClient";
import { StaticRouter } from "react-router-dom/server";
import { QueryClientProvider, dehydrate } from "@tanstack/react-query";

export async function render(url) {
  const queryClient = makeQueryClient();
  const dehydratedState = dehydrate(queryClient);

  const tree = (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    </StrictMode>
  );

  return { tree, dehydratedState };
}
