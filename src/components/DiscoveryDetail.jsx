import { useState } from 'react';
import TriangleDiagram from './TriangleDiagram.jsx';

const CATEGORY_ICON = { 木: '🌲', 植物: '🌿', 建物: '🏠', 斜面: '⛰️', 岩: '🪨', その他: '❓' };

function MeasurementCard({ discovery, onSave }) {
  const [editing, setEditing] = useState(false);
  const [distance, setDistance] = useState(discovery.distance);
  const [angle, setAngle] = useState(discovery.angle);
  const [eyeHeight, setEyeHeight] = useState(discovery.eyeHeight);

  if (!editing) {
    return (
      <div className="card" style={{ background: '#f2ede0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
          <span>距離</span><b>{discovery.distance}m</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
          <span>角度</span><b>{discovery.angle}°</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
          <span>目線</span><b>{discovery.eyeHeight}m</b>
        </div>
        <button className="btn btn-secondary" style={{ marginBottom: 0 }} onClick={() => setEditing(true)}>
          ✏️ 数値を修正する
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ background: '#f2ede0' }}>
      <div className="field">
        <label>距離</label>
        <div className="unit">
          <input type="number" inputMode="decimal" value={distance} onChange={(e) => setDistance(e.target.value)} />
          <span>m</span>
        </div>
      </div>
      <div className="field">
        <label>角度</label>
        <div className="unit">
          <input type="number" inputMode="decimal" value={angle} onChange={(e) => setAngle(e.target.value)} />
          <span>°</span>
        </div>
      </div>
      <div className="field" style={{ marginBottom: 12 }}>
        <label>目線の高さ</label>
        <div className="unit">
          <input type="number" step="0.01" value={eyeHeight} onChange={(e) => setEyeHeight(e.target.value)} />
          <span>m</span>
        </div>
      </div>
      <button
        className="btn btn-accent"
        disabled={!(Number(distance) > 0 && Number(angle) > 0 && Number(angle) < 90 && Number(eyeHeight) > 0)}
        onClick={() => {
          onSave({ distance: Number(distance), angle: Number(angle), eyeHeight: Number(eyeHeight) });
          setEditing(false);
        }}
      >
        保存する
      </button>
      <button className="btn btn-secondary" style={{ marginBottom: 0 }} onClick={() => setEditing(false)}>
        やめる
      </button>
    </div>
  );
}

export default function DiscoveryDetail({ discovery, unlocked, onCalculate, onUpdateMeasurements, onSaveNotes, onDelete, onRequestUnlock }) {
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
            <MeasurementCard discovery={discovery} onSave={(f) => onUpdateMeasurements(discovery.id, f)} />
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
            <MeasurementCard discovery={discovery} onSave={(f) => onUpdateMeasurements(discovery.id, f)} />
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
            <MeasurementCard discovery={discovery} onSave={(f) => onUpdateMeasurements(discovery.id, f)} />
            <div className="hint" style={{ marginTop: -6, marginBottom: 14 }}>
              数値を修正すると、高さは自動で計算し直される。
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
