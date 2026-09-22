const CATEGORY_ICON = { 木: '🌲', 植物: '🌿', 建物: '🏠', 斜面: '⛰️', 岩: '🪨', その他: '❓' };

export default function RecordsScreen({ discoveries, onOpen }) {
  return (
    <div className="screen">
      <h2 style={{ marginTop: 4 }}>自分たちの記録</h2>
      {discoveries.length === 0 ? (
        <div className="empty-state">
          まだ記録がないよ。
          <br />
          「新しく測る」から最初のDiscoveryを作ろう。
        </div>
      ) : (
        discoveries
          .slice()
          .reverse()
          .map((d) => (
            <div className="discovery-row" key={d.id} onClick={() => onOpen(d.id)}>
              <div className="thumb">
                {d.photo ? <img src={d.photo} alt={d.name} /> : CATEGORY_ICON[d.category] || '❓'}
              </div>
              <div className="meta">
                <div className="name">{d.name}</div>
                <div className="sub">
                  距離{d.distance}m ・ 角度{d.angle}°
                </div>
              </div>
              <div className="badge">{d.height != null ? `${d.height.toFixed(1)}m` : '？'}</div>
            </div>
          ))
      )}
    </div>
  );
}
