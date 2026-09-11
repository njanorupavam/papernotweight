/** Exact home coordinates must never be exposed through public map endpoints. */
export function getPublicCoordinates(latitude: number, longitude: number) {
  return { latitude: Math.round(latitude * 100) / 100, longitude: Math.round(longitude * 100) / 100 };
}

export function getMdi(recentCatches: number, activeReporters: number, activityMultiplier = 1) {
  return Math.max(0, Math.min(100, Math.round((recentCatches / Math.max(activeReporters, 1)) * activityMultiplier * 4.2)));
}
