import type {
  TripDetails,
  ArrivalSchedules,
  ExtractedSchedule,
  TrafficInfo,
  RainInfo,
} from "@/types/types";

const TRAFFIC_JAM_LEVEL = {
  LANCAR: "Smooth",
  RAMAI_LANCAR: "Moderate Traffic",
  MACET: "Congested",
  MACET_PARAH: "Severe Congestion",
} as const;

const WEATHER_LEVEL = {
  CERAH: "Clear / Cloudy",
  RINGAN: "Light Rain",
  SEDANG: "Moderate Rain",
  LEBAT: "Heavy Rain",
} as const;

function isTrafficJam(stmt: string): boolean {
  return (
    stmt === TRAFFIC_JAM_LEVEL.MACET || stmt === TRAFFIC_JAM_LEVEL.MACET_PARAH
  );
}

function extractTrafficInformation(details: TripDetails[]): TrafficInfo {
  const info: TrafficInfo = { condition: false, spot: "", msg: "" };

  for (const detail of details) {
    if (isTrafficJam(detail.congestion_level)) {
      info.condition = true;
      info.spot = detail.origin_shelter;
      info.msg = `There is traffic congestion expected at ${detail.origin_shelter}`;
      return info;
    }
  }

  info.msg = "Traffic conditions are expected to be smooth or moderate";
  return info;
}

function weatherLevel(stmt: string): number {
  if (stmt === WEATHER_LEVEL.RINGAN) return 1;
  if (stmt === WEATHER_LEVEL.SEDANG) return 2;
  if (stmt === WEATHER_LEVEL.LEBAT) return 3;
  return 0;
}

function weatherMsgBasedOnWeather(detail: TripDetails): string {
  if (detail.weather_condition === WEATHER_LEVEL.RINGAN) {
    return `There is a chance of light rain at ${detail.origin_shelter}.`;
  }
  if (
    detail.weather_condition === WEATHER_LEVEL.SEDANG ||
    detail.weather_condition === WEATHER_LEVEL.LEBAT
  ) {
    return `There is a chance of moderate to heavy rain with a percentage of ${detail.precipitation_probability_percent}% at ${detail.origin_shelter}.`;
  }
  return "";
}

function extractRainInformation(details: TripDetails[]): RainInfo {
  const info: RainInfo = { condition: false, level: 0, pct: 0.0, msg: "" };

  for (const detail of details) {
    const wL = weatherLevel(detail.weather_condition);
    if (wL > 0) {
      info.condition = true;
      info.level = wL;
      info.pct = detail.precipitation_probability_percent;
      info.msg = weatherMsgBasedOnWeather(detail);
      return info;
    }
  }

  info.msg =
    "Weather conditions are expected to be clear / cloudy during the trip";
  return info;
}

function timeAtStartModifier(timeAtDepart: string) {
  const [hours, minutes, seconds] = timeAtDepart.split(":").map(Number);
  const dateObj = new Date();
  dateObj.setHours(hours, minutes, seconds, 0);

  dateObj.setMinutes(dateObj.getMinutes() - 15);
  const finalHours = String(dateObj.getHours()).padStart(2, "0");
  const finalMinutes = String(dateObj.getMinutes()).padStart(2, "0");
  const finalSeconds = String(dateObj.getSeconds()).padStart(2, "0");
  return `${finalHours}:${finalMinutes}:${finalSeconds}`;
}

export default function responseExtractor(
  data: ArrivalSchedules[],
): ExtractedSchedule[] {
  return data.map((d): ExtractedSchedule => {
    const trafficJamInfo = extractTrafficInformation(d.trip_details);
    const rainInfo = extractRainInformation(d.trip_details);

    return {
      policeNumber: d.license_plate,
      timeAtStart: timeAtStartModifier(d.route_departure_time),
      timeAtDepart: d.departure_time,
      timeAtArrive: d.arrival_time,
      originShelter: d.trip_details[0].origin_shelter,
      towardShelter: d.trip_details.at(-1)!.destination_shelter,
      trafficJam: trafficJamInfo.condition,
      trafficJamSpot: trafficJamInfo.spot,
      trafficJamMsg: trafficJamInfo.msg,
      rain: rainInfo.condition,
      rainLevel: rainInfo.level,
      rainPct: rainInfo.pct,
      weatherMsg: rainInfo.msg,
    };
  });
}
