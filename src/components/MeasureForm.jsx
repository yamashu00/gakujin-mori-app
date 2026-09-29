import { useState } from 'react';
import { compressImage } from '../imageUtils.js';
import AngleAssist from './AngleAssist.jsx';

const CATEGORIES = ['木', '植物', '建物', '斜面', '岩', 'その他'];

export default function MeasureForm({ defaultEyeHeight, onCancel, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('木');
  const [photo, setPhoto] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [gps, setGps] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('idle'); // idle | loading | ok | err
  const [gpsError, setGpsError] = useState('');
  const [distance, setDistance] = useState('');
  const [angle, setAngle] = useState('');
  const [eyeHeight, setEyeHeight] = useState(String(defaultEyeHeight || '1.55'));
  const [showAngleAssist, setShowAngleAssist] = useState(false);

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    try {
      const dataUrl = await compressImage(file);
      setPhoto(dataUrl);
    } catch {
      setPhoto(null);
    } finally {
      setPhotoBusy(false);
    }
  };

  const getGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('err');
      setGpsError('この端末では位置情報が使えません。');
      return;
    }
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setGpsStatus('ok');
      },
      (err) => {
        setGpsStatus('err');
        setGpsError(
          err.code === 1
            ? '位置情報の利用が許可されていません。ブラウザの設定を確認してね。'
            : '位置情報を取得できませんでした。もう一度試してみて。'
        );
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const missing = [];
  if (name.trim().length === 0) missing.push('①対象物の名前');
  if (distance === '' || !(Number(distance) > 0)) missing.push('⑤距離');
  if (angle === '' || !(Number(angle) > 0 && Number(angle) < 90)) missing.push('⑥角度（0〜90の範囲）');
  if (eyeHeight === '' || !(Number(eyeHeight) > 0)) missing.push('目線の高さ');
  const canSave = missing.length === 0;

  const save = () => {
    onSave({
      name: name.trim(),
      category,
      photo,
      lat: gps?.lat ?? null,
      lng: gps?.lng ?? null,
      gpsAccuracy: gps?.accuracy ?? null,
      distance: Number(distance),
      angle: Number(angle),
      eyeHeight: Number(eyeHeight),
    });
  };

  return (
    <div className="screen">
      <div className="card">
        <div className="field">
          <label>①対象物の名前</label>
          <input
            type="text"
            placeholder="例：入口近くの大きな杉"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>②カテゴリー</label>
          <div className="category-grid">
            {CATEGORIES.map((c) => (
              <div
                key={c}
                className={`category-chip ${category === c ? 'selected' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        <div className="field">
          <label>③写真（なくても保存できる）</label>
          {photo ? (
            <div className="photo-box" onClick={() => document.getElementById('photo-input').click()}>
              <img src={photo} alt="対象物" />
            </div>
          ) : (
            <div className="photo-box" onClick={() => document.getElementById('photo-input').click()}>
              {photoBusy ? '読み込み中…' : '📷 タップして撮影 / 選択'}
            </div>
          )}
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handlePhoto}
          />
        </div>

        <div className="field">
          <label>④現在地</label>
          {gpsStatus === 'ok' && gps ? (
            <div className="gps-status ok">
              📍 取得済み（誤差 約{Math.round(gps.accuracy)}m）
            </div>
          ) : gpsStatus === 'loading' ? (
            <div className="gps-status">📡 取得中…</div>
          ) : (
            <button className="btn btn-outline" onClick={getGps}>
              📍 現在地を取得
            </button>
          )}
          {gpsStatus === 'err' && <div className="error-text">{gpsError}</div>}
          {gpsStatus !== 'ok' && (
            <div className="hint">GPSが取れなくても他の項目だけで保存できる。</div>
          )}
        </div>

        <div className="field">
          <label>⑤対象までの距離</label>
          <div className="unit">
            <input
              type="number"
              inputMode="decimal"
              placeholder="例：12.5"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
            <span>m</span>
          </div>
        </div>

        <div className="field">
          <label>⑥見上げる角度</label>
          <div className="unit">
            <input
              type="number"
              inputMode="decimal"
              placeholder="例：38"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
            />
            <span>°</span>
          </div>
          <div className="hint">分度器や下のセンサーで測った角度を入力しよう。</div>
          <button type="button" className="btn btn-outline" style={{ marginTop: 8 }} onClick={() => setShowAngleAssist(true)}>
            📐 角度センサーを使う（目安）
          </button>
        </div>

        <div className="field">
          <label>目線の高さ</label>
          <div className="unit">
            <input
              type="number"
              step="0.01"
              value={eyeHeight}
              onChange={(e) => setEyeHeight(e.target.value)}
            />
            <span>m</span>
          </div>
        </div>

        {!canSave && (
          <div className="error-text" style={{ marginBottom: 8 }}>
            未入力・未確定の項目があります：{missing.join('、')}
          </div>
        )}
        <button className="btn btn-accent" disabled={!canSave} onClick={save}>
          保存する
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          やめる
        </button>
      </div>

      {showAngleAssist && (
        <AngleAssist
          onClose={() => setShowAngleAssist(false)}
          onUse={(a) => {
            setAngle(String(a));
            setShowAngleAssist(false);
          }}
        />
      )}
    </div>
  );
}
