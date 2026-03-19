import {
  useInfiniteQuery,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchRooms, fetchRoomFilters, fetchRoomDetails } from "../api/room.js";

export function useRooms(filters = {}) {
  return useInfiniteQuery({
    queryKey: ["rooms", filters],
    queryFn: ({ pageParam }) => fetchRooms(filters, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useRoomFilters() {
  return useQuery({
    queryKey: ["room-filters"],
    queryFn: fetchRoomFilters,
    staleTime: 30 * 60 * 1000,
  });
}

export function useRoom(id) {
  return useQuery({
    queryKey: ["room", id],
    queryFn: () => fetchRoomDetails(id),
    staleTime: 30 * 60 * 1000,
  });
}

export async function myBookings() {
  return useInfiniteQuery({
    queryKey: ["my-bookings"],
    queryFn: ({ pageParam }) => myBookings(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
