export type MrtLine = "wenhu" | "bannan";

export interface OffPeakWindow {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  label: string;
  confidence: number; // 0-1
}

export interface RidershipData {
  date: string; // YYYY-MM-DD
  line: MrtLine;
  hourly: number[]; // 24 values
  peakHour: number;
  offPeakThreshold: number;
}

const TODAY = "2026-08-12";

// Wenhu line: peaks at hour 8 (800), midday ~550-650, second peak 17-18 (~700)
const WENHU_HOURLY: number[] = [
  150, // 00
  120, // 01
  100, // 02
  80, // 03
  90, // 04
  200, // 05
  450, // 06
  650, // 07
  800, // 08 — peak
  750, // 09
  680, // 10
  630, // 11
  580, // 12
  560, // 13
  540, // 14
  520, // 15
  500, // 16
  700, // 17
  720, // 18
  600, // 19
  400, // 20
  300, // 21
  220, // 22
  160, // 23
];

// Bannan line: peaks at hour 8 (900), midday ~600-700
const BANNAN_HOURLY: number[] = [
  160, // 00
  130, // 01
  110, // 02
  90, // 03
  100, // 04
  220, // 05
  480, // 06
  700, // 07
  900, // 08 — peak
  840, // 09
  760, // 10
  700, // 11
  660, // 12
  630, // 13
  600, // 14
  580, // 15
  560, // 16
  750, // 17
  780, // 18
  640, // 19
  440, // 20
  320, // 21
  240, // 22
  180, // 23
];

const WENHU_PEAK_HOUR = 8;
const BANNAN_PEAK_HOUR = 8;

function computeOffPeakThreshold(hourly: number[], peakHour: number): number {
  const peakValue = hourly[peakHour];
  if (peakValue === undefined) {
    throw new Error(`Invalid peakHour index: ${peakHour}`);
  }
  return Math.floor(peakValue * 0.7);
}

export function getRidershipData(lineId: MrtLine): RidershipData {
  if (lineId === "wenhu") {
    const peakHour = WENHU_PEAK_HOUR;
    const offPeakThreshold = computeOffPeakThreshold(WENHU_HOURLY, peakHour);
    return {
      date: TODAY,
      line: "wenhu",
      hourly: [...WENHU_HOURLY],
      peakHour,
      offPeakThreshold,
    };
  }

  const peakHour = BANNAN_PEAK_HOUR;
  const offPeakThreshold = computeOffPeakThreshold(BANNAN_HOURLY, peakHour);
  return {
    date: TODAY,
    line: "bannan",
    hourly: [...BANNAN_HOURLY],
    peakHour,
    offPeakThreshold,
  };
}

function hourToHHMM(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

/**
 * Returns the first contiguous off-peak block starting after 6am.
 * Off-peak = hours where hourly[h] < offPeakThreshold.
 */
export function getOffPeakWindow(lineId: MrtLine): OffPeakWindow {
  const data = getRidershipData(lineId);
  const { hourly, offPeakThreshold } = data;

  let blockStart: number | null = null;
  let blockEnd: number | null = null;

  for (let h = 7; h < 24; h++) {
    const count = hourly[h];
    if (count === undefined) continue;
    if (count < offPeakThreshold) {
      if (blockStart === null) {
        blockStart = h;
      }
      blockEnd = h;
    } else {
      if (blockStart !== null) {
        break;
      }
    }
  }

  // Fallback: use midday window if no block found
  if (blockStart === null || blockEnd === null) {
    return {
      start: "10:00",
      end: "16:00",
      label: "Midday Off-Peak",
      confidence: 0.8,
    };
  }

  return {
    start: hourToHHMM(blockStart),
    end: hourToHHMM(blockEnd + 1),
    label: "Morning Off-Peak",
    confidence: 0.9,
  };
}
