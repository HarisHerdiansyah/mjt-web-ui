import type { ExtractedSchedule } from "@/types/types";
import { create } from "zustand";

type ScheduleState = {
  schedules: ExtractedSchedule[];
  storeSchedules: (newSchedules: ExtractedSchedule[]) => void;
};

export const useSchedule = create<ScheduleState>((set) => ({
  schedules: [],
  storeSchedules: (newSchedules) => set({ schedules: newSchedules }),
}));
