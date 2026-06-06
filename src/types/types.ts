// ─── Raw API Response Types ───────────────────────────────────────────────────

export interface DetailPerjalanan {
  halte_asal: string;
  halte_tujuan: string;
  waktu_ngetem_detik: number;
  waktu_tempuh_detik: number;
  kecepatan_rata_rata_kmh: number;
  tingkat_kemacetan: string;
  kondisi_cuaca: string;
  curah_hujan_mm: number;
  probabilitas_hujan_persen: number;
}

export interface JadwalKedatangan {
  nopol: string;
  tipe_prediksi: string;
  waktu_berangkat_di_rute: string;
  cuaca_awal_rute: string;
  waktu_berangkat: string;
  cuaca_saat_berangkat: string;
  curah_hujan_berangkat_mm: number;
  probabilitas_hujan_berangkat: number;
  sisa_waktu_detik: number;
  waktu_sampai: string;
  cuaca_saat_sampai: string;
  curah_hujan_sampai_mm: number;
  probabilitas_hujan_sampai: number;
  durasi_perjalanan_detik: number;
  detail_perjalanan: DetailPerjalanan[];
}

export interface InformasiOperasional {
  nama_hari: string;
  hari_ke: number;
  is_holiday: boolean;
  jam_mulai_operasi: string;
  jam_akhir_operasi: string;
  total_armada_aktif: number;
  keterangan: string;
}

export interface KoridorResponse {
  koridor: string;
  arah_tujuan: string;
  informasi_operasional: InformasiOperasional;
  jadwal_kedatangan: JadwalKedatangan[];
}

/** Root type — the API returns an array of KoridorResponse */
export type ApiResponse = KoridorResponse[];

// ─── Extracted / Mapped Types ─────────────────────────────────────────────────

export interface TrafficInfo {
  condition: boolean;
  spot: string;
  msg: string;
}

export interface RainInfo {
  condition: boolean;
  level: string;
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
  rainLevel: string;
  rainPct: number;
  weatherMsg: string;
}
