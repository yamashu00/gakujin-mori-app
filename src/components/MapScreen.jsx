import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FIELD_CENTER } from '../demoData.js';

const CATEGORY_ICON = { 木: '🌲', 植物: '🌿', 建物: '🏠', 斜面: '⛰️', 岩: '🪨', その他: '❓' };

function markerIcon(category, isDemo) {
  return L.divIcon({
    html: `<div style="font-size:22px; filter:${isDemo ? 'grayscale(40%) opacity(0.75)' : 'none'}">${CATEGORY_ICON[category] || '📍'}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 24],
    popupAnchor: [0, -22],
  });
}

export default function MapScreen({ discoveries, showDemo, onToggleDemo }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([FIELD_CENTER.lat, FIELD_CENTER.lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    const withCoords = discoveries.filter((d) => d.lat != null && d.lng != null);
    withCoords.forEach((d) => {
      const marker = L.marker([d.lat, d.lng], { icon: markerIcon(d.category, d.isDemo) });
      const heightText = d.height != null ? `${d.height.toFixed(1)}m` : '計算前';
      marker.bindPopup(`
        <div style="max-width:180px">
          ${d.photo ? `<img src="${d.photo}" style="width:100%;border-radius:6px;margin-bottom:6px" />` : ''}
          <b>${d.name}</b>${d.isDemo ? ' <span style="color:#999">(デモ)</span>' : ''}<br/>
          班：${d.team || '-'}<br/>
          高さ：${heightText}<br/>
          距離${d.distance}m ・ 角度${d.angle}°
          ${d.notes ? `<br/><i>${d.notes}</i>` : ''}
        </div>
      `);
      marker.addTo(layer);
    });
  }, [discoveries]);

  const withCoordsCount = discoveries.filter((d) => d.lat != null && d.lng != null).length;

  return (
    <div className="screen">
      <div className="toggle-row">
        <span>🗺️ 岳人の森 数学MAP（{withCoordsCount}件のピン）</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={showDemo} onChange={(e) => onToggleDemo(e.target.checked)} />
          デモ表示
        </label>
      </div>
      <div className="map-wrap" ref={containerRef} />
      <div className="hint" style={{ marginTop: 8 }}>
        ※このモックでは位置データは端末内（localStorage）にのみ保存されます。他の班の端末とは自動で共有されません。
      </div>
    </div>
  );
}
