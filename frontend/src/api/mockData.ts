// ── Module 4: City RPG ─────────────────────────────────────────────────────

export interface RpgStation {
  id: string;
  name: string;
}

export interface RpgDistrict {
  id: string;
  name: string;
  stations: RpgStation[];
  threshold: number;
  bonusPoints: number;
}

export const DISTRICTS: RpgDistrict[] = [
  {
    id: "xinyi",
    name: "信義探險區",
    stations: [
      { id: "xinyi-city-hall", name: "市政府" },
      { id: "xinyi-taipei-101", name: "台北101/世貿" },
      { id: "xinyi-xiangshan", name: "象山" },
      { id: "xinyi-sun-yat-sen", name: "國父紀念館" },
      { id: "xinyi-zhongxiao-dunhua", name: "忠孝敦化" },
      { id: "xinyi-zhongxiao-fuxing", name: "忠孝復興" },
    ],
    threshold: 4,
    bonusPoints: 50,
  },
  {
    id: "daan",
    name: "大安文青區",
    stations: [
      { id: "daan-daan", name: "大安" },
      { id: "daan-technology-building", name: "科技大樓" },
      { id: "daan-liuzhangli", name: "六張犁" },
      { id: "daan-xinhai", name: "辛亥" },
      { id: "daan-muzha", name: "木柵" },
      { id: "daan-dongmen", name: "東門" },
      { id: "daan-guting", name: "古亭" },
    ],
    threshold: 5,
    bonusPoints: 50,
  },
  {
    id: "zhongshan",
    name: "中山潮流區",
    stations: [
      { id: "zhongshan-zhongshan", name: "中山" },
      { id: "zhongshan-shuanglian", name: "雙連" },
      { id: "zhongshan-xingtian", name: "行天宮" },
      { id: "zhongshan-songjiang-nanjing", name: "松江南京" },
      { id: "zhongshan-nanjing-fuxing", name: "南京復興" },
    ],
    threshold: 3,
    bonusPoints: 40,
  },
  {
    id: "beitou",
    name: "北投溫泉區",
    stations: [
      { id: "beitou-beitou", name: "北投" },
      { id: "beitou-xinbeitou", name: "新北投" },
      { id: "beitou-qilian", name: "奇岩" },
      { id: "beitou-fuming", name: "復興崗" },
    ],
    threshold: 3,
    bonusPoints: 40,
  },
  {
    id: "banqiao",
    name: "板橋生活圈",
    stations: [
      { id: "banqiao-banqiao", name: "板橋" },
      { id: "banqiao-jiangzicui", name: "江子翠" },
      { id: "banqiao-xinpu", name: "新埔" },
      { id: "banqiao-tucheng", name: "土城" },
      { id: "banqiao-yongning", name: "永寧" },
    ],
    threshold: 4,
    bonusPoints: 45,
  },
  {
    id: "tamsui",
    name: "淡水漫遊區",
    stations: [
      { id: "tamsui-tamsui", name: "淡水" },
      { id: "tamsui-hongshulin", name: "紅樹林" },
      { id: "tamsui-zhuwei", name: "竹圍" },
      { id: "tamsui-danfeng", name: "淡金/鄧公" },
    ],
    threshold: 3,
    bonusPoints: 40,
  },
];

// ── Module 1 ────────────────────────────────────────────────────────────────

export type MrtLine = "wenhu" | "bannan";

export interface Destination {
  id: string;
  name: string;
  station: string;
  description: string;
  merchantCode: string;
  discountText: string;
  bonusPoints: number;
}

export const DESTINATIONS: Destination[] = [
  {
    id: "dest-001",
    name: "北投溫泉",
    station: "新北投",
    description: "享受台北最著名的天然溫泉鄉",
    merchantCode: "MERCH-BEITOU-001",
    discountText: "溫泉湯屋85折",
    bonusPoints: 100,
  },
  {
    id: "dest-002",
    name: "永康街",
    station: "東門",
    description: "品嘗最道地的台灣傳統美食街",
    merchantCode: "MERCH-YONGKANG-001",
    discountText: "鼎泰豐套餐9折",
    bonusPoints: 80,
  },
  {
    id: "dest-003",
    name: "西門町",
    station: "西門",
    description: "感受台北年輕文化的購物聖地",
    merchantCode: "MERCH-XIMEN-001",
    discountText: "指定商品8折",
    bonusPoints: 70,
  },
  {
    id: "dest-004",
    name: "淡水老街",
    station: "淡水",
    description: "漫步百年歷史的淡水河畔古街",
    merchantCode: "MERCH-TAMSUI-001",
    discountText: "老街紀念品85折",
    bonusPoints: 120,
  },
  {
    id: "dest-005",
    name: "貓空",
    station: "動物園",
    description: "搭乘纜車俯瞰台北盆地的絕美茶園",
    merchantCode: "MERCH-MAOKONG-001",
    discountText: "茶館下午茶9折",
    bonusPoints: 150,
  },
  {
    id: "dest-006",
    name: "象山步道",
    station: "象山",
    description: "征服台北最受歡迎的市區登山步道",
    merchantCode: "MERCH-XIANGSHAN-001",
    discountText: "登山補給品85折",
    bonusPoints: 90,
  },
  {
    id: "dest-007",
    name: "大稻埕",
    station: "大橋頭",
    description: "探索充滿歷史風情的傳統茶行聚落",
    merchantCode: "MERCH-DADAOCHENG-001",
    discountText: "茶葉伴手禮9折",
    bonusPoints: 110,
  },
  {
    id: "dest-008",
    name: "饒河夜市",
    station: "松山",
    description: "穿梭人潮擁擠的台北人氣觀光夜市",
    merchantCode: "MERCH-RAOHE-001",
    discountText: "夜市美食券95折",
    bonusPoints: 60,
  },
];

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
