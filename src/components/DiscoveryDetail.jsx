import { useState } from 'react';
import TriangleDiagram from './TriangleDiagram.jsx';

const CATEGORY_ICON = { 木: '🌲', 植物: '🌿', 建物: '🏠', 斜面: '⛰️', 岩: '🪨', その他: '❓' };

export default function DiscoveryDetail({ discovery, unlocked, onCalculate, onSaveNotes, onDelete, onRequestUnlock }) {
  const [notes, setNotes] = useState(discovery.notes || '');
  const hasHeight = discovery.height != null;

  const calc = () => {
    const rad = (discovery.angle * Math.PI) / 180;
    const height = discovery.distance * Math.tan(rad) + discovery.eyeHeight;
    onCalculate(discovery.id, height);
  };

  return (
    <div className="screen">
      <div className="card">
        {discovery.photo && (
          <img src={discovery.photo} alt={discovery.name} style={{ width: '100%', borderRadius: 10, marginBottom: 12 }} />
        )}
        <div style={{ fontSize: 13, color: '#7a8378' }}>
          {CATEGORY_ICON[discovery.category] || '❓'} {discovery.category} ・ {discovery.team || 'あなたの班'}
        </div>
        <h2 style={{ margin: '4px 0 14px' }}>{discovery.name}</h2>

        {!unlocked ? (
          <>
            <div className="card" style={{ background: '#f2ede0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                <span>距離</span><b>{discovery.distance}m</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                <span>角度</span><b>{discovery.angle}°</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span>目線</span><b>{discovery.eyeHeight}m</b>
              </div>
            </div>
            <div className="locked-box">
              <div>この3つの数字には、どんな関係があると思う？</div>
              <div className="qmark">？？？</div>
              <div style={{ fontSize: 13 }}>高さ：まだ分からない</div>
            </div>
            <button className="btn btn-secondary" onClick={onRequestUnlock} style={{ marginTop: 14 }}>
              🔓 数学を解放して計算する
            </button>
          </>
        ) : !hasHeight ? (
          <>
            <div className="card" style={{ background: '#f2ede0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                <span>距離</span><b>{discovery.distance}m</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                <span>角度</span><b>{discovery.angle}°</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span>目線</span><b>{discovery.eyeHeight}m</b>
              </div>
            </div>
            <div className="formula-box">
              角度が同じとき、高さ ÷ 距離 は同じ割合になる。この割合を tan（タンジェント）と呼ぶ。
              <br />
              <b>高さ ＝ 距離 × tanθ ＋ 目線の高さ</b>
            </div>
            <button className="btn btn-accent" onClick={calc} style={{ marginTop: 14 }}>
              高さを計算する
            </button>
          </>
        ) : (
          <>
            <div className="result-hero">
              <div className="label">この{discovery.category}の推定高さ</div>
              <div className="value">約{discovery.height.toFixed(1)}m</div>
            </div>
            <TriangleDiagram distance={discovery.distance} angle={discovery.angle} height={discovery.height} />
            <div className="formula-box">
              {discovery.distance} × tan({discovery.angle}°) ＋ {discovery.eyeHeight} ＝ {discovery.height.toFixed(2)}m
            </div>
          </>
        )}

        <div className="field" style={{ marginTop: 18 }}>
          <label>気づいたこと</label>
          <textarea
            placeholder="例：思ったより木が高かった。"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => onSaveNotes(discovery.id, notes)}
          />
        </div>

        <button className="btn btn-secondary" onClick={() => onDelete(discovery.id)}>
          🗑 この記録を削除
        </button>
      </div>
    </div>
  );
}
