import type { NodeData, VectorAlert } from "./mosquitonet-live-monitor";

export const KERALA_NODES = [
  ["KER-612", "Aedes aegypti", "Dengue Vector", 612, "High", "Kozhikode · Kozhikode Beach", 38, 62, "red", "ONLINE", 88, -67],
  ["KER-498", "Culex quinquefasciatus", "Southern House Mosquito", 498, "Elevated", "Thrissur · Punkunnam", 47, 57, "orange", "ONLINE", 81, -70],
  ["KER-574", "Aedes albopictus", "Asian Tiger Mosquito", 574, "High", "Alappuzha · Kuttanad", 67, 69, "red", "ONLINE", 76, -74],
  ["KER-526", "Anopheles stephensi", "Urban Malaria Mosquito", 526, "Elevated", "Kottayam · Kumarakom", 58, 64, "orange", "CALIBRATING", 64, -79],
  ["KER-451", "Culex tritaeniorhynchus", "Paddy Field Mosquito", 451, "Moderate", "Palakkad · Olavakkode", 42, 78, "cyan", "ONLINE", 93, -61],
  ["KER-603", "Aedes aegypti", "Dengue Vector", 603, "Critical", "Kannur · Thalassery", 28, 44, "red", "ONLINE", 90, -63],
].map(([id, species, commonName, freq, risk, coord, latPct, lonPct, tone, status, battery, signalDbm], index) => ({
  id: id as string,
  species: species as string,
  commonName: commonName as string,
  freq: freq as number,
  risk: risk as NodeData["risk"],
  time: `${14 - index}:2${index}:18 UTC`,
  coord: coord as string,
  confidence: 84 + index * 2.1,
  latPct: latPct as number,
  lonPct: lonPct as number,
  tone: tone as NodeData["tone"],
  status: status as NodeData["status"],
  battery: battery as number,
  signalDbm: signalDbm as number,
  firmware: "v4.2.1-KERALA",
  harmonics: [freq as number, (freq as number) * 2, (freq as number) * 3, (freq as number) * 4],
  waveformPath: "M0,35 L20,35 L35,28 L50,35 L65,18 L75,6 L85,36 L95,14 L110,35 L130,24 L150,35 L175,30 L200,35",
})) satisfies NodeData[];

export const KERALA_ALERTS = [
  ["ALT-KER-07", "11 mins ago", "Kozhikode Coastal Ward", "KER-612", "Aedes aegypti", "HIGH", "612 Hz", 274, false],
  ["ALT-KER-06", "16 mins ago", "Thrissur Municipal Cluster", "KER-498", "Culex quinquefasciatus", "ELEVATED", "498 Hz", 221, false],
  ["ALT-KER-05", "22 mins ago", "Alappuzha Backwater Belt", "KER-574", "Aedes albopictus", "HIGH", "574 Hz", 316, false],
  ["ALT-KER-04", "29 mins ago", "Kottayam Residential Cells", "KER-526", "Anopheles stephensi", "ELEVATED", "526 Hz", 187, true],
  ["ALT-KER-03", "37 mins ago", "Palakkad Paddy Corridor", "KER-451", "Culex tritaeniorhynchus", "INFO", "451 Hz", 142, true],
  ["ALT-KER-02", "43 mins ago", "Kannur Urban Perimeter", "KER-603", "Aedes aegypti", "CRITICAL", "603 Hz", 402, false],
].map(([id, timestamp, region, nodeId, species, severity, frequency, detectedCount, acknowledged]) => ({
  id: id as string,
  timestamp: timestamp as string,
  region: region as string,
  nodeId: nodeId as string,
  species: species as string,
  severity: severity as VectorAlert["severity"],
  frequency: frequency as string,
  detectedCount: detectedCount as number,
  recommendation: "Inspect standing water, increase trap coverage, and schedule a follow-up acoustic sweep.",
  acknowledged: acknowledged as boolean,
})) satisfies VectorAlert[];
