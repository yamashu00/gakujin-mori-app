import { useEffect, useState } from 'react';

export default function AngleAssist({ onUse, onClose }) {
  const [angle, setAngle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let handler = null;

    const start = () => {
      handler = (e) => {
        if (e.beta == null) return;
        const raw = 90 - Math.abs(e.beta);
        setAngle(Math.round(Math.max(0, Math.min(90, raw))));
      };
      window.addEventListener('deviceorientation', handler);
    };

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((res) => {
          if (res === 'granted') start();
          else setError('センサーの利用が許可されなかったよ。手入力してね。');
        })
        .catch(() => setError('センサーを使えなかったよ。手入力してね。'));
    } else if (typeof DeviceOrientationEvent !== 'undefined') {
      start();
    } else {
      setError('この端末・ブラウザはセンサーに対応していないみたい。手入力してね。');
    }

    return () => {
      if (handler) window.removeEventListener('deviceorientation', handler);
    };
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>📐 角度センサー</h3>
        <p style={{ fontSize: 13, color: '#4a5449' }}>
          スマホを縦向きに持ち、画面を自分に向けたまま、スマホの上の辺を対象物の先端に合わせてみよう。
        </p>
        {error ? (
          <div className="error-text">{error}</div>
        ) : (
          <div className="result-hero">
            <div className="value" style={{ fontSize: 40 }}>{angle != null ? `${angle}°` : '…'}</div>
            <div className="label">あくまで目安。正確な値ではないよ。</div>
          </div>
        )}
        <button className="btn btn-accent" disabled={angle == null} onClick={() => onUse(angle)}>
          この角度を使う
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          手入力する
        </button>
      </div>
    </div>
  );
}
