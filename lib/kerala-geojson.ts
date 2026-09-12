// Detailed Kerala state boundary GeoJSON polygon for tactical radar overlay
export interface GeoFeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: Record<string, any>;
    geometry: {
      type: "Polygon" | "MultiPolygon";
      coordinates: number[][][] | number[][][][];
    };
  }>;
}

export const KERALA_GEOJSON: GeoFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Kerala",
        code: "KL",
        type: "State",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [74.88, 12.79],
            [75.05, 12.65],
            [75.18, 12.52],
            [75.32, 12.44],
            [75.45, 12.28],
            [75.58, 12.05],
            [75.75, 12.08],
            [75.92, 11.95],
            [76.12, 11.98],
            [76.28, 11.82],
            [76.45, 11.62],
            [76.62, 11.45],
            [76.78, 11.25],
            [76.85, 11.05],
            [76.92, 10.88],
            [76.88, 10.72],
            [76.98, 10.58],
            [77.12, 10.42],
            [77.25, 10.22],
            [77.38, 9.98],
            [77.28, 9.75],
            [77.35, 9.55],
            [77.22, 9.35],
            [77.28, 9.15],
            [77.25, 8.85],
            [77.35, 8.65],
            [77.42, 8.42],
            [77.52, 8.28],
            [77.48, 8.12],
            [77.32, 8.28],
            [77.15, 8.42],
            [76.95, 8.52],
            [76.78, 8.72],
            [76.62, 8.92],
            [76.48, 9.18],
            [76.32, 9.48],
            [76.22, 9.85],
            [76.15, 10.15],
            [75.98, 10.45],
            [75.82, 10.75],
            [75.68, 11.12],
            [75.52, 11.45],
            [75.32, 11.75],
            [75.12, 12.15],
            [74.95, 12.48],
            [74.88, 12.79],
          ],
        ],
      },
    },
  ],
};

export interface MapMarkerPoint {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  status: "critical" | "high" | "moderate" | "available";
  count: number;
  reporters: number;
  mdi: number;
  lastReport: string;
}

export const LIVE_MAP_POINTS: MapMarkerPoint[] = [
  { id: "kochi", name: "Kochi", district: "Ernakulam", lat: 9.9312, lng: 76.2673, status: "critical", count: 486, reporters: 72, mdi: 84, lastReport: "1m ago" },
  { id: "tvpm", name: "Thiruvananthapuram", district: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, status: "high", count: 291, reporters: 63, mdi: 67, lastReport: "2m ago" },
  { id: "kozhikode", name: "Kozhikode", district: "Kozhikode", lat: 11.2588, lng: 75.7804, status: "moderate", count: 166, reporters: 42, mdi: 39, lastReport: "4m ago" },
  { id: "thrissur", name: "Thrissur", district: "Thrissur", lat: 10.5276, lng: 76.2144, status: "high", count: 215, reporters: 54, mdi: 62, lastReport: "3m ago" },
  { id: "kollam", name: "Kollam", district: "Kollam", lat: 8.8932, lng: 76.6141, status: "moderate", count: 138, reporters: 34, mdi: 38, lastReport: "5m ago" },
  { id: "alappuzha", name: "Alappuzha", district: "Alappuzha", lat: 9.4981, lng: 76.3388, status: "critical", count: 320, reporters: 58, mdi: 79, lastReport: "1m ago" },
  { id: "kottayam", name: "Kottayam", district: "Kottayam", lat: 9.5916, lng: 76.5222, status: "available", count: 94, reporters: 26, mdi: 28, lastReport: "7m ago" },
  { id: "palakkad", name: "Palakkad", district: "Palakkad", lat: 10.7867, lng: 76.6548, status: "moderate", count: 152, reporters: 39, mdi: 41, lastReport: "6m ago" },
  { id: "malappuram", name: "Malappuram", district: "Malappuram", lat: 11.0732, lng: 76.074, status: "available", count: 88, reporters: 22, mdi: 24, lastReport: "9m ago" },
  { id: "kannur", name: "Kannur", district: "Kannur", lat: 11.8745, lng: 75.3704, status: "available", count: 112, reporters: 31, mdi: 32, lastReport: "8m ago" },
  { id: "kasaragod", name: "Kasaragod", district: "Kasaragod", lat: 12.5102, lng: 74.9852, status: "available", count: 76, reporters: 19, mdi: 22, lastReport: "12m ago" },
  { id: "wayanad", name: "Wayanad (Kalpetta)", district: "Wayanad", lat: 11.6103, lng: 76.0827, status: "available", count: 64, reporters: 16, mdi: 18, lastReport: "14m ago" },
  { id: "idukki", name: "Idukki (Painavu)", district: "Idukki", lat: 9.8494, lng: 76.9806, status: "available", count: 52, reporters: 14, mdi: 15, lastReport: "18m ago" },
  { id: "pathanamthitta", name: "Pathanamthitta", district: "Pathanamthitta", lat: 9.2648, lng: 76.787, status: "moderate", count: 104, reporters: 28, mdi: 34, lastReport: "10m ago" },
  // Local active clusters
  { id: "koonammavu", name: "Koonammavu", district: "Ernakulam", lat: 10.112, lng: 76.248, status: "critical", count: 84, reporters: 18, mdi: 82, lastReport: "2m ago" },
  { id: "erumpatty", name: "Erumapetty", district: "Thrissur", lat: 10.668, lng: 76.192, status: "available", count: 32, reporters: 9, mdi: 20, lastReport: "3m ago" },
  { id: "puthenvelikkara", name: "Puthenvelikkara", district: "Ernakulam", lat: 10.185, lng: 76.216, status: "available", count: 41, reporters: 12, mdi: 25, lastReport: "5m ago" },
  { id: "kattakada", name: "Kattakada", district: "Thiruvananthapuram", lat: 8.508, lng: 77.081, status: "critical", count: 96, reporters: 21, mdi: 86, lastReport: "6m ago" },
  { id: "nellikkunnam", name: "Nellikkunnam", district: "Kollam", lat: 9.012, lng: 76.745, status: "available", count: 29, reporters: 8, mdi: 19, lastReport: "9m ago" },
  { id: "bengaluru", name: "Bengaluru", district: "Karnataka", lat: 12.9716, lng: 77.5946, status: "moderate", count: 188, reporters: 51, mdi: 43, lastReport: "4m ago" },
];
