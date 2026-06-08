import type {
  DetailPerjalanan,
  JadwalKedatangan,
  ExtractedSchedule,
  TrafficInfo,
  RainInfo,
} from "@/types/types";

const TRAFFIC_JAM_LEVEL = {
  LANCAR: "Lancar",
  RAMAI_LANCAR: "Ramai Lancar",
  MACET: "Macet",
  MACET_PARAH: "Macet Parah",
} as const;

const WEATHER_LEVEL = {
  CERAH: "Cerah / Berawan",
  RINGAN: "Hujan Ringan",
  SEDANG: "Hujan Sedang",
  LEBAT: "Hujan Lebat",
} as const;

function isTrafficJam(stmt: string): boolean {
  return (
    stmt === TRAFFIC_JAM_LEVEL.MACET || stmt === TRAFFIC_JAM_LEVEL.MACET_PARAH
  );
}

function extractTrafficInformation(details: DetailPerjalanan[]): TrafficInfo {
  const info: TrafficInfo = { condition: false, spot: "", msg: "" };

  for (const detail of details) {
    if (isTrafficJam(detail.tingkat_kemacetan)) {
      info.condition = true;
      info.spot = detail.halte_asal;
      info.msg = `Terdapat perkiraan kemacetan di titik ${detail.halte_asal}`;
      return info;
    }
  }

  info.msg = "Kondisi lalu lintas diperkirakan lancar atau ramai lancar";
  return info;
}

function weatherLevel(stmt: string): number {
  if (stmt === WEATHER_LEVEL.RINGAN) return 1;
  if (stmt === WEATHER_LEVEL.SEDANG) return 2;
  if (stmt === WEATHER_LEVEL.LEBAT) return 3;
  return 0;
}

function weatherMsgBasedOnWeather(detail: DetailPerjalanan): string {
  if (detail.kondisi_cuaca === WEATHER_LEVEL.RINGAN) {
    return `Terdapat kemungkinan hujan ringan di titik ${detail.halte_asal}.`;
  }
  if (
    detail.kondisi_cuaca === WEATHER_LEVEL.SEDANG ||
    detail.kondisi_cuaca === WEATHER_LEVEL.LEBAT
  ) {
    return `Kemungkinan hujan sedang hingga lebat dengan persentase ${detail.probabilitas_hujan_persen}% di titik ${detail.halte_asal}.`;
  }
  return "";
}

function extractRainInformation(details: DetailPerjalanan[]): RainInfo {
  const info: RainInfo = { condition: false, level: 0, pct: 0.0, msg: "" };

  for (const detail of details) {
    const wL = weatherLevel(detail.kondisi_cuaca);
    if (wL > 0) {
      info.condition = true;
      info.level = wL;
      info.pct = detail.probabilitas_hujan_persen;
      info.msg = weatherMsgBasedOnWeather(detail);
      return info;
    }
  }

  info.msg = "Cuaca cerah / berawan selama perjalanan.";
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
  data: JadwalKedatangan[],
): ExtractedSchedule[] {
  return data.map((d): ExtractedSchedule => {
    const trafficJamInfo = extractTrafficInformation(d.detail_perjalanan);
    const rainInfo = extractRainInformation(d.detail_perjalanan);

    return {
      policeNumber: d.nopol,
      timeAtStart: timeAtStartModifier(d.waktu_berangkat_di_rute),
      timeAtDepart: d.waktu_berangkat,
      timeAtArrive: d.waktu_sampai,
      originShelter: d.detail_perjalanan[0].halte_asal,
      towardShelter: d.detail_perjalanan.at(-1)!.halte_tujuan,
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
