import { create } from "zustand";

export const useSchedule = create((set) => ({
  schedules: [],
  storeSchedules: (newSchedules: any) => set({ schedules: newSchedules }),
}));
