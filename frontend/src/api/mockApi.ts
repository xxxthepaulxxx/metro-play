import { DESTINATIONS, type Destination, getOffPeakWindow, getRidershipData } from "./mockData";

export interface CommitmentResponse {
  pledgeId: string;
  offPeakWindow: {
    start: string;
    end: string;
    label: string;
  };
  balance: number;
  deadline: string;
}

export interface PredictionResponse {
  predictionId: string;
  referenceRidership: {
    yesterday: number;
    forecast: number;
  };
}

export interface VerificationResponse {
  verified: boolean;
  onTime: boolean;
  entryTime: string;
  offPeakWindow: {
    start: string;
    end: string;
  };
  outcome: "success" | "forfeit";
}

export interface SettlementResponse {
  settlementId: string;
  gameA: {
    outcome: "success" | "forfeit" | "skipped";
    reward: number;
  };
  gameB: {
    outcome: "correct" | "wrong" | "skipped";
    reward: number;
    actualRidership: number | null;
  };
  combo: boolean;
  totalReward: number;
  newBalance: number;
  carbonFundDelta: number;
  badge: string | null;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchOffPeakWindow(line: "wenhu" | "bannan"): Promise<CommitmentResponse> {
  await delay(500);
  const window = getOffPeakWindow(line);
  const pledgeId = crypto.randomUUID();
  const deadline = new Date(`2026-08-12T${window.start}:00Z`).toISOString();
  return {
    pledgeId,
    offPeakWindow: {
      start: window.start,
      end: window.end,
      label: window.label,
    },
    balance: 1000,
    deadline,
  };
}

export async function fetchRidershipForecast(
  line: "wenhu" | "bannan"
): Promise<PredictionResponse> {
  await delay(400);
  const data = getRidershipData(line);
  const peakHourCount = data.hourly[data.peakHour];
  const yesterday = peakHourCount !== undefined ? peakHourCount : 800;
  const forecast = Math.floor(yesterday * 0.95);
  return {
    predictionId: crypto.randomUUID(),
    referenceRidership: {
      yesterday,
      forecast,
    },
  };
}

export async function submitPledge(
  _stakePoints: number,
  _line: "wenhu" | "bannan"
): Promise<CommitmentResponse> {
  await delay(300);
  const window = getOffPeakWindow(_line);
  const pledgeId = crypto.randomUUID();
  const deadline = new Date(`2026-08-12T${window.start}:00Z`).toISOString();
  return {
    pledgeId,
    offPeakWindow: {
      start: window.start,
      end: window.end,
      label: window.label,
    },
    balance: 1000 - _stakePoints,
    deadline,
  };
}

export async function submitPrediction(
  _line: "wenhu" | "bannan",
  _range: { min: number; max: number }
): Promise<PredictionResponse> {
  await delay(300);
  const data = getRidershipData(_line);
  const peakHourCount = data.hourly[data.peakHour];
  const yesterday = peakHourCount !== undefined ? peakHourCount : 800;
  const forecast = Math.floor(yesterday * 0.95);
  return {
    predictionId: crypto.randomUUID(),
    referenceRidership: {
      yesterday,
      forecast,
    },
  };
}

export async function verifyGateTap(
  _pledgeId: string,
  entryTimestamp: string
): Promise<VerificationResponse> {
  await delay(800);
  const window = getOffPeakWindow("wenhu");

  // Extract HH:MM from the entry timestamp
  const date = new Date(entryTimestamp);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const entryTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  // Happy path: always succeed for demo
  return {
    verified: true,
    onTime: true,
    entryTime,
    offPeakWindow: {
      start: window.start,
      end: window.end,
    },
    outcome: "success",
  };
}

// ── Module 2: Blind Box Travel ─────────────────────────────────────────────

export interface PurchaseBoxResponse {
  boxId: string;
  destination: Destination;
}

export interface RerollBoxResponse {
  destination: Destination;
}

export interface ScanStationResponse {
  verified: boolean;
}

export interface ScanMerchantResponse {
  verified: boolean;
  discountText: string;
  bonusPoints: number;
}

export async function purchaseBox(_cost: number): Promise<PurchaseBoxResponse> {
  await delay(400);
  const dest = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)] as Destination;
  return {
    boxId: crypto.randomUUID(),
    destination: { ...dest },
  };
}

export async function rerollBox(_boxId: string, _cost: number): Promise<RerollBoxResponse> {
  await delay(300);
  const dest = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)] as Destination;
  return { destination: { ...dest } };
}

export async function scanStation(
  _boxId: string,
  _stationId: string
): Promise<ScanStationResponse> {
  await delay(600);
  return { verified: true };
}

export async function scanMerchant(
  _boxId: string,
  merchantCode: string
): Promise<ScanMerchantResponse> {
  await delay(600);
  const dest = DESTINATIONS.find((d) => d.merchantCode === merchantCode);
  return {
    verified: true,
    discountText: dest?.discountText ?? "特別優惠",
    bonusPoints: dest?.bonusPoints ?? 80,
  };
}

// ── Module 1: Settlement ───────────────────────────────────────────────────

export async function settleGame(
  _pledgeId: string,
  predictionId?: string
): Promise<SettlementResponse> {
  await delay(300);
  const mockStake = 50;
  const gameAReward = mockStake * 3;
  const gameBOutcome: "correct" | "wrong" | "skipped" = predictionId ? "correct" : "skipped";
  const gameBReward = predictionId ? 75 : 0;
  const combo = gameBOutcome === "correct";
  const totalReward = gameAReward + gameBReward + (combo ? 25 : 0);

  return {
    settlementId: crypto.randomUUID(),
    gameA: {
      outcome: "success",
      reward: gameAReward,
    },
    gameB: {
      outcome: gameBOutcome,
      reward: gameBReward,
      actualRidership: predictionId ? 520 : null,
    },
    combo,
    totalReward,
    newBalance: 1000 + totalReward,
    carbonFundDelta: 50,
    badge: combo ? "Off-Peak Master" : null,
  };
}
