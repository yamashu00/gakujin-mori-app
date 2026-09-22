const STEPS = [
  { n: 1, text: '岳人の森を歩く。' },
  { n: 2, text: '「これ、どうやったら測れる？」と思うものを探す。' },
  { n: 3, text: '写真・距離・角度を記録する。' },
  { n: 4, text: '数学を使って高さを求める。' },
  { n: 5, text: '岳人の森MAPに記録する。' },
];

export default function Mission({ onNavigate }) {
  return (
    <div className="screen">
      <div className="hero" style={{ paddingTop: 12 }}>
        <div className="eyebrow">TODAY'S MISSION</div>
        <h2 style={{ fontSize: 22 }}>直接測れないものを、数学で測れ。</h2>
      </div>

      <div className="mission-steps">
        {STEPS.map((s) => (
          <div className="mission-step" key={s.n}>
            <div className="num">{s.n}</div>
            <div>{s.text}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 20 }} />
      <button className="btn btn-accent" onClick={() => onNavigate('measure')}>
        測りに行く
      </button>
    </div>
  );
}
