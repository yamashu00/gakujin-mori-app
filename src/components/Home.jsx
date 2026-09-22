export default function Home({ team, unlocked, onNavigate }) {
  return (
    <div className="screen">
      <div className="hero">
        <div className="eyebrow">FOREST × MATH</div>
        <h2>
          岳人の森
          <br />
          数学MAP
        </h2>
        <p>
          森の中に隠れた三角形を探そう。
          <br />
          {team} で参加中{unlocked ? '・数学解放済み🔓' : ''}
        </p>
      </div>

      <button className="btn btn-accent" onClick={() => onNavigate('measure')}>
        📐 新しく測る
      </button>
      <button className="btn btn-primary" onClick={() => onNavigate('map')}>
        🗺️ MAPを見る
      </button>
      <button className="btn btn-outline" onClick={() => onNavigate('records')}>
        📋 自分たちの記録
      </button>
      <button className="btn btn-secondary" onClick={() => onNavigate('mission')}>
        🎯 今日のミッション
      </button>
      <button className="btn btn-secondary" onClick={() => onNavigate('reflection')}>
        🌱 振り返り
      </button>
    </div>
  );
}
