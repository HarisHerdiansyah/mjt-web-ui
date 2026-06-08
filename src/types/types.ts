// ─── Raw API Response Types ───────────────────────────────────────────────────

export interface TripDetails {
  origin_shelter: string;
  destination_shelter: string;
  dwell_time_seconds: number;
  travel_time_seconds: number;
  average_speed_kmh: number;
  congestion_level: string;
  weather_condition: string;
  precipitation_mm: number;
  precipitation_probability_percent: number;
}

export interface ArrivalSchedules {
  license_plate: string;
  prediction_type: string;
  route_departure_time: string;
  initial_route_weather: string;
  suggested_time_at_shelter: string;
  departure_time: string;
  departure_weather: string;
  departure_precipitation_mm: number;
  departure_precipitation_probability: number;
  remaining_time_seconds: number;
  arrival_time: string;
  arrival_weather: string;
  arrival_precipitation_mm: number;
  arrival_precipitation_probability: number;
  total_travel_duration_seconds: number;
  trip_details: TripDetails[];
}

export interface OperationalInfo {
  day_name: string;
  day_of_week: number;
  is_holiday: boolean;
  operation_start_time: string;
  operation_end_time: string;
  total_active_fleets: number;
  remarks: string;
}

export interface CorridorResponse {
  corridor: string;
  destination_direction: string;
  operational_info: OperationalInfo;
  arrival_schedules: ArrivalSchedules[];
}

/** Root type — the API returns an array of CorridorResponse */
export type ApiResponse = CorridorResponse[];

// ─── Extracted / Mapped Types ─────────────────────────────────────────────────

export interface TrafficInfo {
  condition: boolean;
  spot: string;
  msg: string;
}

export interface RainInfo {
  condition: boolean;
  level: number;
  pct: number;
  msg: string;
}

export interface ExtractedSchedule {
  policeNumber: string;
  timeAtStart: string;
  timeAtDepart: string;
  timeAtArrive: string;
  originShelter: string;
  towardShelter: string;
  trafficJam: boolean;
  trafficJamSpot: string;
  trafficJamMsg: string;
  rain: boolean;
  rainLevel: number;
  rainPct: number;
  weatherMsg: string;
}

// ─── Route & Shelter API Types ────────────────────────────────────────────────

export interface ShelterItem {
  shelter: string;
  lat: number;
  long: number;
}

export interface RouteItem {
  id: string;
  name: string;
}

export interface RawShelterEntry {
  sequence: number;
  shelter_name: string;
  latitude: number;
  longitude: number;
}

export interface RawRouteEntry {
  route_id: string;
  destination_direction: string;
  shelters: RawShelterEntry[];
}

export type ShelterMap = Record<string, ShelterItem[]>;

export interface RouteAndShelterData {
  routes: RouteItem[];
  shelters: ShelterMap;
}

// ─── Schedule Payload ─────────────────────────────────────────────────────────

export interface SchedulePayload {
  prediction_mode: string;
  shelter_name: string | null;
  destination_shelter: string | null;
  target_datetime: string;
}
