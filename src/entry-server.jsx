import App from "./App.jsx";
import { StrictMode } from "react";
import { makeQueryClient } from "./lib/queryClient";
import { StaticRouter } from "react-router-dom/server";
import {
  QueryClientProvider,
  dehydrate,
  usePrefetchInfiniteQuery,
} from "@tanstack/react-query";
import { fetchRoomDetails, fetchRoomFilters, fetchRooms } from "./api/room.js";

export async function render(url) {
  const queryClient = makeQueryClient();

  const pathname = url.split("?")?.[0];
  const homePage = pathname === "/";
  const roomsPage = pathname === "/rooms";
  const roomDetailPage = pathname.startsWith("/room-details/");

  if (homePage || roomsPage) {
    await Promise.all([
      queryClient.prefetchInfiniteQuery({
        queryKey: ["rooms", {}],
        queryFn: ({ pageParam }) => fetchRooms({}, pageParam),
        initialPageParam: null,
      }),

      queryClient.prefetchQuery({
        queryKey: ["room-filters"],
        queryFn: fetchRoomFilters,
        staleTime: 30 * 60 * 1000,
      }),
    ]);
  }

  if (roomDetailPage) {
    const productId = pathname.split("/room-details/")?.[1];

    await queryClient.prefetchQuery({
      queryKey: ["room", productId],
      queryFn: () => fetchRoomDetails(productId),
      staleTime: 30 * 60 * 1000,
    });
  }

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
