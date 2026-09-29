// 岳人の森キャンプ場（徳島県名西郡神山町、OpenStreetMapでジオコーディング確認済み）
const REAL_FIELD_CENTER = { lat: 33.9255613, lng: 134.2715186 };

// VITE_FIELD_LAT / VITE_FIELD_LNG が設定されていればそちらを優先する。
// 現地に行かずに神山まるごと高専周辺でテストする場合などに、
// Vercelの別プロジェクト（環境変数）や `.env.local` で上書きする想定。
const envLat = Number(import.meta.env.VITE_FIELD_LAT);
const envLng = Number(import.meta.env.VITE_FIELD_LNG);
export const FIELD_CENTER =
  Number.isFinite(envLat) && Number.isFinite(envLng)
    ? { lat: envLat, lng: envLng }
    : REAL_FIELD_CENTER;

const offset = (dLat, dLng) => ({
  lat: FIELD_CENTER.lat + dLat,
  lng: FIELD_CENTER.lng + dLng,
});

// MAPが寂しくならないようにするための「見本」データ。
// isDemo: true を付けて実データと区別する。MAP画面のトグルでON/OFFできる。
export const demoDiscoveries = [
  {
    id: 'demo_1',
    isDemo: true,
    team: 'DEMO',
    createdAt: Date.now(),
    name: '入口近くの大きな杉',
    category: '木',
    photo: null,
    ...offset(0.0012, 0.0009),
    gpsAccuracy: 8,
    distance: 12.5,
    angle: 42,
    eyeHeight: 1.55,
    unlockedAtCalc: true,
    height: 12.5 * Math.tan((42 * Math.PI) / 180) + 1.55,
    notes: '思ったより高かった。',
  },
  {
    id: 'demo_2',
    isDemo: true,
    team: 'DEMO',
    createdAt: Date.now(),
    name: '一番急だった坂',
    category: '斜面',
    photo: null,
    ...offset(-0.0008, 0.0015),
    gpsAccuracy: 10,
    distance: 20,
    angle: 22,
    eyeHeight: 1.55,
    unlockedAtCalc: true,
    height: null,
    notes: '斜面は距離の測り方が難しかった。',
  },
  {
    id: 'demo_3',
    isDemo: true,
    team: 'DEMO',
    createdAt: Date.now(),
    name: '食堂前の木',
    category: '木',
    photo: null,
    ...offset(0.0005, -0.0011),
    gpsAccuracy: 6,
    distance: 8.2,
    angle: 51,
    eyeHeight: 1.6,
    unlockedAtCalc: true,
    height: 8.2 * Math.tan((51 * Math.PI) / 180) + 1.6,
    notes: '',
  },
];
