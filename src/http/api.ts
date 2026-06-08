import axios from "axios";
import type { SchedulePayload } from "@/types/types";

// const BASE_URL = "http://139.59.249.159:8000/api";
// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
// });

export async function getRouteAndShelter() {
  try {
    const response = await axios.get("/api/shelters/K5");
    if (response.status !== 200) {
      throw new Error("Failed to fetch shelters");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching shelters:", error);
    throw error;
  }
}

export async function getSchedule(payload: SchedulePayload) {
  try {
    const response = await axios.post("/api/schedule", payload);
    if (response.status !== 200) {
      throw new Error("Failed to fetch schedule");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching schedule:", error);
    throw error;
  }
}
