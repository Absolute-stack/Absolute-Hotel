import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createAuthSlice } from "./authSlice.js";

export const useStore = create(
  persist(
    immer((set, get) => ({
      ...createAuthSlice(set),
    })),
  ),
);
