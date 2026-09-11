export type MosquitoRisk = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type MosquitoReport = {
  capacity: number;
  occupancy: number;
  suitabilityScore: number;
  riskLevel: MosquitoRisk;
  metrics: {
    darkCornerAvailability: number;
    humidityCompatibility: number;
    bloodSourceAccessibility: number;
    fanThreatLevel: number;
    hidingSpotDensity: number;
    windowEntryPotential: number;
  };
};

function hashSeed(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return () => {
    hash += 0x6d2b79f5;
    let t = hash;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function hashImage(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let hash = 2166136261;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }
  return `${file.name}-${file.size}-${file.type}-${hash >>> 0}`;
}

export function calculateMosquitoCapacity(imageData: { hash: string; width: number; height: number; size: number }): MosquitoReport {
  const rand = hashSeed(`${imageData.hash}:${imageData.width}:${imageData.height}:${imageData.size}`);
  const metric = () => Math.round(42 + rand() * 55);
  const metrics = {
    darkCornerAvailability: metric(),
    humidityCompatibility: metric(),
    bloodSourceAccessibility: metric(),
    fanThreatLevel: Math.round(18 + rand() * 70),
    hidingSpotDensity: metric(),
    windowEntryPotential: metric(),
  };
  const base = (metrics.darkCornerAvailability + metrics.humidityCompatibility + metrics.bloodSourceAccessibility + metrics.hidingSpotDensity + metrics.windowEntryPotential) / 5;
  const aspectPenalty = Math.min(18, Math.abs(imageData.width / Math.max(imageData.height, 1) - 1.55) * 9);
  const suitabilityScore = Math.max(8, Math.min(99, Math.round(base - aspectPenalty + (rand() * 10 - 5))));
  const capacity = Math.max(9, Math.round(16 + suitabilityScore * 0.7 + rand() * 25));
  const occupancy = Math.max(1, Math.min(capacity, Math.round(capacity * (0.09 + rand() * 0.25))));
  const riskLevel: MosquitoRisk = suitabilityScore >= 82 ? "CRITICAL" : suitabilityScore >= 64 ? "HIGH" : suitabilityScore >= 42 ? "MODERATE" : "LOW";
  return { capacity, occupancy, suitabilityScore, riskLevel, metrics };
}
