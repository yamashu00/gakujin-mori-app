const API_URL = import.meta.env.VITE_SHEETS_API_URL || '';

export const hasSharedBackend = Boolean(API_URL);

// Google Apps Script Web Appはtext/plainで送るとCORSのpreflightを回避できる。
export async function pushDiscovery(discovery) {
  if (!API_URL) return { ok: false, error: 'no-backend' };
  const { photo, isDemo, ...rest } = discovery;
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(rest),
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function fetchSharedDiscoveries() {
  if (!API_URL) return [];
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return (data.discoveries || []).map((d) => ({
      ...d,
      height: d.height === '' || d.height == null ? null : Number(d.height),
      lat: d.lat === '' || d.lat == null ? null : Number(d.lat),
      lng: d.lng === '' || d.lng == null ? null : Number(d.lng),
      distance: Number(d.distance),
      angle: Number(d.angle),
      eyeHeight: Number(d.eyeHeight),
    }));
  } catch (e) {
    return [];
  }
}
